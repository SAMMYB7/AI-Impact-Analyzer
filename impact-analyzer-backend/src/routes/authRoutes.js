const express = require("express");
const router = express.Router();
const {
    register,
    verifyOTP,
    resendOTP,
    login,
    getMe,
    githubAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);       // Step 1: Send OTP
router.post("/verify-otp", verifyOTP);     // Step 2: Verify OTP & create user
router.post("/resend-otp", resendOTP);     // Resend OTP
router.post("/login", login);
router.post("/github", githubAuth);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
