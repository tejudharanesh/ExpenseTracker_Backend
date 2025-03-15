import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import authRoute from "./routes/auth.js";
import expensesRoute from "./routes/expenses.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Allowed origins
const allowedOrigins = [
  "https://expense-tracker.188857.xyz/",
  "https://calm-entremet-f36417.netlify.app/", // Add other domains here
  "https://expense-tracker.188857.xyz",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Apply CORS Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/expenses", expensesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
