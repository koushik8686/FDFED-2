import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import axios from "axios";
import Cookies from "js-cookie";
import './Home.css'

export default function SellerHome() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const sellerid = Cookies.get("seller");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get(`/sellerhome/${sellerid}`);
        setSeller(response.data.seller);
        setItems(response.data.seller.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerid]);

  const handleAddItem = () => {
    setShowAddItemForm(true);
  };

  const handleCloseForm = () => {
    setShowAddItemForm(false);
  };

  const handleNewItem = (newItem) => {
    setItems([...items, newItem]);
    setShowAddItemForm(false);
  };

  const logout = () => {
    Cookies.remove("seller");
    navigate("/seller");
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="seller-home-div-container">
      <header className="seller-home-div-header">
        <button onClick={toggleNav} className="seller-home-div-nav-button">
          ☰
        </button>
        <div className="seller-home-div-welcome">
          <h2>Welcome, {seller.name}</h2>
        </div>
        <button onClick={logout} className="text-sm hover:text-gray-300 transition-colors">
          Logout
        </button>
      </header>

      {/* Side Navbar */}
      <div className={`seller-home-div-navbar ${isNavOpen ? "active" : ""}`}>
        <div className="seller-home-div-nav-item">
          <Link to="/" className="seller-home-div-button">Dashboard</Link>
        </div>
        <div className="seller-home-div-nav-item">
          <button onClick={handleAddItem} className="seller-home-div-button">
            Add Item
          </button>
        </div>
        <div className="seller-home-div-nav-item">
          <Link to="/profile" className="seller-home-div-button">Profile</Link>
        </div>
      </div>

      {isNavOpen && <div className="seller-home-div-blur" onClick={toggleNav}></div>}

      {/* Main Content */}
      <div className="p-6">
        {showAddItemForm && <AddItem onClose={handleCloseForm} onAdd={handleNewItem} />}

        <main className="seller-home-div-main">
          {items.map((item) => (
            <div key={item._id} className="seller-home-div-item">
              <img src={"/" + item.url} alt={item.name} className="seller-home-div-image" />
              <div className="seller-home-div-content">
                <h3 className="seller-home-div-title">{item.name}</h3>
                <div className="seller-home-div-price">
                  <span>Base Price: ${item.base_price}</span>
                  <span>Current Price: ${item.current_price}</span>
                </div>
                <Link to={`/item/${item._id}`} className="seller-home-div-view-button">
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
