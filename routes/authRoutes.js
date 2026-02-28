const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();


// 🔹 Register User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: "User already exists or DB error" });
    }
});


// 🔹 Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        "SECRET_KEY",
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
});

module.exports = router;