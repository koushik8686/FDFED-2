import React from 'react';
import { useSelector } from 'react-redux';
import { X, ShoppingBag } from 'lucide-react';
import LikedItemCard  from './LikedCard';
import './LikedItem.css';

const LikedItems = ({ closepopup }) => {
  const likedItems = useSelector((state) => state.liked);

  return (
    <div className="liked-items-drawer">
      <div className="liked-items-header">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Liked Items</h2>
        </div>
        <button 
          onClick={closepopup}
          className="close-button"
          aria-label="Close liked items"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="liked-items-content">
        {likedItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-gray-500">No items liked yet!</p>
            <p className="text-sm text-gray-400 mt-2">
              Browse items and click the heart icon to add them here
            </p>
          </div>
        ) : (
          <ul className="liked-items-list">
            {[...likedItems].reverse().map((item) => (
              <LikedItemCard key={item._id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LikedItems;