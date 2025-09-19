import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { paymentSchema } from "../validators/payment";
import Payment from "../models/Payment";
import { submitToSwift } from "../services/swiftClient";

const router = Router();

// All payment routes require authentication
router.use(requireAuth);

// Create payment
router.post("/", validate(paymentSchema), async (req, res) => {
  try {
    const { amount, currency, payeeAccount, swiftCode, recipient } = req.body;
    const customerId = req.user!.id; // Using ! since requireAuth ensures user exists

    // Create payment record
    const payment = new Payment({
      customerId,
      amount,
      currency,
      payeeAccount,
      swiftCode,
      recipient: {
        name: recipient.name,
        bank: recipient.bank,
        account: payeeAccount,
        swiftCode: swiftCode
      },
      status: "pending"
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
        recipient: payment.recipient,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Payment creation failed" }
    });
  }
});

// Get user's payments
router.get("/", async (req, res) => {
  try {
    const customerId = req.user!.id; // Using ! since requireAuth ensures user exists
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-customerId");

    const total = await Payment.countDocuments({ customerId });

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

// Get specific payment
router.get("/:id", async (req, res) => {
  try {
    const customerId = req.user!.id; // Using ! since requireAuth ensures user exists
    const paymentId = req.params.id;

    const payment = await Payment.findOne({ _id: paymentId, customerId }).select("-customerId");

    if (!payment) {
      return res.status(404).json({
        error: { code: "PAYMENT_NOT_FOUND", message: "Payment not found" }
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve payment" }
    });
  }
});

export default router;
