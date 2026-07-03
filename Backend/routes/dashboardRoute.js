import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

// Dashboard Overview
dashboardRouter.get(
    "/",
    authMiddleware,
    getDashboardOverview
);

export default dashboardRouter;