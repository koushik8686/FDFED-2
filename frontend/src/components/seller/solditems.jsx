import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Home.css";

export default function SellerSoldItems() {
  const navigate = useNavigate();
  const [soldItems, setSoldItems] = useState([]);
  const [unsoldItems, setUnsoldItems] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sellerid = Cookies.get("seller");

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        if (!sellerid) {
          return navigate("/seller");
        }
        const response = await axios.get(`/sellerhome/${sellerid}`);
        setSeller(response.data.seller);
        const soldItems = response.data.seller.solditems;
        const unsoldItems = response.data.seller.items.filter((item) => !item.auction_active);
        setSoldItems(soldItems);
        setUnsoldItems(unsoldItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldItems();
  }, [sellerid]);

  const logout = () => {
    Cookies.remove("seller");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-72 shadow-lg`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Seller Dashboard</h1>
        </div>
        <nav className="flex flex-col">
          <Link to="/sellerhome" className="px-6 py-3 text-lg hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/seller/solditems" className="px-6 py-3 text-lg hover:bg-gray-700">
            Sold Items
          </Link>
          <button onClick={logout} className="px-6 py-3 text-lg hover:bg-red-600 w-full text-left">
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow-md p-4 md:p-6">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold">Welcome, {seller.name}</h2>
        </header>

        {/* Items Section */}
        <main className="p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {soldItems.length === 0 && unsoldItems.length === 0 ? (
              <p className="text-gray-600 text-center text-lg">No sold or unsold items to display.</p>
            ) : (
              <>
                {soldItems.length > 0 && (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sold Items</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {soldItems.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-lg">
                          <img src={"/" + item.url} alt={item.name} className="w-full h-48 object-cover rounded-md" />
                          <div className="mt-3">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-gray-600">Sold Price: ₹{item.current_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {unsoldItems.length > 0 && (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Unsold Items</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {unsoldItems.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-lg">
                          <img src={"/" + item.url} alt={item.name} className="w-full h-48 object-cover rounded-md" />
                          <div className="mt-3">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-gray-600">Base Price: ₹{item.base_price}</p>
                            <p className="text-gray-600">Current Price: ₹{item.current_price}</p>
                            <span className="inline-block mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md">
                              Status: Unsold
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
