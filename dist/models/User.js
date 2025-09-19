"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, minlength: 2, maxlength: 120 },
    idNumber: { type: String, required: true, unique: true, match: [/^\d{13}$/, "Invalid SA ID"] },
    accountNumber: { type: String, required: true, unique: true, match: [/^\d{8,16}$/, "Invalid account number"] },
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
}, { timestamps: true, versionKey: false });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ accountNumber: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=User.js.map