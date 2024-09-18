import React from 'react'
import { Link } from 'react-router-dom'
import "../../../App.css"


export default function Items({filteredItems} ) {
  const boxStyle = {
    borderRadius: '8px',
    animation: 'fadeIn 2s ease-in-out',
  };
  return (
    <div style={boxStyle} className=' container mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
         {filteredItems.map(item => (
          <div key={item.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={"/"+item.url}
              alt={item.name}
              className="w-full h-48 object-cover"
              style={{ aspectRatio: "300/200" }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Owner: {item.person}</span>
                <span className="text-gray-500">Base Price: ${item.base_price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600 font-medium">Current Price: ${item.current_price}</span>
                <Link to={`/auction/${item._id}`}>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
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

