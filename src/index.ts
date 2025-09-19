import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import { seedAdmin } from "./utils/seedAdmin";

// Load environment variables
dotenv.config();
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);
console.log('WEB_ORIGIN loaded:', process.env.WEB_ORIGIN);
console.log('All env vars:', Object.keys(process.env).filter(k => k.startsWith('WEB_') || k.startsWith('MONGO_')));

async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("MONGO_URI missing"); process.exit(1); }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await seedAdmin();

  const port = Number(process.env.PORT || 8080);
  app.listen(port, () => console.log(`API running on :${port}`));
}

start().catch(err => { console.error("Startup error:", err); process.exit(1); });