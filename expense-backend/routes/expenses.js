import express from "express";
import auth from "../middleware/auth.js";
import Expense from "../models/Expense.js";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `expenses:${userId}`;

        const cachedExpenses = await redis.get(cacheKey);
        if (cachedExpenses) {
            return res.json(JSON.parse(cachedExpenses));
        }

        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

        await redis.setex(cacheKey, 300, JSON.stringify(expenses));

        return res.json(expenses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, amount, category, date } = req.body;

        const expense = new Expense({
            user: userId,
            description,
            amount,
            category,
            date,
        });

        await expense.save();

        await redis.del(`expenses:${userId}`);

        return res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Expense.findOneAndDelete({
            _id: id,
            user: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Expense not found" });
        }


        await redis.del(`expenses:${req.user.id}`);

        return res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (String(expense.user) !== String(req.user.id)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { description, amount, category, date } = req.body;

        expense.description = description ?? expense.description;
        expense.amount = amount ?? expense.amount;
        expense.category = category ?? expense.category;
        expense.date = date ?? expense.date;

        await expense.save();


        await redis.del(`expenses:${req.user.id}`);

        return res.json(expense);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
