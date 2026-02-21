const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    // Store registration data temporarily until OTP is verified
    userData: {
        name: { type: String, required: true },
        password: { type: String, required: true }, // Already hashed
    },
    attempts: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Auto-delete after 10 minutes (TTL index)
    },
});

module.exports = mongoose.model("OTP", otpSchema);
