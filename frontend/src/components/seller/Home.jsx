"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AddItem from "./AddItem"
import axios from "axios"
import Cookies from "js-cookie"

export default function SellerHome() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddItemForm, setShowAddItemForm] = useState(false)
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
      const validItems = response.data.seller.items.filter((item) => {
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
  const renderPriceChart = () => {
    return (
      <div className="h-64 w-full flex items-end space-x-2 mt-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex w-full space-x-1">
              <div
                className="bg-indigo-200 rounded-t-md flex-1"
                style={{ height: `${(Number.parseInt(item.base_price) / analytics.averagePrice) * 100}px` }}
              ></div>
              <div
                className="bg-violet-500 rounded-t-md flex-1"
                style={{ height: `${(Number.parseInt(item.current_price) / analytics.averagePrice) * 100}px` }}
              ></div>
            </div>
            <div className="text-xs mt-1 truncate w-full text-center">{item.name}</div>
          </div>
        ))}
      </div>
    )
  }

  // Function to render the bid activity chart
  const renderBidActivityChart = () => {
    return (
      <div className="h-64 w-full flex items-end space-x-2 mt-4">
        {items.map((item, index) => {
          const bidCount = item.auction_history ? item.auction_history.length : 0
          const maxBids = Math.max(...items.map((i) => (i.auction_history ? i.auction_history.length : 0)))
          const height = maxBids > 0 ? (bidCount / maxBids) * 150 : 0

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="bg-violet-400 rounded-t-md w-full" style={{ height: `${height}px` }}></div>
              <div className="text-xs mt-1 truncate w-full text-center">{item.name}</div>
            </div>
          )
        })}
      </div>
    )
  }

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
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
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
              Add New Item
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
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
                  fetchdata={fetchSellerData}
                  onAdd={handleNewItem}
                />
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
                  {renderPriceChart()}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Bid Activity</h3>
                  <p className="text-sm text-gray-500 mb-4">Number of bids per item</p>
                  {renderBidActivityChart()}
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
                      {items
                        .flatMap((item) =>
                          (item.auction_history || []).map((bid, bidIndex) => (
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
                        .slice(0, 5)}

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
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col"
                    >
                      <div className="relative h-48">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-violet-500 text-white text-xs font-medium rounded">
                            Live Auction
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{item.type}</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Base Price</p>
                            <p className="text-sm font-medium">₹{Number.parseInt(item.base_price).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Current Price</p>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">
                                ₹{Number.parseInt(item.current_price).toLocaleString()}
                              </p>
                              {priceIncrease > 0 && (
                                <span className="ml-1 text-xs text-blue-600">+{priceIncrease}%</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bids</p>
                            <p className="text-sm font-medium">{bidCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Visits</p>
                            <p className="text-sm font-medium">{visitCount}</p>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                          <div className="flex justify-between mb-1">
                            <span>Auction Date:</span>
                            <span className="font-medium">{formattedDate}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Start Time:</span>
                            <span className="font-medium">{formattedStartTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>End Time:</span>
                            <span className="font-medium">{formattedEndTime}</span>
                          </div>
                        </div>

                        {item.current_bidder && (
                          <div className="mt-3 flex items-center">
                            <span className="text-xs text-gray-500">Current Bidder:</span>
                            <span className="ml-2 text-xs font-medium">{item.current_bidder}</span>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Link
                            to={`/item/${item._id}`}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Sell Item
                          </Link>
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
