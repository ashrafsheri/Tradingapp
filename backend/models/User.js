import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountValue: { type: Number, default: 1000 },
  tradeItems: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);
export default User;
