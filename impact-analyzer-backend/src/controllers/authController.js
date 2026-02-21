const User = require("../models/User.model");
const axios = require("axios");

// ── Helper: Send token response ──────────────────────────────
function sendTokenResponse(user, statusCode, res) {
    const token = user.generateAuthToken();

    // Update last login
    user.lastLogin = Date.now();
    user.save({ validateBeforeSave: false });

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
// POST /api/auth/register — Create account with email/password
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

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            authProvider: "local",
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
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
            // Update existing user with latest GitHub info
            user.githubId = String(githubUser.id);
            user.githubUsername = githubUser.login;
            user.githubAccessToken = access_token;
            user.avatar = githubUser.avatar_url || user.avatar;
            if (!user.name || user.name === email) {
                user.name = githubUser.name || githubUser.login;
            }
            await user.save({ validateBeforeSave: false });
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
