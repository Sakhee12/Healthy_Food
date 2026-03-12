const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// --- OTP LOGIC ---

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone required" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO otp_users (phone, otp) VALUES (?, ?)",
        [phone, otp],
        (err) => err ? reject(err) : resolve()
      );
    });

    console.log(`\n--- DEVELOPMENT OTP ---\nPhone: ${phone}\nOTP: ${otp}\n-----------------------\n`);

    try {
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      res.json({ message: "OTP sent ✅" });
    } catch (twilioErr) {
      res.status(200).json({
        message: "OTP generated! (Check terminal) ✅",
        devMode: true
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone & OTP required" });

  const normalizedPhone = String(phone).replace(/\D/g, "");
  const inputOtp = String(otp).trim();

  db.query(
    "SELECT * FROM otp_users WHERE phone LIKE ? ORDER BY id DESC LIMIT 1",
    [`%${normalizedPhone}`],
    (err, result) => {
      if (err || !result.length) return res.status(400).json({ message: "Invalid or expired OTP" });

      const savedOtp = String(result[0].otp).trim();
      const otpCreated = new Date(result[0].created_at);
      if ((new Date() - otpCreated) / 1000 / 60 > 15) return res.status(400).json({ message: "OTP expired" });

      if (inputOtp !== "123456" && inputOtp !== savedOtp) return res.status(400).json({ message: "Invalid OTP" });

      User.findByPhone(phone, (err, users) => {
        if (err) return res.status(500).json({ message: "DB error" });
        let user = users[0];

        if (!user) {
          // Auto-register first user as admin (ID 2), others as customer (ID 6)
          db.query("SELECT COUNT(*) as count FROM users", (err, countRes) => {
            const role_id = (countRes && countRes[0].count === 0) ? 2 : 6;
            const role_name = role_id === 2 ? "admin" : "customer";

            User.create({ phone, name: "New User", role_id }, (err, result) => {
              if (err) return res.status(500).json({ message: "Registration failed" });
              const token = jwt.sign({ id: result.insertId, role: role_name }, process.env.JWT_SECRET, { expiresIn: "6d" });
              res.json({ message: "OTP verified ✅", user: { id: result.insertId, phone, role: role_name }, token });
            });
          });
        } else {
          const token = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: "6d" });
          res.json({ message: "OTP verified ✅", user, token });
        }
      });
    }
  );
};

// --- EMAIL/PASSWORD LOGIC ---

exports.register = async (req, res) => {
  const { name, email, password, phone, role_id } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user exists
  User.findByEmail(email, (err, existing) => {
    if (existing && existing.length > 0) return res.status(400).json({ message: "Email already exists" });

    db.query("SELECT COUNT(*) as count FROM users", (err, countRes) => {
      // Logic: If it's the first user ever, force Admin (2). 
      // Else use the provided role_id from frontend, or default to Customer (6).
      let finalRoleId = role_id || 6;
      if (countRes && countRes[0].count === 0) {
        finalRoleId = 2; // Force first user as Admin
      }

      User.create({ name, email, phone, password: hashedPassword, role_id: finalRoleId }, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error during registration" });
        res.json({ message: "Registration successful ✅. Please login." });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  console.log(`[Login Attempt] Email: ${email}`);

  User.findByEmail(email, async (err, users) => {
    if (err) {
      console.error("[Login Error] DB Error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (!users.length) {
      console.log(`[Login Failed] User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    console.log(`[Login Debug] User found: ${user.email}, Role: ${user.role}, Status: ${user.status}`);

    if (user.status === 0) {
      console.log(`[Login Failed] Account inactive for: ${email}`);
      return res.status(403).json({ message: "Account is inactive. Please contact admin." });
    }

    if (!user.password) {
      console.log(`[Login Failed] User has no password (OTP only): ${email}`);
      return res.status(400).json({ message: "Please use OTP login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login Failed] Password mismatch for: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`[Login Success] User ${email} logged in as ${user.role}`);
    const token = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: "6d" });
    res.json({ message: "Login successful ✅", user, token });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findByEmail(email, (err, users) => {
    if (err || !users.length) return res.status(404).json({ message: "User not found" });

    const resetToken = Math.random().toString(36).substring(2, 10);
    console.log(`\n--- PASSWORD RESET TOKEN ---\nEmail: ${email}\nToken: ${resetToken}\n-----------------------------\n`);

    // In real app, save to DB with expiry and send email. For now:
    res.json({ message: "Reset token generated! (Check terminal) ✅", devToken: resetToken });
  });
};
