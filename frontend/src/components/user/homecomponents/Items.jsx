import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Import the heart icon
import "../../../App.css";
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../redux/LikedReducer';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Items({ filteredItems }) {
  const user = Cookies.get('user'); // User ID from cookies
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.liked);

  const handleAddToWishlist = async (item) => {
    console.log(item)
    dispatch(toggleWishlist(item)); // Dispatch the action with the entire item
    if (user) {
      try {
        if (wishlist.find((wishlistItem) => wishlistItem._id === item._id)) {
          // Remove from wishlist
          await axios.delete(`${process.env.REACT_APP_BACKENDURL}/liked/${user}/${item._id}`);
          console.log(`Removed from wishlist: ${item.name}`);
        } else {
          // Add to wishlist
          await axios.post(`${process.env.REACT_APP_BACKENDURL}/liked/${user}/${item._id}`);
          console.log(`Added to wishlist: ${item.name}`);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error.message);
        alert('Failed to update wishlist. Please try again.');
      }
    } else {
      alert('Please log in to manage your wishlist.');
    }
  };

  useEffect(() => {
    console.log("Wishlist state:", wishlist); // Log the updated wishlist state
  }, [wishlist]);

  const boxStyle = {
    borderRadius: '8px',
    animation: 'fadeIn 2s ease-in-out',
  };

  return (
    <div style={boxStyle} className="user-items-div-container">
      {filteredItems.map((item) => {
        // Auction timing details for each item
        const now = new Date(new Date().toISOString()); // Ensure `now` is in UTC
        const hasAuctionTiming = item.date && item.StartTime && item.EndTime;
        const formattedDate = hasAuctionTiming ? new Date(item.date).toISOString().split('T')[0] : 'N/A';
        const formattedStartTime = hasAuctionTiming ? item.StartTime.split('T')[1].slice(0, 5) + '' : 'N/A';
        const formattedEndTime = hasAuctionTiming ? item.EndTime.split('T')[1].slice(0, 5) + '' : 'N/A';
         
        const auctionStarted = hasAuctionTiming ? now >= new Date(item.StartTime) : false;

        return (
          <div key={item.id} className="user-items-div-item">
            <img
              src={ item.url}
              alt={item.name}
              className="user-items-div-image"
            />
            <div className="user-items-div-content">
              <div className="flex justify-between">
                <h3 className="user-items-div-title">{item.name}</h3>
                <div className="user-items-div-wishlist">
                  <FaHeart
                    className={`user-items-div-wishlist-icon ${
                      wishlist.find((wishlistItem) => wishlistItem._id === item._id) ? 'active' : ''
                    }`}
                    onClick={() => handleAddToWishlist(item)}
                    title="Add to Wishlist"
                  />
                </div>
              </div>
              <div className="user-items-div-details">
                <span className="user-items-div-owner">Owner: {item.person}</span>
                <span className="user-items-div-base-price">Base Price: ₹{item.base_price}</span>
              </div>
              <div className="auction-timing" style={{ marginTop: '0.5rem' }}>
                <span>Date: {formattedDate}</span> |{' '}
                <span>Start: {formattedStartTime}</span> |{' '}
                <span>End: {formattedEndTime}</span>
              </div>
              <div className="user-items-div-current-price">
                <span className="user-items-div-current-price-text">
                  Current Price: ₹{item.current_price}
                </span>
                {hasAuctionTiming ? (
                  auctionStarted ? (
                    <Link to={`/auction/${item._id}`}>
                      <button className="user-items-div-bid-button">
                        Bid
                      </button>
                    </Link>
                  ) : (
                    <Link to={`/auction/${item._id}`}>
                    <button className="user-items-div-bid-button">
                      Bid
                    </button>
                  </Link>
                  )
                ) : (
                  <Link to={`/auction/${item._id}`}>
                  <button className="user-items-div-bid-button">
                    Bid
                  </button>
                </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}