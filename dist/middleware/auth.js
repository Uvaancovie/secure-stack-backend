"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const token = req.cookies?.token; // Changed from access_token to token to match auth routes
    if (!token)
        return res.status(401).json({ error: { code: "UNAUTHENTICATED" } });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = { id: decoded.userId, username: decoded.username, role: decoded.role };
        next();
    }
    catch {
        return res.status(401).json({ error: { code: "UNAUTHENTICATED" } });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (req.user?.role !== role)
            return res.status(403).json({ error: { code: "FORBIDDEN" } });
        next();
    };
}
//# sourceMappingURL=auth.js.map