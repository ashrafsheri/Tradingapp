// controllers/offerController.js
import Offer from "../models/Offer.js";
import mongoose from 'mongoose';
import User from '../models/User.js';

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}); // Fetch all offers from the database
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
      tradeOwnerUsername: trade.ownerUsername,  // Assuming trade has an ownerUsername field
      status: 'pending'  // Explicitly setting the status to pending on creation
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
    const offers = await Offer.find({ senderUsername: username }); // Adjust based on your schema, might be `senderUsername` or `tradeOwnerUsername`
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

// export const acceptOffer = async (req, res) => {
//   const { offerId } = req.params;
//   try {
//     const offer = await Offer.findByIdAndUpdate(offerId, { status: 'accepted' }, { new: true });
//     if (!offer) {
//       return res.status(404).json({ message: "Offer not found" });
//     }
//     res.status(200).json(offer);
//   } catch (error) {
//     console.error("Failed to accept offer:", error);
//     res.status(500).json({ message: "Failed to accept offer", error: error.message });
//   }
// };

// export const acceptOffer = async (req, res) => {
//   const { offerId } = req.params;
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     // Fetch the offer with reference to trade and sender
//     const offer = await Offer.findById(offerId)
//       .populate('tradeOwnerUsername', 'accountValue')
//       .populate('senderUsername', 'accountValue')
//       .session(session);

//     if (!offer) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Offer not found" });
//     }

//     // Calculate the total value of the offer
//     const transactionValue = offer.quantity * offer.price;

//     // Update sender's account by subtracting the transaction value
//     const updatedSender = await User.findOneAndUpdate(
//       { username: offer.senderUsername.username },
//       { $inc: { accountValue: -transactionValue } },
//       { new: true, session }
//     );

//     // Update trade owner's account by adding the transaction value
//     const updatedTradeOwner = await User.findOneAndUpdate(
//       { username: offer.tradeOwnerUsername.username },
//       { $inc: { accountValue: transactionValue } },
//       { new: true, session }
//     );

//     // Mark the offer as accepted
//     offer.status = 'accepted';
//     await offer.save({ session });

//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({ offer, updatedSender, updatedTradeOwner });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Failed to accept offer:", error);
//     res.status(500).json({ message: "Failed to accept offer", error: error.message });
//   }
// };



// export const acceptOffer = async (req, res) => {
//   const { offerId } = req.params;
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     // Fetch the offer with reference to the trade and sender
//     const offer = await Offer.findById(offerId).session(session);

//     if (!offer) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Offer not found" });
//     }

//     // Calculate the total value of the offer
//     const transactionValue = offer.quantity * offer.price;

//     // Update sender's account by subtracting the transaction value
//     const updatedSender = await User.findOneAndUpdate(
//       { username: offer.senderUsername },
//       { $inc: { accountValue: accountValue -transactionValue } },
//       { new: true, session }
//     );

//     // Update trade owner's account by adding the transaction value
//     const updatedTradeOwner = await User.findOneAndUpdate(
//       { username: offer.tradeOwnerUsername },
//       { $inc: { accountValue: transactionValue+accountValue } },
//       { new: true, session }
//     );

//     // Mark the offer as accepted
//     offer.status = 'accepted';
//     await offer.save({ session });

//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({ offer, updatedSender, updatedTradeOwner });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Failed to accept offer:", error);
//     res.status(500).json({ message: "Failed to accept offer", error: error.message });
//   }
// };

export const acceptOffer = async (req, res) => {
  const { offerId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Fetch the offer with reference to the trade and sender
    const offer = await Offer.findById(offerId).session(session);

    if (!offer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Offer not found" });
    }

    // Calculate the total value of the offer
    const transactionValue = offer.quantity * offer.price;

    // Update sender's account by subtracting the transaction value
    const updatedSender = await User.findOneAndUpdate(
      { username: offer.senderUsername },
      { $inc: { accountValue: -transactionValue } },  // Correct use of $inc to decrement
      { new: true, session }
    );

    // Update trade owner's account by adding the transaction value
    const updatedTradeOwner = await User.findOneAndUpdate(
      { username: offer.tradeOwnerUsername },
      { $inc: { accountValue: transactionValue } },  // Correct use of $inc to increment
      { new: true, session }
    );

    // Mark the offer as accepted
    offer.status = 'accepted';
    await offer.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ offer, updatedSender, updatedTradeOwner });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Failed to accept offer:", error);
    res.status(500).json({ message: "Failed to accept offer", error: error.message });
  }
};

// Reject an offer
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
