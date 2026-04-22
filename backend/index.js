const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']); // Fix DNS issue

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ================= SCHEMAS =================

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

// Expense Schema
const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["Food", "Travel", "Bills", "Other"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model("Expense", expenseSchema);

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ msg: "No token, access denied" });
    }

    try {
        const token = authHeader.split(" ")[1]; // Bearer token extract
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ msg: "Invalid token" });
    }
};

// ================= ROUTES =================

// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ msg: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD EXPENSE (Protected)
app.post("/expense", authMiddleware, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        // Validation
        if (!title || !amount || !category) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const expense = new Expense({
            userId: req.user.id,
            title,
            amount,
            category,
            date
        });

        await expense.save();

        res.json({ msg: "Expense added successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//delete expense
app.delete("/expense/:id", authMiddleware, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({ msg: "Expense not found" });
        }

        res.json({ msg: "Deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL EXPENSES (Protected)
app.get("/expenses", authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense
            .find({ userId: req.user.id })
            .sort({ date: -1 });

        res.json(expenses);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});