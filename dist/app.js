"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", process.env.WEB_ORIGIN],
            "frame-ancestors": ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({ origin: process.env.WEB_ORIGIN, credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Rate limiting
app.use("/api/auth/", (0, express_rate_limit_1.default)({ windowMs: 60000, max: 5 })); // brute-force guard
app.use("/api/", (0, express_rate_limit_1.default)({ windowMs: 60000, max: 60 })); // generic DoS guard
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const payment_1 = __importDefault(require("./routes/payment"));
const admin_1 = __importDefault(require("./routes/admin"));
app.use("/api/auth", auth_1.default);
app.use("/api/payments", payment_1.default);
app.use("/api/admin", admin_1.default);
// Global error handler
app.use((err, req, res, next) => {
    console.error({ path: req.path, err: err?.message });
    res.status(500).json({ error: { code: "INTERNAL_ERROR" } });
});
exports.default = app;
//# sourceMappingURL=app.js.map