import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Entertainment",
        "Cigarette",
        "Fuel",
        "Travel",
        "EMI",
        "Savings",
        "Shopping",
        "Rent",
        "Others",
      ],
    },
    subCategory: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model("Expense", expenseSchema);
