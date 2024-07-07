import express from "express";
import {
  createOffer,
  getAllOffers,
  getOffersByUser,
  getOffersByTrade,
  deleteOrderbyId,
  rejectOffer,
  acceptOffer,
} from "../controllers/offerController.js";

const router = express.Router();

router.post("/create", createOffer);
router.get("/all", getAllOffers); 
router.get("/user-offers/:username", getOffersByUser);
router.get("/by-trade/:tradeId", getOffersByTrade);
router.delete("/delete/:orderId", deleteOrderbyId);
router.post("/accept/:offerId", acceptOffer);
router.post("/reject/:offerId", rejectOffer);
export default router;
