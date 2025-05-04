import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../../App.css";
import "./items.css";

export default function MostVisited({ Items }) {
  const boxStyle = {
    borderRadius: '8px',
    animation: 'fadeIn 2s ease-in-out',
  };
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    const sortedItems = [...Items].sort((a, b) => b.visited_users.length - a.visited_users.length);
    setSortedItems(sortedItems);
  }, [Items]);

  return (
    <div style={boxStyle} className='user-items-div-container'>
      {sortedItems.map(item => (
        <div key={item.id} className="user-items-div-item">
          <img
            src={ item.url}
            alt={item.name}
            className="user-items-div-image"
          />
          <div className="user-items-div-content">
            <h3 className="user-items-div-title">{item.name}</h3>
            <div className="user-items-div-details">
              <span className="user-items-div-owner">Owner: {item.person}</span>
              <span className="user-items-div-base-price">Base Price: ₹{item.base_price}</span>
              <span className="user-items-div-visited-users">Visited Users: {item.visited_users.length}</span>
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
