const User = require("../models/User.model");
const OTP = require("../models/OTP.model");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

// ── Helper: Send token response ──────────────────────────────
function sendTokenResponse(user, statusCode, res) {
    const token = user.generateAuthToken();

    // Update last login without triggering pre-save hooks
    User.updateOne({ _id: user._id }, { lastLogin: Date.now() }).catch(() => { });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            authProvider: user.authProvider,
            githubUsername: user.githubUsername,
            lastLogin: user.lastLogin,
        },
    });
}

// ══════════════════════════════════════════════════════════════
// POST /api/auth/register — Step 1: Send OTP to email
// ══════════════════════════════════════════════════════════════
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "Please provide name, email, and password" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Rate limit: prevent OTP spam (max 1 per 60 seconds)
        const recentOTP = await OTP.findOne({ email });
        if (recentOTP) {
            const timeSince = Date.now() - recentOTP.createdAt.getTime();
            if (timeSince < 60000) {
                const waitSeconds = Math.ceil((60000 - timeSince) / 1000);
                return res.status(429).json({
                    error: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
                });
            }
            // Delete old OTP
            await OTP.deleteMany({ email });
        }

        // Hash password now (so we don't store plain text in OTP doc)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with user data
        await OTP.create({
            email,
            otp,
            userData: {
                name,
                password: hashedPassword,
            },
        });

        // Send OTP email
        await sendOTPEmail(email, otp, name);

        res.status(200).json({
            success: true,
            message: "Verification code sent to your email",
            email,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/verify-otp — Step 2: Verify OTP & create user
// ══════════════════════════════════════════════════════════════
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res
                .status(400)
                .json({ error: "Please provide email and verification code" });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                error: "Verification code expired or not found. Please register again.",
            });
        }

        // Check attempts (max 5)
        if (otpRecord.attempts >= 5) {
            await OTP.deleteMany({ email });
            return res.status(429).json({
                error: "Too many failed attempts. Please register again.",
            });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({
                error: `Invalid verification code. ${5 - otpRecord.attempts} attempts remaining.`,
            });
        }

        // Check if user was created meanwhile
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await OTP.deleteMany({ email });
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create user with stored data (password already hashed)
        const user = new User({
            name: otpRecord.userData.name,
            email,
            password: otpRecord.userData.password,
            authProvider: "local",
        });

        // Save the verified user. The pre-save hook safely detects it's already hashed.
        await user.save();

        // Clean up OTP
        await OTP.deleteMany({ email });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/resend-otp — Resend OTP
// ══════════════════════════════════════════════════════════════
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find existing OTP record
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                error: "No pending registration found. Please register again.",
            });
        }

        // Rate limit: 60 seconds between resends
        const timeSince = Date.now() - otpRecord.createdAt.getTime();
        if (timeSince < 60000) {
            const waitSeconds = Math.ceil((60000 - timeSince) / 1000);
            return res.status(429).json({
                error: `Please wait ${waitSeconds} seconds before requesting a new code`,
            });
        }

        // Generate new OTP and update record
        const newOTP = generateOTP();

        await OTP.deleteMany({ email });
        await OTP.create({
            email,
            otp: newOTP,
            userData: otpRecord.userData,
            attempts: 0,
        });

        // Send new OTP
        await sendOTPEmail(email, newOTP, otpRecord.userData.name);

        res.status(200).json({
            success: true,
            message: "New verification code sent to your email",
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ error: "Failed to resend verification code" });
    }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/login — Login with email/password
// ══════════════════════════════════════════════════════════════
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Please provide email and password" });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check if user was registered with GitHub (no password)
        if (user.authProvider === "github" && !user.password) {
            return res.status(401).json({
                error:
                    "This account uses GitHub login. Please sign in with GitHub instead.",
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

// ══════════════════════════════════════════════════════════════
// GET /api/auth/me — Get current user profile
// ══════════════════════════════════════════════════════════════
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                authProvider: user.authProvider,
                githubUsername: user.githubUsername,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ error: "Failed to get user profile" });
    }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/auth/profile — Update profile (name, avatar)
// ══════════════════════════════════════════════════════════════
exports.updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const updates = {};

        if (name && name.trim()) {
            if (name.trim().length > 100) {
                return res.status(400).json({ error: "Name must be under 100 characters" });
            }
            updates.name = name.trim();
        }
        if (avatar !== undefined) updates.avatar = avatar;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        await User.updateOne({ _id: req.user.id }, updates);
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                authProvider: user.authProvider,
                githubUsername: user.githubUsername,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/auth/password — Change password
// ══════════════════════════════════════════════════════════════
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id).select("+password");

        // If user has a password (local auth), verify current password
        if (user.password) {
            if (!currentPassword) {
                return res.status(400).json({ error: "Current password is required" });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }
        }

        // Set new password (the pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/connect-github — Link GitHub to existing account
// ══════════════════════════════════════════════════════════════
exports.connectGithub = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }

        // Exchange code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const { access_token, error: tokenError } = tokenResponse.data;
        if (tokenError || !access_token) {
            return res.status(400).json({ error: "Failed to authenticate with GitHub" });
        }

        // Fetch GitHub profile
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${access_token}` },
        });
        const githubUser = userResponse.data;

        // Check if this GitHub account is already linked to another user
        const existingGithubUser = await User.findOne({ githubId: String(githubUser.id) });
        if (existingGithubUser && String(existingGithubUser._id) !== String(req.user.id)) {
            return res.status(400).json({
                error: "This GitHub account is already linked to another user",
            });
        }

        // Link GitHub to current user
        await User.updateOne(
            { _id: req.user.id },
            {
                githubId: String(githubUser.id),
                githubUsername: githubUser.login,
                githubAccessToken: access_token,
                avatar: githubUser.avatar_url || req.user.avatar,
            }
        );

        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: "GitHub account connected successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                authProvider: user.authProvider,
                githubUsername: user.githubUsername,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Connect GitHub error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to connect GitHub account" });
    }
};

// ══════════════════════════════════════════════════════════════
// DELETE /api/auth/disconnect-github — Unlink GitHub from account
// ══════════════════════════════════════════════════════════════
exports.disconnectGithub = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        // Prevent disconnect if user has no password (GitHub-only account)
        if (user.authProvider === "github" && !user.password) {
            return res.status(400).json({
                error: "Please set a password before disconnecting GitHub (you'd be locked out otherwise)",
            });
        }

        await User.updateOne(
            { _id: req.user.id },
            {
                $unset: { githubId: 1, githubAccessToken: 1 },
                githubUsername: "",
            }
        );

        const updatedUser = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: "GitHub account disconnected",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
                authProvider: updatedUser.authProvider,
                githubUsername: updatedUser.githubUsername,
                lastLogin: updatedUser.lastLogin,
                createdAt: updatedUser.createdAt,
            },
        });
    } catch (error) {
        console.error("Disconnect GitHub error:", error);
        res.status(500).json({ error: "Failed to disconnect GitHub" });
    }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/github — GitHub OAuth: exchange code for token
// ══════════════════════════════════════════════════════════════
exports.githubAuth = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }

        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        const { access_token, error: tokenError } = tokenResponse.data;

        if (tokenError || !access_token) {
            console.error("GitHub token error:", tokenResponse.data);
            return res.status(400).json({
                error: "Failed to authenticate with GitHub. Please try again.",
            });
        }

        // Step 2: Fetch GitHub user profile
        const [userResponse, emailsResponse] = await Promise.all([
            axios.get("https://api.github.com/user", {
                headers: { Authorization: `token ${access_token}` },
            }),
            axios.get("https://api.github.com/user/emails", {
                headers: { Authorization: `token ${access_token}` },
            }),
        ]);

        const githubUser = userResponse.data;

        // Get primary email from GitHub
        const primaryEmail = emailsResponse.data.find(
            (e) => e.primary && e.verified
        );
        const email =
            primaryEmail?.email || githubUser.email || `${githubUser.id}@github.user`;

        // Step 3: Find or create user
        let user = await User.findOne({
            $or: [{ githubId: String(githubUser.id) }, { email }],
        });

        if (user) {
            // Update existing user with latest GitHub info (bypass pre-save hooks)
            await User.updateOne(
                { _id: user._id },
                {
                    githubId: String(githubUser.id),
                    githubUsername: githubUser.login,
                    githubAccessToken: access_token,
                    avatar: githubUser.avatar_url || user.avatar,
                    ...((!user.name || user.name === email) && {
                        name: githubUser.name || githubUser.login,
                    }),
                }
            );
            // Re-fetch updated user
            user = await User.findById(user._id);
        } else {
            // Create new user from GitHub profile
            user = await User.create({
                name: githubUser.name || githubUser.login,
                email,
                githubId: String(githubUser.id),
                githubUsername: githubUser.login,
                githubAccessToken: access_token,
                avatar: githubUser.avatar_url,
                authProvider: "github",
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("GitHub Auth error:", error?.response?.data || error.message);
        res.status(500).json({ error: "GitHub authentication failed" });
    }
};
