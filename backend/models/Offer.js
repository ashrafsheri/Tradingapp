
// import mongoose from 'mongoose';

// const offerSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true },
//   tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }, // Reference to the Trade model if applicable
//   senderUsername: { type: String, required: true }, // Username of the offer sender
//   tradeOwnerUsername: { type: String, required: true } // Username of the owner of the trade
// });

// const Offer = mongoose.model('Offer', offerSchema);

// export default Offer;

import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
  senderUsername: { type: String, required: true },
  tradeOwnerUsername: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' }  // Default status to 'pending'
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
