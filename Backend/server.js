import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const port = 5000;

//MIDDLEWARES

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//DB
connectDB();

//ROUTES
app.use("/api/user",userRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/income",incomeRouter);
app.use("/api/dashboard",dashboardRouter);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
}); 

app.get('/',(req,res)=>{
    res.send("API WORKING");
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
});



