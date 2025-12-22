import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";

dotenv.config();

const app = express();

//RS FIX — REQUIRED for Vercel + Render working

app.use(
    cors({
        origin: [
            "https://expense-tracker-brown-kappa.vercel.app",
            "http://localhost:5173", ,
            "http://15.206.128.203:80"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;


// DATABASE + SERVER START
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
