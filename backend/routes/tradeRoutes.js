import express from "express";
import {
  createTrade,
  getAllTrades,
  getTradeById,
  upload,
  getTradeByname,
} from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", upload.single("image"), createTrade);
router.get("/all", getAllTrades);
router.get("/:tradeId", getTradeById);
router.get("/user-trades/:username", getTradeByname);
export default router;
