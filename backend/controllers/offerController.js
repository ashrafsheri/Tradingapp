// controllers/offerController.js
import Offer from "../models/Offer.js";
import mongoose from 'mongoose';
import User from '../models/User.js';
import Trade from '../models/Trade.js'; 

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}); 
    res.status(200).json(offers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching offers", error: error.message });
  }
};

export const createOffer = async (req, res) => {
  const { description, price, quantity, senderUsername, tradeId } = req.body;

  try {
    const trade = await mongoose.model('Trade').findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    const newOffer = new Offer({
      description,
      price,
      quantity,
      tradeId,
      senderUsername,
      tradeOwnerUsername: trade.ownerUsername, 
      status: 'pending'  
    });

    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    console.error("Failed to create offer:", error);
    res.status(400).json({ message: "Failed to create offer", error: error.message });
  }
};

export const getOffersByUser = async (req, res) => {
  const { username } = req.params;
  try {
    const offers = await Offer.find({ senderUsername: username }); 
    res.status(200).json({ offers });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching offers", error: error.toString() });
  }
};

export const getOffersByTrade = async (req, res) => {
  const { tradeId } = req.params;
  console.log(tradeId)
  try {
    const offers = await Offer.find({ tradeId }).exec();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offers for trade", error });
  }
};

export const deleteOrderbyId = async (req, res) => {
  try {
    console.log("hello");
    const { offerId } = req.params;
    console.log(offerId);
    const deletedOffer = await Offer.deleteOne({_id: offerId});
    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const acceptOffer = async (req, res) => {
  const { offerId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const offer = await Offer.findById(offerId).session(session);

    if (!offer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Offer not found" });
    }

    const transactionValue = offer.quantity * offer.price;

    const updatedSender = await User.findOneAndUpdate(
      { username: offer.senderUsername },
      { $inc: { accountValue: -transactionValue } },  
      { new: true, session }
    );

    const updatedTradeOwner = await User.findOneAndUpdate(
      { username: offer.tradeOwnerUsername },
      { $inc: { accountValue: transactionValue } },  
      { new: true, session }
    );

    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: offer.tradeId },
      { status: 'completed' },
      { new: true, session }
    );

    if (!updatedTrade) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Trade not found" });
    }

    offer.status = 'accepted';
    await offer.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ offer, updatedSender, updatedTradeOwner, updatedTrade });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Failed to accept offer:", error);
    res.status(500).json({ message: "Failed to accept offer", error: error.message });
  }
};


export const rejectOffer = async (req, res) => {
  const { offerId } = req.params;
  try {
    const offer = await Offer.findByIdAndUpdate(offerId, { status: 'rejected' }, { new: true });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    console.error("Failed to reject offer:", error);
    res.status(500).json({ message: "Failed to reject offer", error: error.message });
  }
};
