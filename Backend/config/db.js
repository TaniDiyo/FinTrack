
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tanimongodb123_db_user:3ccPVmlPjVyaZJhH@clusteres.ui2il6u.mongodb.net"
    );

    console.log("DB CONNECTED");
  } catch (err) {
    console.error(err);
  }
};