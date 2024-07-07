import Trade from "../models/Trade.js";
import User from "../models/User.js"; 
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const createTrade = async (req, res) => {
  const { username, title, description, conditions } = req.body;
  let imageUrl = req.file ? req.file.path : "";

  try {
    const newTrade = new Trade({
      username,
      title,
      description,
      conditions,
      imageUrl,
      status: 'pending'  
    });

    await newTrade.save();

    const user = await User.findOneAndUpdate(
      { username: username },
      { $inc: { tradeItems: 1, tradesCount: 1 } }, 
      { new: true } 
    );

    res.status(201).json({ trade: newTrade, user: user });
  } catch (error) {
    res.status(400).json({ message: "Error creating trade", error: error.message });
  }
};

export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({}); 
    res.status(200).json(trades);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trades", error: error.message });
  }
};

export const getTradeById = async (req, res) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }
    res.json(trade);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trade", error: error.message });
  }
};

export const getTradeByname = async (req, res) => {
  const { username } = req.params;
  try {
    const trades = await Trade.find({ username: username });
    res.json({ trades, count: trades.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user's trades", error: error.message });
  }
};
