import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function TimeFrame() {
  const [data, setData] = useState({ users: [], sellers: [], items: [] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [groupedData, setGroupedData] = useState({ users: {}, sellers: {}, items: {} });
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const response = await axios.get('/admin/home');
      console.log(response.data);
      setData(response.data.data);
      groupDataByDate(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  useEffect(() => {
    if (!Cookies.get('admin')) {
      navigate("/admin/login");
    }
    fetchData();
  }, []);

  const logout = () => {
    Cookies.remove('admin');
    navigate('/');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Format the timestamp as a date string
  };

  const groupDataByDate = (data) => {
    const usersByDate = data.users.reduce((grouped, user) => {
      const date = formatDate(user.createdAt); // Assuming user has a createdAt field
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(user);
      return grouped;
    }, {});

    const sellersByDate = data.sellers.reduce((grouped, seller) => {
      const date = formatDate(seller.createdAt); // Assuming seller has a createdAt field
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(seller);
      return grouped;
    }, {});

    const itemsByDate = data.items.reduce((grouped, item) => {
      const date = formatDate(item.createdAt); // Assuming item has a createdAt field
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
      return grouped;
    }, {});

    setGroupedData({ users: usersByDate, sellers: sellersByDate, items: itemsByDate });
  };

  return (
    <div className="admin-home-div">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <h1 className="sidebar-title">Auction Admin</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">Dashboard</Link>
          <p onClick={logout} className="nav-item">Log Out</p>
        </nav>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-header">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
            <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="admin-welcome">Welcome, Admin</h2>
        </header>

        <main className="admin-content">
          {/* Users grouped by date */}
          <section id="users-by-date">
            <h2 className="section-title">Users by Date</h2>
            {Object.keys(groupedData.users).map((date) => (
              <div key={date}>
                <h3>{date}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">Username</th>
                      <th className="table-header">Email</th>
                      <th className="table-header">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.users[date].map((user) => (
                      <tr className='table-row' key={user._id}>
                        <td className="table-cell">{user.username}</td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">{user.items.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>

          {/* Sellers grouped by date */}
          <section id="sellers-by-date">
            <h2 className="section-title">Sellers by Date</h2>
            {Object.keys(groupedData.sellers).map((date) => (
              <div key={date}>
                <h3>{date}</h3>
                <table className="table">
                  <thead>
                    <tr> 
                        
                      <th className="table-header">Name</th>
                      <th className="table-header">Email</th>
                      <th className="table-header">Phone</th>
                      <th className="table-header">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.sellers[date].map((seller) => (
                      <tr className='table-row' key={seller._id}>
                        <td className="table-cell">{seller.name}</td>
                        <td className="table-cell">{seller.email}</td>
                        <td className="table-cell">{seller.phone}</td>
                        <td className="table-cell">{seller.items.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>

          {/* Items grouped by date */}
          <section id="items-by-date">
            <h2 className="section-title">Items by Date</h2>
            {Object.keys(groupedData.items).map((date) => (
              <div key={date}>
                <h3>{date}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">Name</th>
                      <th className="table-header">Person</th>
                      <th className="table-header">Base Price</th>
                      <th className="table-header">Current Price</th>
                      <th className="table-header">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.items[date].map((item) => (
                      <tr key={item._id}>
                        <td className="table-cell">{item.name}</td>
                        <td className="table-cell">{item.person}</td>
                        <td className="table-cell">{item.base_price}</td>
                        <td className="table-cell">{item.current_price}</td>
                        <td className="table-cell"><img src={"/" + item.url} alt={item.name} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
