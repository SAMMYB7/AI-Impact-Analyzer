const express = require("express");
const router = express.Router();
const {
    register,
    verifyOTP,
    resendOTP,
    login,
    getMe,
    updateProfile,
    updatePassword,
    connectGithub,
    disconnectGithub,
    githubAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/github", githubAuth);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.post("/connect-github", protect, connectGithub);
router.delete("/disconnect-github", protect, disconnectGithub);

module.exports = router;
