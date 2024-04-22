import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  owner: String,
  username: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  conditions: { type: String, required: false }, // Assuming conditions is a single string; adjust as needed.
  imageUrl: { type: String, required: false } // Optional image URL field

});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
