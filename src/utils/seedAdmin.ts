import User from "../models/User";
import bcrypt from "bcrypt";

export async function seedAdmin(){
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return;
  const exists = await User.findOne({ role: "admin" });
  if (exists) return;
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    fullName: "Bank Admin",
    idNumber: "0000000000000",
    accountNumber: "99999999",
    username: ADMIN_USERNAME,
    passwordHash,
    role: "admin",
  });
}