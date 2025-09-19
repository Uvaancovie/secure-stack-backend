import { Schema, model, Types } from "mongoose";

const PaymentSchema = new Schema({
  customerId:   { type: Types.ObjectId, ref: "User", required: true, index: true },
  amount:       { type: Number, required: true, min: 0.01, max: 10000000 },
  currency:     { type: String, required: true, match: [/^[A-Z]{3}$/, "Invalid currency"] },
  provider:     { type: String, enum: ["SWIFT"], default: "SWIFT" },
  payeeAccount: { type: String, required: true, match: [/^\d{8,20}$/, "Invalid payee account"] },
  swiftCode:    { type: String, required: true, match: [/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT"] },
  // Recipient information
  recipient: {
    name:       { type: String, required: true },
    bank:       { type: String, required: true },
    account:    { type: String, required: true },
    swiftCode:  { type: String, required: true }
  },
  status:       { type: String, enum: ["pending","verified","submitted"], default: "pending", index: true },
  verifiedAt:   { type: Date },
  verifiedBy:   { type: Types.ObjectId, ref: "User" },
  submittedAt:  { type: Date },
  submittedBy:  { type: Types.ObjectId, ref: "User" },
}, { timestamps: true, versionKey: false });

export default model("Payment", PaymentSchema);

// swift code is the identifier for banks in international transactions
// it varies via bank but not via customer 
// list of bank