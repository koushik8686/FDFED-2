import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import axios from "axios";
import Cookies from "js-cookie";
import './Home.css';

export default function SellerHome() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open/close state
  const sellerid = Cookies.get("seller");

  const fetchSellerData = async () => {
    try {
      if (!sellerid) {
        return navigate("/seller");
      }
      console.log(`${process.env.REACT_APP_BACKENDURL}/sellerhome/${sellerid}`);
      const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/sellerhome/${sellerid}`);
      setSeller(response.data.data.seller);
      console.log(response.data.seller);

      const currentTime = new Date();
      const validItems = response.data.data.seller.items.filter(item => {
        if (!item.EndTime) {
          return true;
        }
        const endTime = new Date(item.EndTime);
        if (endTime > currentTime) {
          return true;
        } else {
          // Send API request to mark item as unsold
          axios.post(`${process.env.REACT_APP_BACKENDURL}/item/unsold/${item._id}`)
            .then(response => {
              console.log(`Item ${item._id} marked as unsold`);
            })
            .catch(error => {
              console.error(`Error marking item ${item._id} as unsold:`, error);
            });
          return false;
        }
      });
      setItems(validItems.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <div className={`seller-home-div ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <aside className={`seller-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h1 className="sidebar-title">Seller Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/sellerhome" className="nav-item">Dashboard</Link>
          <Link to="/seller/solditems" className="nav-item">Sold Items</Link>
          <button onClick={handleAddItem} className="nav-item">Add Item</button>
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
          {showAddItemForm && <AddItem onClose={handleCloseForm} fetchdata={fetchSellerData} onAdd={handleNewItem} />}

          <div className="items-container">
            {items.map((item) => {
              const now = new Date();
              const hasAuctionTiming = item.date && item.StartTime && item.EndTime;
              const formattedDate = hasAuctionTiming
                ? new Date(item.date).toLocaleDateString()
                : 'N/A';
              const startTime = hasAuctionTiming ? new Date(item.StartTime) : null;
              const formattedStartTime = hasAuctionTiming
                ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'N/A';
              const endTime = hasAuctionTiming ? new Date(item.EndTime) : null;
              const formattedEndTime = hasAuctionTiming
                ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'N/A';

              return (
                <div key={item._id} className="item-card">
                  <img src={item.url} alt={item.name} className="item-image" />
                  <div className="item-content">
                    <div className="qwe">
                      <h3 className="item-title">{item.name}</h3>
                      {/* <AiOutlineDelete className="delete-icon" /> */}
                    </div>
                    <div className="item-prices">
                      <span> <b>Base Price: </b> ₹{item.base_price}</span>
                      <span><b>Current Price:</b> ₹{item.current_price}</span>
                    </div>
                    <div className="auction-timing">
                      <span>Date: {formattedDate}</span> |{' '}
                      <span>Start: {formattedStartTime}</span> |{' '}
                      <span>End: {formattedEndTime}</span>
                    </div>
                    <button className="view-item-button">  <Link to={`/item/${item._id}`} className="view-item-button">View Item</Link></button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}