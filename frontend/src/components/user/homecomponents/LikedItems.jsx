import React from 'react';
import { useSelector } from 'react-redux';

const LikedItems = ({ closepopup }) => {
  const likedItems = useSelector((state) => state.liked);

  return (
    <div className="w-80 bg-white h-full overflow-y-auto border-l border-gray-200 shadow-lg">
      <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liked Items</h2>
        <button onClick={closepopup} className="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {likedItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No items liked yet!</p>
        ) : (
          <ul className="space-y-4 overflow-y-scroll" style={{height:"100%"}}>
            {[...likedItems].reverse().map((item) => (
              <li key={item._id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                <img src={item.url} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-600">Type: {item.type}</p>
                  <p className="text-sm text-gray-600">Price: ${item.current_price}</p>
                  <p className="text-sm text-gray-600">Seller: {item.person}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LikedItems;

