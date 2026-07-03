import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// ADD EXPENSE
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newExpense.save();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// GET ALL EXPENSES
export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseModel
            .find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            expenses
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// UPDATE EXPENSE
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const {
        description,
        amount,
        category,
        date
    } = req.body;

    try {
        const updatedExpense =
            await expenseModel.findOneAndUpdate(
                {
                    _id: id,
                    userId
                },
                {
                    description,
                    amount,
                    category,
                    date
                },
                {
                    new: true
                }
            );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// DELETE EXPENSE
export async function deleteExpense(req, res) {
    const userId = req.user._id;

    try {
        const expense =
            await expenseModel.findOneAndDelete({
                _id: req.params.id,
                userId
            });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// DOWNLOAD EXPENSE EXCEL
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseModel
            .find({ userId })
            .sort({ date: -1 });

        const plainData = expenses.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString()
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(plainData);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Expenses"
        );

        const fileName =
            "expense_details.xlsx";

        XLSX.writeFile(workbook, fileName);

        res.download(fileName);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// EXPENSE OVERVIEW
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;

        const {
            range = "monthly"
        } = req.query;

        const {
            start,
            end
        } = getDateRange(range);

        const expenses = await expenseModel
            .find({
                userId,
                date: {
                    $gte: start,
                    $lte: end
                }
            })
            .sort({ date: -1 });

        const totalExpense =
            expenses.reduce(
                (acc, curr) =>
                    acc + curr.amount,
                0
            );

        const averageExpense =
            expenses.length > 0
                ? totalExpense /
                  expenses.length
                : 0;

        const numberOfTransactions =
            expenses.length;

        const recentTransactions =
            expenses.slice(0, 5);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}