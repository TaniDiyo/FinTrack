import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// ADD INCOME
export async function addIncome(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newIncome.save();

        return res.status(201).json({
            success: true,
            message: "Income added successfully",
            income: newIncome
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// GET ALL INCOME
export async function getAllIncome(req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel
            .find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            income
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// UPDATE INCOME
export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            {
                description,
                amount,
                category,
                date
            },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        return res.json({
            success: true,
            message: "Income updated successfully",
            income: updatedIncome
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// DELETE INCOME
export async function deleteIncome(req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel.findOneAndDelete({
            _id: req.params.id,
            userId
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        return res.json({
            success: true,
            message: "Income deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// DOWNLOAD INCOME EXCEL
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel
            .find({ userId })
            .sort({ date: -1 });

        const plainData = income.map((inc) => ({
            Description: inc.description,
            Amount: inc.amount,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Income"
        );

        const fileName = "income_details.xlsx";

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

// INCOME OVERVIEW
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;

        const { range = "monthly" } = req.query;

        const { start, end } = getDateRange(range);

        const incomes = await incomeModel
            .find({
                userId,
                date: {
                    $gte: start,
                    $lte: end
                }
            })
            .sort({ date: -1 });

        const totalIncome = incomes.reduce(
            (acc, curr) => acc + curr.amount,
            0
        );

        const averageIncome =
            incomes.length > 0
                ? totalIncome / incomes.length
                : 0;

        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
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