import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Item() {
  const [itemData, setItemData] = useState(null);
  const { item } = useParams();
  const sellerid = Cookies.get('seller');
  const navigate = useNavigate();

  const fetchItemData = () => {
    fetch(`${process.env.REACT_APP_BACKENDURL}/sell/${sellerid}/${item}`)
      .then((response) => response.json())
      .then((data) => setItemData(data.data.item))
      .catch((error) => console.error("Error fetching item data:", error));
  };

  useEffect(() => {
    fetchItemData();
    const intervalId = setInterval(fetchItemData, 3000);
    return () => clearInterval(intervalId);
  }, [item, sellerid]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (itemData.auction_history.length === 0) {
      alert("No bids have been placed yet. You cannot sell this item.");
      return;
    }
    axios.post(`${process.env.REACT_APP_BACKENDURL}/sell/${sellerid}/${item}`, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {    
      console.log(response);
      alert("Item sold successfully!");
      setTimeout(() => {
        navigate(`/sellerhome`);            
      }, 1000);
    })
    .catch((error) => console.error("Error submitting bid:", error));
  };

  if (!itemData) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Loading...</div>;
  }

  const chartData = itemData.auction_history.map((history, index) => ({
    name: `Bid ${index + 1}`,
    amount: history.price,
  }));

  // Determine the min and max price for the Y-axis range
  const prices = itemData.auction_history.map(history => history.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-blue-500 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/sellerhome" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span>Back </span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={`${itemData.url}`}
                alt={itemData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{itemData.name}</h1>
              <p className="text-gray-600 mb-4">
                <UserIcon className="w-5 h-5 inline mr-2" />
                {itemData.seller}
              </p>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Current Status</h2>
                <div className="flex justify-between items-center bg-blue-100 p-3 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-2xl font-bold text-blue-600">₹{itemData.current_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-xl font-semibold text-purple-600">₹{itemData.base_price}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Bid History</h2>
                <div className="max-h-40 overflow-y-auto">
                  {itemData.auction_history.slice().reverse().map((history, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{history.bidder}</span>
                      <span className="text-blue-600 font-semibold">₹{history.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleBidSubmit}>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                  Sell Item
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bid Progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[minPrice, maxPrice]} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}