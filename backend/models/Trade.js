import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  owner: String,
  username: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  conditions: { type: String, required: false },
  imageUrl: { type: String, required: false },
  status: { type: String, required: true, default: 'pending' } 
});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
