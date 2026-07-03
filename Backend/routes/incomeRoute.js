import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
    addIncome,
    getAllIncome,
    updateIncome,
    deleteIncome,
    getIncomeOverview,
    downloadIncomeExcel
} from "../controllers/incomeController.js";

const incomeRouter = express.Router();

// Add Income
incomeRouter.post("/add", authMiddleware, addIncome);

// Get All Income
incomeRouter.get("/get", authMiddleware, getAllIncome);

// Update Income
incomeRouter.put("/update/:id", authMiddleware, updateIncome);

// Delete Income
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);

// Income Overview
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

// Download Income Excel
incomeRouter.get(
    "/downloadExcel",
    authMiddleware,
    downloadIncomeExcel
);

export default incomeRouter;