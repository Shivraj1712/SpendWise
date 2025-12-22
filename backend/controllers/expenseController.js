import Expense from "../models/expenseModel.js";
import asyncHandler from "express-async-handler";

// @desc   Get stats for user expense
// @route  GET /api/user/profile
// @access Private
const getStats = asyncHandler(async (req, res) => {
  const result = await Expense.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $group: {
        _id: "$category",
        totalAmount: {
          $sum: "$amount",
        },
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(result);
});

// @desc   Add expense
// @route  POST /api/expenses/
// @access Private
const addExpense = asyncHandler(async (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || !amount || !category) {
    res.status(400);
    throw new Error("Send all valid data");
  }
  const addedExpense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
  });
  if (!addedExpense) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(201).json({
    message: "Expense added successfully",
    addedExpense,
  });
});

// @desc   Get all expenses
// @route  GET /api/expenses
// @access Private
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  if (!expenses || expenses.length === 0) {
    res.status(404);
    throw new Error("No expenses found");
  }
  res.status(200).json({
    expenses,
  });
});

// @desc   Update a expense
// @route  PUT /api/expenses/:id
// @access Private
const updateExpense = asyncHandler(async (req, res) => {
  const { title, amount, category } = req.body;
  const expenseId = req.params.id;
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error("No such expense found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to change the details");
  }
  expense.title = title || expense.title;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;
  const updatedExpense = await expense.save();
  res.status(200).json({
    message: "Expense updated successfully",
    updatedExpense,
  });
});

// @desc   Delete a expense
// @route  DELETE /api/expenses/:id
// @access Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error("No such expense found");
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this expense");
  }
  const deletedExpense = await Expense.findByIdAndDelete(expenseId);
  res.status(200).json({
    message: "Expense deleted successfully",
    deletedExpense,
  });
});

export { getAllExpenses, getStats, updateExpense, deleteExpense, addExpense };
