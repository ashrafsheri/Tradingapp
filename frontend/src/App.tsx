import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Home from "./components/Home";
import Profile from "./components/profile";
import Browse from "./components/browse";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateOffer from "./components/createoffer";
import ChangePassword from "./components/changepassword";
import Navbar from "./components/common/navbar";
import MakeTrade from "./components/createtrade";
import TradeDetails from "./components/trade";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/trade/:tradeId" element={<TradeDetails />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-offer/:tradeId" element={<CreateOffer />} />
        <Route path="/make-trade" element={<MakeTrade />} />
      </Routes>
    </Router>
  );
};

export default App;
