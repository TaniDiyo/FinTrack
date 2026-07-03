
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tanishadiyora:Tani123@cluster0.cokjm9h.mongodb.net/Expense?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("DB CONNECTED");
  } catch (err) {
    console.error(err);
  }
};