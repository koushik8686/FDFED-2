import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Import the heart icon
import "../../../App.css";

export default function Items({ filteredItems }) {
  const [wishlist, setWishlist] = useState({}); // State to track wishlist status

  const handleAddToWishlist = (itemId) => {
    // Toggle the wishlist status for the item
    setWishlist((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId], // Toggle the current state
    }));
    console.log(`Toggled wishlist for item with id: ${itemId}`);
  };

  const boxStyle = {
    borderRadius: '8px',
    animation: 'fadeIn 2s ease-in-out',
  };

  return (
    <div style={boxStyle} className='user-items-div-container'>
      {filteredItems.map((item) => (
        <div key={item.id} className="user-items-div-item">
          <img
            src={"/" + item.url}
            alt={item.name}
            className="user-items-div-image"
          />
          <div className="user-items-div-content">
            <div className='flex justify-between'>
              <h3 className="user-items-div-title">{item.name}</h3>
              <div className="user-items-div-wishlist">
                <FaHeart
                  className={`user-items-div-wishlist-icon ${wishlist[item._id] ? 'active' : ''}`}
                  onClick={() => handleAddToWishlist(item._id)}
                  title="Add to Wishlist"
                />
              </div>
            </div>
            <div className="user-items-div-details">
              <span className="user-items-div-owner">Owner: {item.person}</span>
              <span className="user-items-div-base-price">Base Price: ₹{item.base_price}</span>
            </div>
            <div className="user-items-div-current-price">
              <span className="user-items-div-current-price-text">Current Price: ₹{item.current_price}</span>
              <Link to={`/auction/${item._id}`}>
                <button className="user-items-div-bid-button">
                  Bid
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
