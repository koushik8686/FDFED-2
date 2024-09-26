import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai';
import "./Home.css";
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const [data, setData] = useState({ users: [], sellers: [], items: [] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

 async function fetchData() {
    try {
      const response = await axios.get('/admin/home');
      console.log(response.data);
      setData(response.data.data);
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

  const deleteUser = (id) => {
    axios.get(`/delete/user/${id}`)
      .then((response) => {
      console.log(response);
       fetchData();
      })
      .catch((error) => {
        console.error("Error deleting user", error);
      });
  };

  const deleteSeller = (id) => {
    axios.get(`/delete/seller/${id}`)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting seller", error);
      });
  };

  const deleteItem = (id) => {
    axios.get(`/delete/item/${id}`)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting item", error);
      });
  };

  const logout = () => {
    Cookies.remove('admin');
    navigate('/');
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
          <a href="#users" className="nav-item">Users</a>
          <a href="#sellers" className="nav-item">Sellers</a>
          <a href="#items" className="nav-item">Items</a>
          <Link to="/admin/calender" className="nav-item">Calender</Link>

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
          {/* Dashboard */}
          <section id="dashboard">
            <h2 className="section-title">Dashboard</h2>
            <div className="grid-container">
              <div className="stat-card">
                <h3 className="stat-card-title">Active Users</h3>
                <p className="stat-value">{data.users.length}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-card-title">Active Sellers</h3>
                <p className="stat-value">{data.sellers.length}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-card-title">Active Auctions</h3>
                <p className="stat-value">{data.items.length}</p>
              </div>
            </div>
          </section>

          {/* Users */}
          <section id="users">
            <h2 className="section-title">Users</h2>
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">Username</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr className='table-row' key={user._id}>
                    <td className="table-cell">{user.username}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">{user.items.length}</td>
                    <td className="table-cell">
                      <AiOutlineDelete onClick={() => deleteUser(user._id)} className="delete-icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Sellers */}
          <section id="sellers">
            <h2 className="section-title">Sellers</h2>
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.sellers.map((seller) => (
                  <tr className='table-row' key={seller._id}>
                    <td className="table-cell">{seller.name}</td>
                    <td className="table-cell">{seller.email}</td>
                    <td className="table-cell">{seller.phone}</td>
                    <td className="table-cell">{seller.items.length}</td>
                    <td className="table-cell">
                      <AiOutlineDelete onClick={() => deleteSeller(seller._id)} className="delete-icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Items */}
          <section id="items">
            <h2 className="section-title">Items</h2>
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Person</th>
                  <th className="table-header">Base Price</th>
                  <th className="table-header">Current Price</th>
                  <th className="table-header">Image</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item._id}>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.person}</td>
                    <td className="table-cell">{item.base_price}</td>
                    <td className="table-cell">{item.current_price}</td>
                    <td className="table-cell"><img src={"/" + item.url} alt={item.name} /></td>
                    <td className="table-cell">
                      <AiOutlineDelete onClick={() => deleteItem(item._id)} className="delete-icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
