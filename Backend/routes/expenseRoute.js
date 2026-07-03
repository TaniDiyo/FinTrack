import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
    addExpense,
    getAllExpense,
    updateExpense,
    deleteExpense,
    getExpenseOverview,
    downloadExpenseExcel
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getAllExpense);
expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);
expenseRouter.get("/downloadExcel", authMiddleware, downloadExpenseExcel);

export default expenseRouter;

