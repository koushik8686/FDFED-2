import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "./item.css";

export default function Item() {
  const [itemData, setItemData] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const { item } = useParams();
  const sellerid = Cookies.get('seller');

  useEffect(() => {
    fetch(`/sell/${sellerid}/${item}`)
      .then((response) => response.json())
      .then((data) => setItemData(data.data.item))
      .catch((error) => console.error("Error fetching item data:", error));
  }, [item]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:4000/sell/${sellerid}/${item}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bid: bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        setItemData(data.data.item);
        setBidAmount("");
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
        <h1 className="seller-item-title">{itemData.name}</h1>
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
                      <td>${history.price}</td>
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
            src={`http://localhost:4000/${itemData.url}`}
            alt={itemData.name}
            className="seller-item-image"
          />
          <div className="seller-item-info">
            <div className="seller-item-info-row">
              <span>Current Highest Bidder:</span>
              <span>{itemData.current_bidder || "No bids yet"}</span>
            </div>
            <div className="seller-item-info-row">
              <span>Base Price:</span>
              <span>${itemData.base_price}</span>
            </div>
            <div className="seller-item-info-row">
              <span>Current Price:</span>
              <span>${itemData.current_price}</span>
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

