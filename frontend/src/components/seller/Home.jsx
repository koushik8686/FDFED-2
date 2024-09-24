import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import axios from "axios";
import Cookies from "js-cookie";
import './Home.css';
import { AiOutlineDelete } from 'react-icons/ai';


export default function SellerHome() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open/close state
  const sellerid = Cookies.get("seller");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get(`/sellerhome/${sellerid}`);
        setSeller(response.data.seller);
        console.log(response.data.items);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`seller-home-div ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <aside className={`seller-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h1 className="sidebar-title">Seller Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">Dashboard</Link>
          <button onClick={handleAddItem} className="nav-item">Add Item</button>
          <Link to="/profile" className="nav-item">Profile</Link>
          <p onClick={logout} className="nav-item">Log Out</p>
        </nav>
      </aside>

      {/* Main content */}
      <div className="seller-main">
        <header className="seller-header">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
            <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="seller-welcome">Welcome, {seller.name}</h2>
        </header>

        <main className="seller-content">
          {showAddItemForm && <AddItem onClose={handleCloseForm} onAdd={handleNewItem} />}

          <div className="items-container">
            {items.map((item) => (
              <div key={item._id} className="item-card">
                <img src={"/" + item.url} alt={item.name} className="item-image" />
                <div className="item-content">
                <div className="qwe">
                  <h3 className="item-title">{item.name}</h3>
                  <AiOutlineDelete className="delete-icon" />
                </div>
                  <div className="item-prices">
                    <span>Base Price: ${item.base_price}</span>
                    <span>Current Price: ${item.current_price}</span>
                  </div>
                  <Link to={`/item/${item._id}`} className="view-item-button">View Item</Link>
                 
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
