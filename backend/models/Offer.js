import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
  senderUsername: { type: String, required: true },
  tradeOwnerUsername: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' }  
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
