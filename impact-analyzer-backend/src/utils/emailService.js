// ═══════════════════════════════════════════════════════════════
// EMAIL SERVICE — Nodemailer utility for sending OTP emails
// ═══════════════════════════════════════════════════════════════

const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Impact Analyzer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email — Impact Analyzer",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0e1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e1a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="460" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.1); overflow: hidden;">
                
                <!-- Accent line -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, #14b8a6, #8b5cf6, #3b82f6);"></td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 36px;">
                    
                    <!-- Logo -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                      <tr>
                        <td style="width: 36px; height: 36px; background: linear-gradient(135deg, #14b8a6, #8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle;">
                          <span style="color: white; font-size: 18px; font-weight: bold;">⚡</span>
                        </td>
                        <td style="padding-left: 10px;">
                          <span style="color: #f1f5f9; font-size: 15px; font-weight: 800; letter-spacing: -0.5px;">Impact Analyzer</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Greeting -->
                    <p style="color: #f1f5f9; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                      Hello${name ? `, ${name}` : ""}! 👋
                    </p>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0;">
                      Use the verification code below to complete your registration. This code expires in <strong style="color: #f1f5f9;">10 minutes</strong>.
                    </p>

                    <!-- OTP Code -->
                    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center" style="background-color: rgba(20, 184, 166, 0.06); border: 1px solid rgba(20, 184, 166, 0.15); border-radius: 12px; padding: 24px;">
                          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #14b8a6; font-family: 'Courier New', monospace;">
                            ${otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning -->
                    <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
                      If you didn't request this code, you can safely ignore this email. Never share this code with anyone.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 36px; border-top: 1px solid rgba(148, 163, 184, 0.08);">
                    <p style="color: #475569; font-size: 11px; margin: 0; text-align: center;">
                      🔒 Secured with 256-bit encryption &nbsp;·&nbsp; © ${new Date().getFullYear()} Impact Analyzer
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to ${email} (messageId: ${info.messageId})`);
  return info;
};

// Send Password Reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Impact Analyzer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request — Impact Analyzer",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0e1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e1a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="460" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.1); overflow: hidden;">
                
                <!-- Accent line -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, #14b8a6, #8b5cf6, #3b82f6);"></td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 36px;">
                    
                    <!-- Logo -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                      <tr>
                        <td style="width: 36px; height: 36px; background: linear-gradient(135deg, #14b8a6, #8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle;">
                          <span style="color: white; font-size: 18px; font-weight: bold;">⚡</span>
                        </td>
                        <td style="padding-left: 10px;">
                          <span style="color: #f1f5f9; font-size: 15px; font-weight: 800; letter-spacing: -0.5px;">Impact Analyzer</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Greeting -->
                    <p style="color: #f1f5f9; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                      Password Reset Request 🔐
                    </p>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 28px 0;">
                      You are receiving this email because you (or someone else) have requested the reset of a password. Please make a put request to: <br/><br/>
                      <a href="${resetUrl}" style="color: #14b8a6; text-decoration: none; word-break: break-all;">${resetUrl}</a><br/><br/>
                      This link will remain active for <strong style="color: #f1f5f9;">10 minutes</strong>.
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(90deg, #14b8a6, #3b82f6); color: white; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px;">Reset Password</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning -->
                    <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
                      If you did not request this, please ignore this email and your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 36px; border-top: 1px solid rgba(148, 163, 184, 0.08);">
                    <p style="color: #475569; font-size: 11px; margin: 0; text-align: center;">
                      🔒 Secured with 256-bit encryption &nbsp;·&nbsp; © ${new Date().getFullYear()} Impact Analyzer
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Password reset email sent to ${email} (messageId: ${info.messageId})`);
  return info;
};

module.exports = { generateOTP, sendOTPEmail, sendPasswordResetEmail };
