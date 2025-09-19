import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  fullName:      { type: String, required: true, minlength: 2, maxlength: 120 },
  idNumber:      { type: String, required: true, unique: true, match: [/^\d{13}$/, "Invalid SA ID"] },
  accountNumber: { type: String, required: true, unique: true, match: [/^\d{8,16}$/, "Invalid account number"] },
  username:      { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
  passwordHash:  { type: String, required: true },
  role:          { type: String, enum: ["customer","admin"], default: "customer", index: true },
}, { timestamps: true, versionKey: false });

export default model("User", UserSchema);
