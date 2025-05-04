import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ItemCard = ({ item, isLiked, onLikeToggle }) => {
  const now = new Date(new Date().toISOString()); // Ensure `now` is in UTC
  console.log(item.startTime)
  const hasAuctionTiming = item.date && item.StartTime && item.EndTime;
  const formattedDate = hasAuctionTiming ? new Date(item.date).toISOString().split('T')[0] + ' UTC' : 'N/A';
  const formattedStartTime = hasAuctionTiming ? item.StartTime.split('T')[1].slice(0, 5) + ' UTC' : 'N/A';
  const formattedEndTime = hasAuctionTiming ? item.EndTime.split('T')[1].slice(0, 5) + ' UTC' : 'N/A';
  console.log(formattedDate , formattedStartTime , formattedEndTime) 
  const auctionStarted = hasAuctionTiming ? now >= new Date(item.StartTime) : false;

  return (
    <div className="item-card">
      <div className="item-image-container">
        <img src={item.url} alt={item.name} className="item-image" />
        <button
          onClick={onLikeToggle}
          className={`like-button ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="item-content">
        <h3 className="item-title">{item.name}</h3>

        <div className="item-details">
          <span className="item-owner">Owner: {item.person}</span>
          <div className="item-prices">
            <span className="base-price">Base: ₹{item.base_price}</span>
            <span className="current-price">Current: ₹{item.current_price}</span>
          </div>
          <div className="auction-timing">
            <span>Date: {formattedDate}</span>
            <span>Start Time: {formattedStartTime}</span>
            <span>End Time: {formattedEndTime}</span>
          </div>
        </div>

        {hasAuctionTiming ? (
          auctionStarted ? (
            <Link to={`/auction/${item._id}`} className="bid-button">
              Place Bid
            </Link>
          ) : (
            <button className="bid-button disabled" disabled>
              Auction Not Started Yet
            </button>
          )
        ) : (
          <button className="bid-button disabled" disabled>
            Auction details not available
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;