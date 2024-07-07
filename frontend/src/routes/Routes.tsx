
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../components/landing";
import Home from "../components/Home";
import Navbar from "../components/common/navbar";
import Profile from "../components/profile";
import Browse from "../components/browse";
import Trade from "../components/trade";
import CreateOffer from "../components/createoffer";
import ChangePassword from "../components/changepassword";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/trade/:tradeId" element={<Trade />} />
        <Route path="/create-offer/:tradeId" element={<CreateOffer />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
