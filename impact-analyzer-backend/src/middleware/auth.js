const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// ── Protect routes — verify JWT token ────────────────────────
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for Bearer token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                error: "Not authorized — no token provided",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and attach to request
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                error: "Not authorized — user not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired — please log in again" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(401).json({ error: "Not authorized" });
    }
};

// ── Admin only ───────────────────────────────────────────────
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ error: "Access denied — admin only" });
};

module.exports = { protect, adminOnly };
