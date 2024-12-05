import React from 'react';
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
import AdminLogin from './components/admin/Login';
import Admin from './components/admin/Home';
import VerifyEmail from './components/user/VerifyEmail';
import VerifySellerEmail from './components/seller/Verifyseller';
import SellerSoldItems from './components/seller/solditems';
import TimeFrame from './components/admin/TimeFrame';
import FeedBack from './components/user/FeedBAckForm';
import Reviews from './components/admin/Reviews';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:userid" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />
        <Route path='/feedback' element={<FeedBack/>} />
        <Route path="/seller" element={<SellerAuth />} />
        <Route path="/sellerhome" element={<SellerHome />} />
        <Route path="/seller/solditems" element = {<SellerSoldItems/>} />
        <Route path="/seller/verify/:sellerId" element={<VerifySellerEmail />} />
        <Route path="/auction/:item" element={<Auction />} />
        <Route path="/item/:item" element={<Item />} />   
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/' element={<Admin/>}/>
        <Route path='/admin/calender' element={<TimeFrame/>} />
        <Route path='/reviews'  element={<Reviews/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
