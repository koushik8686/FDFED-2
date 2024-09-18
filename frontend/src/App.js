import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './components/user/Landing';
import Login from './components/user/Login';
import './App.css';
import RegisterPage from './components/user/Register';
import Home from './components/user/Home';
import SellerAuth from './components/seller/Login';
import SellerHome from './components/seller/Home';
import Auction from './components/user/Auction';
import Item from './components/seller/Item';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/seller" element={<SellerAuth />} />
        <Route path="/sellerhome" element={<SellerHome />} />
        <Route path="/auction/:item" element={<Auction />} />
        <Route path="/item/:item" element={<Item />} />   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
