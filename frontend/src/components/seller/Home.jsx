"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AddItem from "./AddItem"
import axios from "axios"
import Cookies from "js-cookie"
import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function SellerHome() {
  // Component for the Edit Item Form
  const EditItemForm = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: item.name || "",
      base_price: item.base_price || 0,
      type: item.type || "",
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : "", // Format date for input
      StartTime: item.StartTime ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "",
      EndTime: item.EndTime ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "",
      // Add other fields as necessary, e.g., description, image
    })
    const [imagePreview, setImagePreview] = useState(item.url || null)
    const [imageFile, setImageFile] = useState(null)

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const updatedData = new FormData();
      Object.keys(formData).forEach(key => {
        updatedData.append(key, formData[key]);
      });
      if (imageFile) {
        updatedData.append('image', imageFile);
      }
      // If no new image, but we want to keep the old one, ensure backend handles this.
      // Or, send item.url if no new imageFile to indicate keeping the old one, if backend supports.
      onSave(updatedData)
    }

    return (
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Base Price</label>
          <input type="number" name="base_price" id="base_price" value={formData.base_price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select name="type" id="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="" disabled>Select item type</option>
            <option value="Art">Art</option>
            <option value="Antique">Antique</option>
            <option value="Used">Used</option>
            {/* Add other types as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Auction Date</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="StartTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input type="time" name="StartTime" id="StartTime" value={formData.StartTime} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="EndTime" className="block text-sm font-medium text-gray-700">End Time</label>
          <input type="time" name="EndTime" id="EndTime" value={formData.EndTime} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" name="image" id="image" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded" />}
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
            Save Changes
          </button>
        </div>
      </form>
    )
  }

  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false) // New state for edit modal
  const [editingItem, setEditingItem] = useState(null) // New state for item being edited
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const sellerid = Cookies.get("seller")

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalItems: 0,
    totalValue: 0,
    averagePrice: 0,
    totalBids: 0,
    totalVisits: 0,
  })

  const fetchSellerData = async () => {
    try {
      if (!sellerid) {
        return navigate("/seller")
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/sellerhome/${sellerid}`)
      setSeller(response.data.seller)

      const currentTime = new Date()
      const validItems = response.data.items.filter((item) => {
        if (!item.EndTime) {
          return true
        }
        const endTime = new Date(item.EndTime)
        if (endTime > currentTime) {
          return true
        } else {
          // Send API request to mark item as unsold
          axios
            .post(`${process.env.REACT_APP_BACKENDURL}/item/unsold/${item._id}`)
            .then((response) => {
              console.log(`Item ${item._id} marked as unsold`)
            })
            .catch((error) => {
              console.error(`Error marking item ${item._id} as unsold:`, error)
            })
          return false
        }
      })

      setItems(validItems.reverse())

      // Calculate analytics
      const totalItems = validItems.length
      const totalValue = validItems.reduce((sum, item) => sum + Number.parseInt(item.current_price), 0)
      const averagePrice = totalItems > 0 ? totalValue / totalItems : 0
      const totalBids = validItems.reduce(
        (sum, item) => sum + (item.auction_history ? item.auction_history.length : 0),
        0,
      )
      console.log(validItems[0])
      console.log(totalBids)
      const totalVisits = validItems.reduce(
        (sum, item) => sum + (item.visited_users ? item.visited_users.length : 0),
        0,
      )

      setAnalytics({
        totalItems,
        totalValue,
        averagePrice,
        totalBids,
        totalVisits,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellerData()
  }, [sellerid])

  const handleAddItem = () => {
    setShowAddItemForm(true)
  }

  const handleCloseForm = () => {
    setShowAddItemForm(false)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingItem(null)
  }

    const handleUpdateItem = async (updatedItemData) => {
      if (!editingItem) return

      try {
        await axios.put(`${process.env.REACT_APP_BACKENDURL}/item/update/${editingItem._id}`, updatedItemData)
        fetchSellerData() // Refresh data
        handleCloseEditModal() // Close modal on success
      } catch (error) {
        console.error("Error updating item:", error)
      }
    }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKENDURL}/item/delete/${itemId}`)
        fetchSellerData()
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const handleNewItem = (newItem) => {
    setItems([...items, newItem])
    setShowAddItemForm(false)
    fetchSellerData() // Refresh data
  }

  const logout = () => {
    Cookies.remove("seller")
    navigate("/")
  }

  // Function to render the price comparison chart
  const renderPriceChart = ({ items, analytics }) => {
    if (items.length === 0) {
      return null;
    }
    const chartData = items.map((item) => ({
      name: item.name,
      basePrice: parseInt(item.base_price),
      currentPrice: parseInt(item.current_price),
    }));
  
    return (
      <div className="w-full h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="basePrice" fill="#c3bdfa" name="Base Price" />
            <Bar dataKey="currentPrice" fill="#8b5cf6" name="Current Price" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Function to render the bid activity chart

  const renderBidActivityChart = ({ items }) => {
    const chartData = items.map(item => ({
      name: item.name,
      bids: item.auction_history ? item.auction_history.length : 0,
    }));
  
    return (
      <div className="w-full h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar name="Bids" dataKey="bids" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="p-4 rounded-full bg-indigo-100">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out bg-indigo-800 text-white shadow-lg`}
      >
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-xl font-bold">Auction Dashboard</h1>
          <p className="text-violet-200 text-sm mt-1">
            {seller.subscription === "free" ? "Free Plan" : "Premium Plan"}
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
              {seller.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-xs text-violet-200">{seller.email}</p>
            </div>
          </div>
        </div>

        <nav className="mt-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-6 py-3 text-left ${activeTab === "dashboard" ? "bg-indigo-700" : "hover:bg-indigo-700"}`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center w-full px-6 py-3 text-left ${activeTab === "items" ? "bg-indigo-700" : "hover:bg-indigo-700"}`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            My Items
          </button>

          <Link to="/seller/solditems" className="flex items-center w-full px-6 py-3 hover:bg-indigo-700">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Sold Items
          </Link>

          <button onClick={handleAddItem} className="flex items-center w-full px-6 py-3 hover:bg-indigo-700">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Item
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-violet-200 hover:text-white">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden mr-4 text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === "dashboard" ? "Dashboard Overview" : "My Items"}
              </h2>
            </div>
          
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {/* Add Item Modal */}
          {showAddItemForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Add New Item</h3>
                  <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <AddItem
                  onClose={handleCloseForm}
                  sellerdata={seller}
                  fetchdata={fetchSellerData} // Pass fetchSellerData to AddItem
                  onAdd={handleNewItem}
                />
              </div>
            </div>
          )}

          {/* Edit Item Modal */}
          {showEditModal && editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Edit Item</h3>
                  <button onClick={handleCloseEditModal} className="text-gray-500 hover:text-gray-700">
                    {/* Close Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <EditItemForm item={editingItem} onSave={handleUpdateItem} onClose={handleCloseEditModal} />
              </div>
            </div>
          )}

          {activeTab === "dashboard" ? (
            <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Items</p>
                      <p className="text-2xl font-semibold">{analytics.totalItems}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-violet-100 text-violet-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-2xl font-semibold">₹{analytics.totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Bids</p>
                      <p className="text-2xl font-semibold">{analytics.totalBids}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Visits</p>
                      <p className="text-2xl font-semibold">{analytics.totalVisits}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Price Comparison</h3>
                  <p className="text-sm text-gray-500 mb-4">Base price (light) vs Current price (dark)</p>
                  {renderPriceChart({ items, analytics })}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Bid Activity</h3>
                  <p className="text-sm text-gray-500 mb-4">Number of bids per item</p>
                  {renderBidActivityChart({ items, analytics })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bidder
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.reverse()
                        .flatMap((item) =>
                          (item.auction_history || []).reverse().map((bid, bidIndex) => (
                            <tr key={`${item._id}-${bidIndex}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={item.url || "/placeholder.svg"}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{bid.bidder}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  ₹{Number.parseInt(bid.price).toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.current_bidder_id && bid.bidder === item.current_bidder
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {item.current_bidder_id && bid.bidder === item.current_bidder
                                    ? "Highest Bid"
                                    : "Outbid"}
                                </span>
                              </td>
                            </tr>
                          )),
                        )
                        .slice(0,10)}

                      {items.flatMap((item) => item.auction_history || []).length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                            No bids yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const now = new Date()
                  const hasAuctionTiming = item.date && item.StartTime && item.EndTime
                  const formattedDate = hasAuctionTiming ? new Date(item.date).toLocaleDateString() : "N/A"
                  const startTime = hasAuctionTiming ? new Date(item.StartTime) : null
                  const formattedStartTime = hasAuctionTiming
                    ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "N/A"
                  const endTime = hasAuctionTiming ? new Date(item.EndTime) : null
                  const formattedEndTime = hasAuctionTiming
                    ? endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "N/A"

                  const bidCount = item.auction_history ? item.auction_history.length : 0
                  const visitCount = item.visited_users ? item.visited_users.length : 0

                  // Calculate if auction is active now
                  const isActive = hasAuctionTiming && now >= startTime && now <= endTime

                  // Calculate price increase percentage
                  const basePrice = Number.parseInt(item.base_price)
                  const currentPrice = Number.parseInt(item.current_price)
                  const priceIncrease = basePrice > 0 ? Math.round(((currentPrice - basePrice) / basePrice) * 100) : 0

                  return (
                    <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col"
                  >
                    <div className="relative h-48">
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                      {isActive && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-violet-600 text-white text-xs font-medium rounded-full shadow-sm">
                          Live Auction
                        </div>
                      )}
                    </div>
                  
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {item.type}
                        </span>
                      </div>
                  
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Base Price</p>
                          <p className="font-medium">₹{Number.parseInt(item.base_price).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Current Price</p>
                          <div className="flex items-center">
                            <p className="font-medium">
                              ₹{Number.parseInt(item.current_price).toLocaleString()}
                            </p>
                            {priceIncrease > 0 && (
                              <span className="ml-1 text-xs text-green-600">+{priceIncrease}%</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bids</p>
                          <p className="font-medium">{bidCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Visits</p>
                          <p className="font-medium">{visitCount}</p>
                        </div>
                      </div>
                  
                      <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Auction Date:</span>
                          <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Time:</span>
                          <span className="font-medium">{formattedStartTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>End Time:</span>
                          <span className="font-medium">{formattedEndTime}</span>
                        </div>
                      </div>
                  
                      {item.current_bidder && (
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <span>Current Bidder:</span>
                          <span className="ml-2 font-medium">{item.current_bidder}</span>
                        </div>
                      )}
                  
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <Link
                          to={`/item/${item._id}`}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7-.002.026-.007.075l-.03.105a11.95 11.95 0 01-.41 1.566A11.95 11.95 0 0112 19c-4.478 0-8.268-2.943-9.542-7a11.95 11.95 0 01-.41-1.566l-.03-.105C2.46 12.05 2.458 12.026 2.458 12z"
                            />
                          </svg>
                          View Details
                        </Link>
                  
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-red-500"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  )
                })}
              </div>

              {items.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new item.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddItem}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      Add Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
