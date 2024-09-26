import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./item.css";
import axios from "axios";

export default function Item() {
  const [itemData, setItemData] = useState(null);
  const { item } = useParams();
  const sellerid = Cookies.get('seller');
  const navigate = useNavigate();

  // Function to fetch item data
  const fetchItemData = () => {
    fetch(`/sell/${sellerid}/${item}`)
      .then((response) => response.json())
      .then((data) => setItemData(data.data.item))
      .catch((error) => console.error("Error fetching item data:", error));
  };

  useEffect(() => {
    // Initial fetch
    fetchItemData();
    // Set interval to fetch item data every 1 second
    const intervalId = setInterval(fetchItemData, 1000);
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [item, sellerid]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (itemData.auction_history.length === 0) {
      alert("No bids have been placed yet. You cannot sell this item.");
      return; // Prevent further execution
    }
    axios.post(`/sell/${sellerid}/${item}`, {}, {
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

  return (
    <div className="seller-item-container">
      <div className="seller-item-header">
        <Link to="/sellerhome" className="seller-item-back-link">
          <ArrowLeftIcon className="seller-item-back-icon" />
          <span>Back</span>
        </Link>
      </div>

      <div className="seller-item-content">
        <div className="seller-item-bid-history">
          <h2 className="seller-item-bid-history-title">Bid History</h2>
          <div className="seller-item-bid-history-table">
            {itemData.auction_history.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Bidder</th>
                    <th>Bid Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {itemData.auction_history.slice().reverse().map((history, index) => (
                    <tr key={index}>
                      <td>{history.bidder}</td>
                      <td>₹{history.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No bids yet.</p>
            )}
          </div>
        </div>
        <div className="seller-item-details">
          <img
            src={`/${itemData.url}`}
            alt={itemData.name}
            className="seller-item-image"
          />
          <div className="seller-item-info">
            <h1 className="seller-item-title">{itemData.name}</h1>

            <div className="seller-item-info-row">
              <span>Current Highest Bidder:</span>
              <span>{itemData.current_bidder || "No bids yet"}</span>
            </div>
            <div className="seller-item-info-row">
              <span>Base Price:</span>
              <span>₹{itemData.base_price}</span>
            </div>
            <div className="seller-item-info-row">
              <span>Current Price:</span>
              <span>₹{itemData.current_price}</span>
            </div>
          </div>
          <form className="seller-item-bid-form" onSubmit={handleBidSubmit}>
            <button type="submit" className="seller-item-bid-button">
              Sell Item
            </button>
          </form>
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
