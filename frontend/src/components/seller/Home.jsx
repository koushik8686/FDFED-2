import { useState, useEffect } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import AddItem from "./AddItem"; // Import the AddItem component
import axios from "axios"; // Import axios for API requests
import Cookies from "js-cookie";
// React Chart Component
import { AgCharts } from 'ag-charts-react';

export default function SellerHome() {
  const navigate = useNavigate()
  const [items, setItems] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showChart, setShowChart] = useState(false); // New state for chart visibility
  const [filter, setFilter] = useState("All");
  const [itemdata, setItemData] = useState([])
  const sellerid = Cookies.get("seller");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get(`/sellerhome/${sellerid}`); // Update with actual seller ID
        setSeller(response.data.seller);
        setItems(response.data.seller.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);
  
  const [chartOptions, setChartOptions] = useState({
    data: [],
    series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }],
  });

  const handleAddItem = () => {
    setShowAddItemForm(true);
  };

  const handleCloseForm = () => {
    setShowAddItemForm(false);
  };

  const handleNewItem = (newItem) => {
    setItems([...items, { ...newItem, id: items.length + 1, currentPrice: newItem.basePrice }]);
    setShowAddItemForm(false);
  };

  const filteredItems = items.filter((item) => filter === "All" || item.type === filter);

  const toggleChart = () => {
    items.forEach(element => {
      itemdata.push({name: element.name, base_price: element.base_price });
    });
    setChartOptions({ data: itemdata, series: [{ type: 'bar', xKey: 'name', yKey: 'base_price' }] });
    setShowChart(!showChart);
  }
  const logout = ()=>{
   Cookies.remove('seller')
   navigate("/seller")
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 bg-gray-800 text-white py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl">
            HexArt
          </Link>
          <button
            onClick={handleAddItem}
            className="text-sm bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-2 rounded-md shadow"
          >
            Add Item
          </button>
          <button
            onClick={toggleChart}
            className="text-sm bg-green-600 hover:bg-green-500 transition-colors text-white px-4 py-2 rounded-md shadow"
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
        </div>
        <button onClick={logout} to="#" className="text-sm hover:text-gray-300 transition-colors">
          Logout
        </button>
      </header>

      <div className="p-6">
        <div className="flex justify-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {seller.name}</h2>
          <div className="space-x-4">
            <button
              onClick={() => setFilter("All")}
              className={`text-sm px-4 py-2 rounded-md ${
                filter === "All" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              } shadow hover:bg-blue-500 hover:text-white transition-colors`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Art")}
              className={`text-sm px-4 py-2 rounded-md ${
                filter === "Art" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              } shadow hover:bg-blue-500 hover:text-white transition-colors`}
            >
              Art
            </button>
            <button
              onClick={() => setFilter("Antique")}
              className={`text-sm px-4 py-2 rounded-md ${
                filter === "Antique" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              } shadow hover:bg-blue-500 hover:text-white transition-colors`}
            >
              Antique
            </button>
            <button
              onClick={() => setFilter("Used")}
              className={`text-sm px-4 py-2 rounded-md ${
                filter === "Used" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              } shadow hover:bg-blue-500 hover:text-white transition-colors`}
            >
              Used
            </button>
          </div>
        </div>

        {showAddItemForm && (
          <AddItem onClose={handleCloseForm} onAdd={handleNewItem} />
        )}

        {showChart && (
          <div className="mt-6">
            <AgCharts options={chartOptions} />
          </div>
        )}

        <main className="flex-1 bg-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={"http://localhost:4000/" + item.url || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-gray-500 text-sm">Base Price:</span>{" "}
                    <span className="font-bold text-gray-800">${item.base_price}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Current Price:</span>{" "}
                    <span className="font-bold text-gray-800">${item.current_price}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Type:</span>{" "}
                  <span className="font-bold text-gray-800">{item.type}</span>
                </div>
                <Link
                  to={`/item/${item._id}`}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
                  View Item
                </Link>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
