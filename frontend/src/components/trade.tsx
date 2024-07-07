import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:6969");

interface Trade {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  conditions: string;
  username: string;
}

interface Offer {
  _id: string;
  title: string
  description: string;
  senderUsername: string;
  quantity: number;
  price: number;
  status: string;
}

function TradeDetails() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string>("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const tradeDetailsResponse = await axios.get<Trade>(`http://localhost:6969/api/trades/${tradeId}`);
        setTrade(tradeDetailsResponse.data);
        if (tradeDetailsResponse.data) {
          if (tradeDetailsResponse.data.username === username) {
            require("../styles/mytrade.css"); 
          } else {
            require("../styles/trade.css"); 
          }
        }
        const offersResponse = await axios.get<Offer[]>(`http://localhost:6969/api/offers/by-trade/${tradeId}`);
        setOffers(offersResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };

    fetchInitialData();
    socket.emit("joinRoom", tradeId);
    socket.on("newOffer", (newOffer: Offer) => {
      setOffers(prev => [...prev, newOffer]);
    });

    return () => {
      socket.off("newOffer");
      socket.emit("leaveRoom", tradeId);
    };
  }, [tradeId, username]);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const currentOffer = offers.find(offer => offer._id === offerId);
      if (currentOffer && currentOffer.status !== 'pending') return;

      const response = await axios.post(`http://localhost:6969/api/offers/accept/${offerId}`);
      setOffers(prevOffers => prevOffers.map(offer => offer._id === offerId ? { ...offer, status: 'accepted' } : offer));
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      const currentOffer = offers.find(offer => offer._id === offerId);
      if (currentOffer && currentOffer.status !== 'pending') return;

      const response = await axios.post(`http://localhost:6969/api/offers/reject/${offerId}`);
      setOffers(prevOffers => prevOffers.map(offer => offer._id === offerId ? { ...offer, status: 'rejected' } : offer));
    } catch (error) {
      console.error("Error rejecting offer:", error);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!trade) return <div>Loading...</div>;

  const isOwner = username === trade.username;

  return (
    <div className="trade-detail-container">
      <Link to="/browse" className="back-link">← Back to Browse</Link>
      <h1 className="trade-title">{trade.title}</h1>
      <img src={trade.imageUrl ? `http://localhost:6969/${trade.imageUrl}` : "../tradeImage.jpg"} alt="Trade Image" className="trade-image"/>
      <p className="trade-details">{trade.description}</p>
      <h3>Accepting Conditions:</h3>
      <ul className="accepting-conditions">
        {trade.conditions.split(",").map((condition, index) => <li key={index}>{condition}</li>)}
      </ul>

      {isOwner && (
        <div className="offers-section">
          <h3>Offers</h3>
          {offers.map((offer, index) => (
            <div key={index} className="offer">
              <div className="offer-top">
                <div className="user-info">
                  <h4 className="user-name">{offer.senderUsername}</h4>
                  <p className="user-username">@{offer.senderUsername}</p>
                </div>
              </div>
              <div className="offer-details">
                <h4 className="commodity-name">{offer.title}</h4>
                <p className="commodity-quantity">Quantity: {offer.quantity}</p>
                <p className="offer-cash">Cash Offer: ${offer.price}</p>
                <p className="offer-description">Description: {offer.description}</p>
                <p className="offer-status">Status: {offer.status}</p>
              </div>
              <div className="offer-actions">
                {offer.status === 'pending' && (
                  <>
                    <button className="offer-accept-btn" onClick={() => handleAcceptOffer(offer._id)}>Accept</button>
                    <button className="offer-reject-btn" onClick={() => handleRejectOffer(offer._id)}>Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isOwner && (
        <button onClick={() => navigate(`/create-offer/${tradeId}`)} className="offer-trade-btn">
          Offer Trade
        </button>
      )}

      <Link to={`/profile/${trade.username}`} className="profile-link">
        Visit Poster's Profile
      </Link>
    </div>
  );
}

export default TradeDetails;
