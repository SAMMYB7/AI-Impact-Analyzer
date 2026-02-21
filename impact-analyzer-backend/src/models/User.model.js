const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── GitHub OAuth Fields ───────────────────────────────────
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values (for email/password users)
    },
    githubUsername: {
      type: String,
      default: "",
    },
    githubAccessToken: {
      type: String,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "github"],
      default: "local",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ──────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  // Prevent double-hashing (bcrypt hashes start with $2)
  if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$") || this.password.startsWith("$2y$")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Compare password ─────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Generate JWT ─────────────────────────────────────────────
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ── Transform output (hide sensitive fields) ─────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.githubAccessToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
