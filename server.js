import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import authRoute from "./routes/auth.js";
import expensesRoute from "./routes/expenses.js";
import dotenv from "dotenv";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
dotenv.config();

// Connect to MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/expenses", expensesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
