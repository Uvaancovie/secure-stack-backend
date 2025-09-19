"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const payment_1 = require("../validators/payment");
const Payment_1 = __importDefault(require("../models/Payment"));
const router = (0, express_1.Router)();
// All payment routes require authentication
router.use(auth_1.requireAuth);
// Create payment
router.post("/", (0, validate_1.validate)(payment_1.paymentSchema), async (req, res) => {
    try {
        const { amount, currency, payeeAccount, swiftCode } = req.body;
        const customerId = req.user.id; // Using ! since requireAuth ensures user exists
        // Create payment record
        const payment = new Payment_1.default({
            customerId,
            amount,
            currency,
            payeeAccount,
            swiftCode,
            status: "pending_verification"
        });
        await payment.save();
        res.status(201).json({
            success: true,
            payment: {
                id: payment._id,
                amount: payment.amount,
                currency: payment.currency,
                payeeAccount: payment.payeeAccount,
                swiftCode: payment.swiftCode,
                status: payment.status,
                createdAt: payment.createdAt
            }
        });
    }
    catch (error) {
        console.error("Payment creation error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Payment creation failed" }
        });
    }
});
// Get user's payments
router.get("/", async (req, res) => {
    try {
        const customerId = req.user.id; // Using ! since requireAuth ensures user exists
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const payments = await Payment_1.default.find({ customerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-customerId");
        const total = await Payment_1.default.countDocuments({ customerId });
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
// Get specific payment
router.get("/:id", async (req, res) => {
    try {
        const customerId = req.user.id; // Using ! since requireAuth ensures user exists
        const paymentId = req.params.id;
        const payment = await Payment_1.default.findOne({ _id: paymentId, customerId }).select("-customerId");
        if (!payment) {
            return res.status(404).json({
                error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" }
            });
        }
        res.json({
            success: true,
            payment
        });
    }
    catch (error) {
        console.error("Get payment error:", error);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Failed to retrieve payment" }
        });
    }
});
exports.default = router;
//# sourceMappingURL=payment.js.map