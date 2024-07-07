import React from "react";
import { Navigate } from "react-router-dom";
import "../styles/home.css";
import Navbar from "./common/navbar";
import backgroundImage from "../images/backgroundImage.jpg";


const Home: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* <Navbar /> */}
      <h1>Welcome to My Site</h1>
      <div className="hero-overlay">
        <h1>Welcome to TradeBiz!</h1>
        <p>Your Trading Partner for Life.</p>
      </div>
    </section>
  );
}

export default Home;
