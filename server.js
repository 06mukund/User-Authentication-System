const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

const authMiddleware = require("./middleWare/authMiddleWare");

app.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});