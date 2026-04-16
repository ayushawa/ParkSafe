const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 ROLE LOGIC (IMPORTANT)
    let role = "user";
    if (email === "admin@gmail.com") {
      role = "admin";
    }

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({ 
      message: "Signup successful",
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});


// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      token,
      role: user.role,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;