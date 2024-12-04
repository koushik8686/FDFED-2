import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

 const ItemCard = ({ item, isLiked, onLikeToggle }) => {
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
        </div>

        <Link to={`/auction/${item._id}`} className="bid-button">
          Place Bid
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;