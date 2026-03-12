const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, register, login, forgotPassword } = require("../controllers/authController");

// OTP Auth
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Email/Password Auth
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
