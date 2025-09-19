"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01, max: 10000000 },
    currency: { type: String, required: true, match: [/^[A-Z]{3}$/, "Invalid currency"] },
    provider: { type: String, enum: ["SWIFT"], default: "SWIFT" },
    payeeAccount: { type: String, required: true, match: [/^\d{8,20}$/, "Invalid payee account"] },
    swiftCode: { type: String, required: true, match: [/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT"] },
    status: { type: String, enum: ["pending_verification", "verified", "submitted_to_swift"], default: "pending_verification", index: true },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose_1.Types.ObjectId, ref: "User" },
    submittedAt: { type: Date },
    submittedBy: { type: mongoose_1.Types.ObjectId, ref: "User" },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("Payment", PaymentSchema);
//# sourceMappingURL=Payment.js.map