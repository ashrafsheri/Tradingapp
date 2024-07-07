
    
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import "../styles/profile.css"; 

interface Trade {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  conditions?: string;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: string;
}

interface UserDetails {
  accountValue: number;
  tradeItems: number;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const loggedUsername = localStorage.getItem("username");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const [trades, setTrades] = useState<Trade[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (username) {
      fetchUserProfile(username);
      fetchUserTrades(username);
      if (username === loggedUsername) {
        fetchUserOffers(username);
      }
    }
  }, [username, loggedUsername]);

  const fetchUserProfile = async (username: string) => {
    try {
      const response = await axios.get(`http://localhost:6969/api/users/${username}`);
      setUserDetails(response.data);
    } catch (error: any) {
      setError("Failed to fetch user profile");
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUserTrades = async (username: string) => {
    try {
      const response = await axios.get(`http://localhost:6969/api/trades/user-trades/${username}`);
      console.log(response)
      setTrades(response.data.trades);
    } catch (error: any) {
      setError("Failed to fetch trades");
      console.error("Error fetching trades:", error);
    }
  };

  const fetchUserOffers = async (username: string) => {
    try {
      const response = await axios.get(`http://localhost:6969/api/offers/user-offers/${username}`);
      setOffers(response.data.offers);
    } catch (error: any) {
      setError("Failed to fetch offers");
      console.error("Error fetching offers:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isOwner = loggedUsername === username;

  const handleNavigateToChangePassword = () => {
    navigate("/change-password"); 
  };

  return (
    <div className="profile-content">
      <h1>Profile Page</h1>
      <h2>Welcome {username}</h2>

      <section>
        <div className="top-section">
          <div className="user-info">
            <img
              src="../userImage.jpg"
              alt="User Image"
              className="user-image"
            />
            <div>
              <h1>{username}</h1>
              {isOwner && (
                <>
                  <button
                    className="update-password-btn"
                    onClick={handleNavigateToChangePassword}
                  >
                    Update Password
                  </button>
                  <button
                    className="create-offer-btn"
                    onClick={() => navigate("/make-trade")}
                  >
                    Create Trade Offer
                  </button>
                </>
              )}
            </div>
          </div>
          {isOwner && (
            <div className="cash-counter">
              {userDetails && <p>Cash: ${userDetails.accountValue}</p>}
            </div>
          )}
        </div>

        <h2>My Trades</h2>
        {userDetails && (
          <div>
            <p>Number of Trade Items: {userDetails.tradeItems}</p>
          </div>
        )}
        <div>
          {trades.map((trade, index) => (
            <div
              key={index}
              className="trade-item"
              onClick={() => navigate(`/trade/${trade._id}`)}
            >
              <img
                src={
                  trade.imageUrl
                    ? `http://localhost:6969/${trade.imageUrl}`
                    : "../tradeImage.jpg"
                }
                alt="Trade Image"
                className="trade-image"
              />
              <div className="trade-info">
                <h3 className="trade-title">{trade.title}</h3>
                <p className="trade-description">{trade.description}</p>
                <div className="trade-conditions">
                  {trade.conditions &&
                    trade.conditions.split(",").map((condition, idx) => (
                      <span key={idx} className="condition-badge">
                        {condition}
                      </span>
                    ))}
                </div>
              </div>
              {isOwner && (
                <button className="see-trade-status-btn">
                  See Trade Status →
                </button>
              )}
            </div>
          ))}
        </div>

        {isOwner && (
          <div>
            <h2>My Offers</h2>
            <div className="offers-sent-container">
              {offers.map((offer, index) => (
                <div key={index} className="offer-tile">
                  <div className="offer-image-container">
                    {/* <img src={trade.imageUrl ? `http://localhost:6969/${trade.imageUrl}` : "../tradeImage.jpg"} alt="Trade Image" className="trade-image"/> */}
                  </div>
                  <div className="offer-info">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    <div className="offer-status">{offer.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
