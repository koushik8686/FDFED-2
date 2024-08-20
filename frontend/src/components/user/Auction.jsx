import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auction() {
  const [itemData, setItemData] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const { item } = useParams();
  const userid = Cookies.get('user');

  useEffect(() => {
    fetch(`/auction/${userid}/item/${item}`)
      .then((response) => response.json())
      .then((data) => setItemData(data.data.item))
      .catch((error) => console.error("Error fetching item data:", error));
  }, [item, userid]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();

    // Create the bid object
    // Send the POST request
    fetch(`http://localhost:4000/auction/${userid}/item/${item}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bid: bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Clear the bid input
        setBidAmount("");
  
        // Refetch the updated item data to reflect the latest bid
        fetch(`http://localhost:4000/auction/${userid}/item/${item}`)
          .then((response) => response.json())
          .then((newData) => {
            setItemData(newData.data.item); // Update the state with the new item data
          })
          .catch((error) => console.error("Error fetching updated item data:", error));
      })
      .catch((error) => console.error("Error submitting bid:", error));
  };
  

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Link to="/home" className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <h1 className="flex-1 text-2xl font-bold text-center">{itemData.name}</h1>
      </div>

      <div className="lg:grid md:grid-cols-2 sm:flex-col-reverse gap-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Bid History</h2>
          <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            {itemData.auction_history.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left text-gray-700">Bidder</th>
                    <th className="py-2 px-4 text-left text-gray-700">Bid Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {itemData.auction_history.slice().reverse().map((history, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-t">{history.bidder}</td>
                      <td className="py-2 px-4 border-t">${history.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4">No bids yet.</p>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          <img
            src={`http://localhost:4000/${itemData.url}`}
            alt={itemData.name}
            width={600}
            height={400}
            className="w-full rounded-lg object-cover shadow-md"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
          <div className="grid gap-2 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Current Highest Bidder:</span>
              <span className="font-medium">{itemData.current_bidder || "No bids yet"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Base Price:</span>
              <span className="font-medium">${itemData.base_price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Current Price:</span>
              <span className="font-medium">${itemData.current_price}</span>
            </div>
          </div>
          <form className="grid gap-4 mt-6" onSubmit={handleBidSubmit}>
            <div className="grid gap-2">
              <label htmlFor="bid" className="text-base text-gray-700">
                Place Your Bid
              </label>
              <div className="relative">
                <input
                  id="bid"
                  type="number"
                  min={parseFloat(itemData.current_price) + 1}
                  step="1"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">USD</span>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-900"
            >
              Place Bid
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
