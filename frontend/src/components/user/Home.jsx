import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Items from './homecomponents/Items';
import Myitems from './homecomponents/myitems';
import Mostvisited from './homecomponents/mostvisited';
import './Home.css'
import LikedItems from './homecomponents/LikedItems';
import { useDispatch } from 'react-redux';
import { toggleWishlist } from '../../redux/LikedReducer';
import axios from 'axios';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [display, setDisplay] = useState("items");
  const [myitems, setMyItems] = useState([]);
  const [email, setemail] = useState('');
  const [showLikedWindow, setShowLikedWindow] = useState(false);
  const userid = Cookies.get('user');
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const dataProcessed = useRef(false); // Use useRef for immediate updates
  const dispatch = useDispatch();
  const logout = () => {
    Cookies.remove('user');
    navigate('/');
  };
  const toggleLikedWindow = () => {
    setShowLikedWindow((prev) => !prev);
  };

  useEffect(() => {
    if (Cookies.get("user") === undefined) {
      navigate("/login");
    }
    const fetchUserData = () => {
      const xhr = new XMLHttpRequest();
      //true for asynchrnous
      xhr.open('GET', `${process.env.REACT_APP_BACKENDURL}/user/${userid}`, true);
    
      // Set up a function to handle changes to the request's state
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && !dataProcessed.current) { // Process only once
          dataProcessed.current = true;
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            setemail(data.data.user.email);
            setMyItems(data.data.user.items);
            const currentTime = new Date();
            const validItems = data.data.items.filter(item => {
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
            data.data.user.liked.forEach((item) => {
              console.log(item);
              dispatch(toggleWishlist(item));
            });
          } else {
            console.error('Error fetching user data:', xhr.statusText);
          }
        }
      };        
      // Handle network errors
      xhr.onerror = () => {
        console.error('Fetch error:', xhr.statusText);
      };
    
      xhr.send();
    };
    
    fetchUserData();
  }, [userid, navigate, dispatch]);

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
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="user-home-username-full">
              {email}
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
          <button className="user-home-liked-button" onClick={toggleLikedWindow}>
            Liked Items
          </button>
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
                onClick={() => { console.log("clicked arts"); setSelectedCategory('Art'); setShowFilterPopup(false); }}
              >
                Arts
              </button>
              <button
                className={`user-home-filter-option ${selectedCategory === 'Antique' ? 'active' : ''}`}
                onClick={() => { console.log("clicked antiques"); setSelectedCategory('Antique'); setShowFilterPopup(false); }}
              >
                Antiques
              </button>
              <button
                className={`user-home-filter-option ${selectedCategory === 'Used' ? 'active' : ''}`}
                onClick={() => { console.log("clicked used items"); setSelectedCategory('Used'); setShowFilterPopup(false); }}
              >
                Used Items
              </button>
              <button
                className={`user-home-filter-option ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => { console.log("clicked all "); setSelectedCategory('All'); setShowFilterPopup(false); }}
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
      {/* {showLikedWindow && <LikedItems closepopup={toggleLikedWindow} />} Render LikedItems if visible */}
      <main className="flex">
        <div className="flex-grow">
          {display === 'items' && <Items filteredItems={filteredItems} />}
          {display === 'myitems' && <Myitems MyfilteredItems={MyfilteredItems} />}
          {display === 'mostvisited' && <Mostvisited Items={filteredItems} />}
        </div>
        {showLikedWindow && display === 'items' && (
          <LikedItems closepopup={() => setShowLikedWindow(false)} />
        )}
      </main>
    </div>
  );
}