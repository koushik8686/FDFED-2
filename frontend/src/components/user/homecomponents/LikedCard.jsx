import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const LikedItemCard = ({ item }) => {
  return (
    <li className="liked-item-card">
      <div className="liked-item-image">
        <img src={item.url} alt={item.name} />
          <a href={`/auction/${item._id}`} className="view-auction-button">
            View Auction <ArrowUpRight className="w-4 h-4" />
          </a>
      </div>
      
      <div className="liked-item-details">
        <h4 className="liked-item-title">{item.name}</h4>
        <div className="liked-item-info">
          <span className="text-sm text-gray-600">Type: {item.type}</span>
          <span className="text-sm font-medium">${item.current_price}</span>
        </div>
        <p className="text-sm text-gray-600">Seller: {item.person}</p>
      </div>
    </li>
  );
};

export default LikedItemCard;