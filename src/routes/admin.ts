import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import Payment from "../models/Payment";
import User from "../models/User";
import { submitToSwift } from "../services/swiftClient";
import { Types } from "mongoose";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole("admin"));

// Get all pending payments for verification
router.get("/payments/pending", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ status: "pending" })
      .populate("customerId", "username fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments({ status: "pending" });

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
  } catch (error) {
    console.error("Get pending payments error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve pending payments" }
    });
  }
});

// Get ALL payments for admin dashboard (not just pending)
router.get("/payments", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50; // Higher limit for admin view
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate("customerId", "username fullName")
      .populate("verifiedBy", "username")
      .populate("submittedBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(filter);

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
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve payments" }
    });
  }
});

// Verify payment (individual)
router.post("/verify/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const adminId = req.user!.id; // Using ! since requireAuth ensures user exists

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" }
      });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        error: { code: "INVALID_STATUS", message: "Payment not in pending status" }
      });
    }

    // Update payment status
    payment.status = "verified";
    payment.verifiedAt = new Date();
    payment.verifiedBy = adminId as any; // Type assertion due to Mongoose typing complexity
    await payment.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to verify payment" }
    });
  }
});

// Submit individual payment to SWIFT
router.post("/submit/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const adminId = req.user!.id;

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" }
      });
    }

    if (payment.status !== "verified") {
      return res.status(400).json({
        error: { code: "INVALID_STATUS", message: "Payment must be verified before submission" }
      });
    }

    // Submit to SWIFT
    const swiftResult = await submitToSwift([payment]);

    // Update payment status
    payment.status = "submitted";
    payment.submittedAt = new Date();
    payment.submittedBy = adminId as any;
    await payment.save();

    res.json({
      success: true,
      message: "Payment submitted to SWIFT successfully",
      payment,
      swiftReference: swiftResult.reference
    });
  } catch (error) {
    console.error("Submit to SWIFT error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to submit payment to SWIFT" }
    });
  }
});

// Get dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
    const [
      totalPayments,
      pendingPayments,
      verifiedPayments,
      submittedPayments,
      totalUsers
    ] = await Promise.all([
      Payment.countDocuments(),
      Payment.countDocuments({ status: "pending" }),
      Payment.countDocuments({ status: "verified" }),
      Payment.countDocuments({ status: "submitted" }),
      User.countDocuments({ role: "customer" })
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
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve dashboard data" }
    });
  }
});

export default router;
