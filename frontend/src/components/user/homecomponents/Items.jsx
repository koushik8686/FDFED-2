import React from 'react'
import { Link } from 'react-router-dom'
import "../../../App.css"
import moduleName from './items.css'

export default function Items({filteredItems} ) {
  const boxStyle = {
    borderRadius: '8px',
    animation: 'fadeIn 2s ease-in-out',
  };
  return (
    <div style={boxStyle} className='user-items-div-container'>
         {filteredItems.map(item => (
          <div key={item.id} className="user-items-div-item">
            <img
              src={"/"+item.url}
              alt={item.name}
              className="user-items-div-image"
            />
            <div className="user-items-div-content">
              <h3 className="user-items-div-title">{item.name}</h3>
              <div className="user-items-div-details">
                <span className="user-items-div-owner">Owner: {item.person}</span>
                <span className="user-items-div-base-price">Base Price: ${item.base_price}</span>
              </div>
              <div className="user-items-div-current-price">
                <span className="user-items-div-current-price-text">Current Price: ${item.current_price}</span>
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
  )
}

