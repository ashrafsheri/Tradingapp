import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ashrafshahreyar:YUeLOGTwi1A9wzlS@cluster0.l3uqjxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
