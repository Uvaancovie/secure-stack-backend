import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src":  ["'self'"],
      "style-src":   ["'self'", "'unsafe-inline'"],
      "connect-src": ["'self'", process.env.WEB_ORIGIN!],
      "frame-ancestors": ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// More permissive CORS for development
console.log('WEB_ORIGIN:', process.env.WEB_ORIGIN);
app.use(cors({ 
  origin: process.env.WEB_ORIGIN || 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Rate limiting
app.use("/api/auth/", rateLimit({ windowMs: 60_000, max: 5 }));   // brute-force guard
app.use("/api/",      rateLimit({ windowMs: 60_000, max: 60 }));  // generic DoS guard

// Routes
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payment";
import adminRoutes from "./routes/admin";

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err:any, req:any, res:any, next:any)=>{
  console.error({ path: req.path, err: err?.message });
  res.status(500).json({ error: { code: "INTERNAL_ERROR" } });
});

export default app;