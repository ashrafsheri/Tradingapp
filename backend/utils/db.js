import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "ENTER YOUR MONGODB URI HERE",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to DB");
  } catch (err) {
    console.error("Could not connect to MongoDB:", err);
  }
};

export default connectDB;
