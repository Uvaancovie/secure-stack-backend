"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seedAdmin() {
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD)
        return;
    const exists = await User_1.default.findOne({ role: "admin" });
    if (exists)
        return;
    const passwordHash = await bcrypt_1.default.hash(ADMIN_PASSWORD, 12);
    await User_1.default.create({
        fullName: "Bank Admin",
        idNumber: "0000000000000",
        accountNumber: "99999999",
        username: ADMIN_USERNAME,
        passwordHash,
        role: "admin",
    });
}
//# sourceMappingURL=seedAdmin.js.map