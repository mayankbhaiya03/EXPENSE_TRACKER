import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connected");

        app.listen(PORT, () => {
            console.log("Server listening on", PORT);
        });
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
};

start();
