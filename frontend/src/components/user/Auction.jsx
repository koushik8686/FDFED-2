import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ArrowLeft, Timer, User, TrendingUp, IndianRupee } from 'lucide-react'
import { BidChart } from './BidChart'
import './Home.css'
import { motion } from 'framer-motion'
export default function Auction() {
  const [itemData, setItemData] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  const { item } = useParams();
  const userid = Cookies.get('user');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemData = () => {
      fetch(`${process.env.REACT_APP_BACKENDURL}/auction/${userid}/item/${item}`)
        .then((response) => {
          if (response.status === 404) {
            navigate("/home");
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setItemData(data.data.item);
          }
        })
        .catch((error) => console.error("Error fetching item data:", error));
    };

    fetchItemData();
    const intervalId = setInterval(fetchItemData, 3000);
    return () => clearInterval(intervalId);
  }, [item, userid]);
  if (!itemData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (itemData && itemData.auction_history && itemData.auction_history.length > 0) {
      const lastBidderId = itemData.current_bidder_id;
      console.log(userid , lastBidderId);
      if (userid === lastBidderId) {
        return alert("You can't bid yet.");
      }
    }

    fetch(`${process.env.REACT_APP_BACKENDURL}/auction/${userid}/item/${item}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bid: bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBidAmount("");
        fetch(`${process.env.REACT_APP_BACKENDURL}/auction/${userid}/item/${item}`)
          .then((response) => response.json())
          .then((newData) => {
            setItemData(newData.data.item);
          })
          .catch((error) => console.error("Error fetching updated item data:", error));
      })
      .catch((error) => console.error("Error submitting bid:", error));
  };

  return (
  <div style={{boxShadow:"box-shadow: 4px 5px 129px 14px rgba(0,0,0,0.75);"}} className= " m-4 shadow-xl min-h-screen bg-gradient-to-br from-teal-100 via-white to-gray-500 p-8">
    <div className="max-w-7xl mx-auto ">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <a href="/home" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Auctions</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="relative group overflow-hidden rounded-3xl">
            <img
              src={`${itemData.url}`}
              alt={itemData.name}
              className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-gray/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
          </div>
        </motion.div>

        {/* Middle Column - Item Details and Bid Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            <h2 className="text-3xl font-bold ">
              {itemData.name}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">{itemData.person}</span>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label htmlFor="bid" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Bid Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="bid"
                    type="number"
                    min={parseFloat(itemData.current_price) + 1}
                    step="1"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-gray-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg font-medium hover:from-teal-700 hover:to-gray-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Place Bid
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Column - Current Status and Bid History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Current Status</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl shadow-sm">
                <p className="text-sm text-teal-600 mb-1">Current Price</p>
                <p className="text-2xl font-bold text-teal-700">₹{itemData.current_price}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Base Price</p>
                <p className="text-2xl font-bold text-gray-700">₹{itemData.base_price}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                Bid History
              </h4>
              <div className="max-h-[200px] overflow-y-auto shadow-inner rounded-lg p-2">
                {itemData.auction_history.length > 0 ? (
                  <div className="space-y-2">
                    {itemData.auction_history.slice().reverse().map((history, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                        <div>
                          <p className="font-medium">{history.bidder}</p>
                          <p className="text-sm text-gray-500">2 minutes ago</p>
                        </div>
                        <p className="text-teal-600 font-medium">₹{history.price}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No bids yet. Be the first to bid!</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row - Bid Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <BidChart auctionHistory={itemData.auction_history} />
        </div>
      </motion.div>
    </div>
  </div>
  );
}