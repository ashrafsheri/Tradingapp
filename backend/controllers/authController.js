

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.send({ message: "Registration successful" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
    console.error(err);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "apapp", { expiresIn: "24h" });
    return res.json({
      message: "Login successful",
      token: token,
      username: username
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  console.log(req.body)
  if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old password and new password are required." });
  }

  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Incorrect password." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password successfully updated." });
  } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password due to server error." });
  }
};

export const getUserInfo = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      accountValue: user.accountValue,
      tradeItems: user.tradeItems,
      tradesCount: user.tradesCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user information", error: error.message });
  }
};