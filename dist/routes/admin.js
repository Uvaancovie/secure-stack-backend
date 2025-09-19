"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Payment_1 = __importDefault(require("../models/Payment"));
const User_1 = __importDefault(require("../models/User"));
const swiftClient_1 = require("../services/swiftClient");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_1.requireAuth);
router.use((0, auth_1.requireRole)("admin"));
// Get all pending payments for verification
router.get("/payments/pending", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const payments = await Payment_1.default.find({ status: "pending_verification" })
            .populate("customerId", "username fullName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Payment_1.default.countDocuments({ status: "pending_verification" });
        res.json({
            success: true,
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Get pending payments error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to retrieve pending payments" }
        });
    }
});
// Verify payment
router.post("/payments/:id/verify", async (req, res) => {
    try {
        const paymentId = req.params.id;
        const adminId = req.user.id; // Using ! since requireAuth ensures user exists
        const payment = await Payment_1.default.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" }
            });
        }
        if (payment.status !== "pending_verification") {
            return res.status(400).json({
                error: { code: "INVALID_STATUS", message: "Payment not in pending verification status" }
            });
        }
        // Update payment status
        payment.status = "verified";
        payment.verifiedAt = new Date();
        payment.verifiedBy = adminId; // Type assertion due to Mongoose typing complexity
        await payment.save();
        res.json({
            success: true,
            message: "Payment verified successfully",
            payment: {
                id: payment._id,
                status: payment.status,
                verifiedAt: payment.verifiedAt
            }
        });
    }
    catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to verify payment" }
        });
    }
});
// Submit verified payments to SWIFT
router.post("/payments/submit-to-swift", async (req, res) => {
    try {
        const adminId = req.user.id; // Using ! since requireAuth ensures user exists
        // Get all verified payments
        const verifiedPayments = await Payment_1.default.find({ status: "verified" });
        if (verifiedPayments.length === 0) {
            return res.status(400).json({
                error: { code: "NO_PAYMENTS", message: "No verified payments to submit" }
            });
        }
        // Submit to SWIFT
        const swiftResult = await (0, swiftClient_1.submitToSwift)(verifiedPayments);
        // Update payment statuses
        const updatePromises = verifiedPayments.map(payment => {
            payment.status = "submitted_to_swift";
            payment.submittedAt = new Date();
            payment.submittedBy = adminId; // Type assertion due to Mongoose typing complexity
            return payment.save();
        });
        await Promise.all(updatePromises);
        res.json({
            success: true,
            message: "Payments submitted to SWIFT successfully",
            result: {
                submitted: verifiedPayments.length,
                swiftReference: swiftResult.reference
            }
        });
    }
    catch (error) {
        console.error("Submit to SWIFT error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to submit payments to SWIFT" }
        });
    }
});
// Get all payments (admin view)
router.get("/payments", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const skip = (page - 1) * limit;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        const payments = await Payment_1.default.find(filter)
            .populate("customerId", "username fullName")
            .populate("verifiedBy", "username")
            .populate("submittedBy", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Payment_1.default.countDocuments(filter);
        res.json({
            success: true,
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to retrieve payments" }
        });
    }
});
// Get dashboard statistics
router.get("/dashboard", async (req, res) => {
    try {
        const [totalPayments, pendingPayments, verifiedPayments, submittedPayments, totalUsers] = await Promise.all([
            Payment_1.default.countDocuments(),
            Payment_1.default.countDocuments({ status: "pending_verification" }),
            Payment_1.default.countDocuments({ status: "verified" }),
            Payment_1.default.countDocuments({ status: "submitted_to_swift" }),
            User_1.default.countDocuments({ role: "customer" })
        ]);
        res.json({
            success: true,
            statistics: {
                totalPayments,
                pendingPayments,
                verifiedPayments,
                submittedPayments,
                totalUsers
            }
        });
    }
    catch (error) {
        console.error("Get dashboard error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to retrieve dashboard data" }
        });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map