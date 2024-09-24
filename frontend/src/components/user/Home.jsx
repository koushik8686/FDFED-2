import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Items from './homecomponents/Items';
import Myitems from './homecomponents/myitems';
import Mostvisited from './homecomponents/mostvisited';
import './Home.css'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedItems, setSortedItems] = useState([]);
  const [display, setDisplay] = useState("items");
  const [myitems, setMyItems] = useState([]);
  const [username, setUsername] = useState('');
  const userid = Cookies.get('user');
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  
  const logout = () => {
    Cookies.remove('user');
    navigate('/');
  };

  useEffect(() => {
    if (Cookies.get("user") === undefined) {
      navigate("/login");
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/user/${userid}`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.data.user.username);
          setMyItems(data.data.user.items);
          setItems(data.data.items);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchUserData();
  }, [userid, navigate]);

  const filteredItems = items.filter(item =>
    (selectedCategory === 'All' || item.type === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MyfilteredItems = myitems.filter(item =>
    (selectedCategory === 'All' || item.type === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-home-container">
      <header className="user-home-header">
        <nav className="user-home-nav">
          <div className="user-home-username">
            <div className="user-home-username-circle">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="user-home-username-full">
              {username}
            </div>
          </div>
          <Link onClick={() => { setDisplay("items") }} to="#" className="user-home-link">All Items</Link>
          <Link onClick={() => { setDisplay("myitems") }} to="#" className="user-home-link">My Items</Link>
          <Link onClick={() => { setDisplay("mostvisited") }} to="#" className="user-home-link">Most Visited</Link>
          <Link to="/seller" className="user-home-link">Start Selling</Link>
        </nav>
        <div className="user-home-logout">
          <button onClick={logout} className="user-home-logout-button">Log Out</button>
        </div>
      </header>
      <div className="user-home-search">
      <div className="user-home-categories">
    <button
      className={`user-home-category-button ${selectedCategory === 'Art' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('Art')}
    >
      Arts
    </button>
    <button
      className={`user-home-category-button ${selectedCategory === 'Antique' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('Antique')}
    >
      Antiques
    </button>
    <button
      className={`user-home-category-button ${selectedCategory === 'Used' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('Used')}
    >
      Used
    </button>
    <button
      className={`user-home-category-button ${selectedCategory === 'All' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('All')}
    >
      All
    </button>
  </div>

  <div className="user-home-search-bar">
    <input
      type="text"
      placeholder="Search items..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="user-home-search-input"
    />
    <button
      className="user-home-filter-button"
      onClick={() => setShowFilterPopup(true)}
    >
      Filter
    </button>
  </div>
</div>

{showFilterPopup && (
  <div className="user-home-filter-popup">
    <div className="user-home-filter-content">
      <h2 className="user-home-filter-title">Filter Items</h2>
      <div className="user-home-filter-options">
        <button
          className={`user-home-filter-option ${selectedCategory === 'Art' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('Art'); setShowFilterPopup(false); }}
        >
          Arts
        </button>
        <button
          className={`user-home-filter-option ${selectedCategory === 'Antique' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('Antique'); setShowFilterPopup(false); }}
        >
          Antiques
        </button>
        <button
          className={`user-home-filter-option ${selectedCategory === 'Used' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('Used'); setShowFilterPopup(false); }}
        >
          Used Items
        </button>
        <button
          className={`user-home-filter-option ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('All'); setShowFilterPopup(false); }}
        >
          All
        </button>
      </div>
      <button
        className="user-home-filter-close"
        onClick={() => setShowFilterPopup(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
      <main className="user-home-main">
        {display === 'items' && <Items filteredItems={filteredItems} />}
        {display === 'myitems' && <Myitems MyfilteredItems={MyfilteredItems} />}
        {display === 'mostvisited' && <Mostvisited Items={filteredItems} />}
      </main>
    </div>
  );
}
