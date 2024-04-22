import Trade from "../models/Trade.js";
import User from "../models/User.js"; // Make sure to import the User model
import multer from "multer";
import path from "path";

// Setup for multer to handle file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

export const upload = multer({ storage: storage });

// export const createTrade = async (req, res) => {
//   const { username, title, description, conditions } = req.body;
//   let imageUrl = req.file ? req.file.path : ""; // Use the file path as the image URL

//   try {
//     const newTrade = new Trade({
//       username,
//       title,
//       description,
//       conditions,
//       imageUrl,
//     });

//     // Save the new trade
//     await newTrade.save();

//     // Increment the trade count in the User document
//     const user = await User.findOneAndUpdate(
//       { username: username },
//       { $inc: { tradesCount: 1 } }, // Increment tradesCount by 1
//       { new: true } // Return the updated document
//     );

//     res.status(201).json({ trade: newTrade, user: user });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error creating trade", error: error.message });
//   }
// };


export const createTrade = async (req, res) => {
  const { username, title, description, conditions } = req.body;
  let imageUrl = req.file ? req.file.path : ""; // Use the file path as the image URL

  try {
    const newTrade = new Trade({
      username,
      title,
      description,
      conditions,
      imageUrl
    });

    // Save the new trade
    await newTrade.save();

    // Increment both tradesCount and tradeItems in the User document
    const user = await User.findOneAndUpdate(
      { username: username },
      { $inc: { tradeItems: 1, tradesCount: 1 } }, // Increment both fields by 1
      { new: true } // Return the updated document
    );

    res.status(201).json({ trade: newTrade, user: user });
  } catch (error) {
    res.status(400).json({ message: "Error creating trade", error: error.message });
  }
};

export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({}); // Fetch all trades from the database
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
