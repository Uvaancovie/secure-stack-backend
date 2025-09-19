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
// Configure CORS with an allowlist. Support a comma-separated WEB_ORIGIN env var.
// Normalize origins: remove trailing slashes and lowercase so configured values like
// 'https://secure-stack-frontend.vercel.app/' match the browser Origin 'https://secure-stack-frontend.vercel.app'
const configured = (process.env.WEB_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const normalize = (s: string) => s.replace(/\/+$/, '').toLowerCase()
let rawOrigins = configured.map(normalize)

// If running in production and no explicit WEB_ORIGIN was provided, add a safe
// fallback for the expected Vercel frontend domain so CORS won't block the app
// while you deploy environment variables. This is a pragmatic fallback only.
if (process.env.NODE_ENV === 'production' && (!process.env.WEB_ORIGIN || rawOrigins.length === 0)) {
  const fallback = 'https://secure-stack-frontend.vercel.app'
  if (!rawOrigins.includes(normalize(fallback))) rawOrigins.push(normalize(fallback))
  console.warn('[CORS] No WEB_ORIGIN configured for production - adding temporary fallback:', fallback)
}

const corsOptions = {
  origin: (incomingOrigin: any, callback: any) => {
    // If no origin (e.g. curl, server-to-server), allow it.
    if (!incomingOrigin) return callback(null, true)
    const normalized = normalize(String(incomingOrigin))
    // If wildcard present, allow any origin
    if (rawOrigins.includes('*')) return callback(null, incomingOrigin)
    if (rawOrigins.includes(normalized)) return callback(null, incomingOrigin)
    console.warn('CORS origin denied:', incomingOrigin, 'normalized->', normalized)
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}

// Use the cors middleware but also add an explicit preflight responder that
// always returns the necessary Access-Control-Allow-* headers for allowed origins.
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Explicit preflight handling: set CORS headers for allowed origins and end OPTIONS early.
app.use((req, res, next) => {
  const origin = req.get('Origin')
  if (!origin) return next()
  const normalized = normalize(origin)
  const allowed = rawOrigins.includes('*') || rawOrigins.includes(normalized)
  if (allowed) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  return next()
})
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