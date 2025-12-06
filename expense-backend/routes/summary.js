
import express from "express";
import Expense from "../models/Expense.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/categories", requireAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const totals = {};
        expenses.forEach(e => {
            const c = e.category || "other";
            totals[c] = (totals[c] || 0) + (Number(e.amount) || 0);
        });
        res.json(totals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/monthly", requireAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const months = Array.from({ length: 12 }, () => 0);
        expenses.forEach(e => {
            const m = new Date(e.date).getMonth();
            months[m] += Number(e.amount) || 0;
        });
        res.json(months);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
