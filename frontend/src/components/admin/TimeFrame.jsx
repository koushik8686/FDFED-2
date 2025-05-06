"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AdminNav from "./AdminNav"

const TimeFrameDashboard = () => {
  const [data, setData] = useState({ users: [], sellers: [], items: [] })
  const [loading, setLoading] = useState(true)
  const [groupedData, setGroupedData] = useState({ users: {}, sellers: {}, items: {} })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedDates, setExpandedDates] = useState({})
  const [groupingType, setGroupingType] = useState("date") // Added state for grouping type

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/admin/home`)
        const result = await response.json()
        setData(result.data)
        groupData(result.data, groupingType) // Pass groupingType
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Check for admin cookie
    const checkAuth = () => {
      const adminCookie = document.cookie.split(";").find((c) => c.trim().startsWith("admin="))
      if (!adminCookie) {
        // Redirect to login
        window.location.href = "/admin/login"
      }
    }

    checkAuth()
    fetchData()

  }, [])

  // Effect to re-group data when groupingType or data changes
  useEffect(() => {
    if (data.users.length > 0 || data.sellers.length > 0 || data.items.length > 0) {
      groupData(data, groupingType)
    }
  }, [data, groupingType]) // Add groupingType to dependencies


  const getWeekKey = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); // Set to Thursday of the current week
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `Week ${weekNumber}, ${d.getFullYear()}`;
  }

  const getMonthKey = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const groupData = (dataToGroup, type) => { // Renamed and added type parameter

    const usersByTimeFrame = dataToGroup.users.reduce((grouped, user) => {
      let key;
      if (type === "date") {
        key = formatDate(user.createdAt);
      } else if (type === "week") {
        key = getWeekKey(user.createdAt);
      } else { // month
        key = getMonthKey(user.createdAt);
      }
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(user)
      return grouped
    }, {})


    const sellersByTimeFrame = dataToGroup.sellers.reduce((grouped, seller) => {
      let key;
      if (type === "date") {
        key = formatDate(seller.createdAt);
      } else if (type === "week") {
        key = getWeekKey(seller.createdAt);
      } else { // month
        key = getMonthKey(seller.createdAt);
      }
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(seller)
      return grouped
    }, {})


    const itemsByTimeFrame = dataToGroup.items.reduce((grouped, item) => {
      let key;
      if (type === "date") {
        key = formatDate(item.createdAt);
      } else if (type === "week") {
        key = getWeekKey(item.createdAt);
      } else { // month
        key = getMonthKey(item.createdAt);
      }
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(item)
      return grouped
    }, {})

    setGroupedData({ users: usersByTimeFrame, sellers: sellersByTimeFrame, items: itemsByTimeFrame })

    // Initialize all dates as expanded
    const initialExpandedState = {}
    Object.keys(usersByTimeFrame).forEach((key) => {
      initialExpandedState[`users-${key}`] = true
    })
    Object.keys(sellersByTimeFrame).forEach((key) => {
      initialExpandedState[`sellers-${key}`] = true
    })
    Object.keys(itemsByTimeFrame).forEach((key) => {
      initialExpandedState[`items-${key}`] = true
    })
    setExpandedDates(initialExpandedState)
  }

  const toggleDateExpansion = (section, date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [`${section}-${date}`]: !prev[`${section}-${date}`],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-margin duration-300 ease-in-out`}>
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-8 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Time Frame Analysis</h1>
                    <p className="text-white/80 mt-2">View users, sellers, and items grouped by registration {groupingType}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setGroupingType("date")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          groupingType === "date"
                            ? "bg-white text-purple-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Day
                      </button>
                      <button
                        onClick={() => setGroupingType("week")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          groupingType === "week"
                            ? "bg-white text-purple-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setGroupingType("month")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          groupingType === "month"
                            ? "bg-white text-purple-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Month
                      </button>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        {Object.keys(groupedData.users).length +
                          Object.keys(groupedData.sellers).length +
                          Object.keys(groupedData.items).length}{" "}
                        Date Groups
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users by Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Users by Date</h2>
              {Object.keys(groupedData.users).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <p className="text-gray-500">No user data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedData.users).map((date) => (
                    <motion.div
                      key={`users-${date}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div
                        className="px-6 py-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleDateExpansion("users", date)}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
                          <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {groupedData.users[date].length} users
                          </span>
                        </div>
                        {expandedDates[`users-${date}`] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <AnimatePresence>
                        {expandedDates[`users-${date}`] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Username
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Email
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Items
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {groupedData.users[date].map((user, index) => (
                                    <motion.tr
                                      key={user._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: index * 0.05 }}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500">ID: {user._id}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.items?.length || 0}
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sellers by Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Sellers by Date</h2>
              {Object.keys(groupedData.sellers).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <p className="text-gray-500">No seller data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedData.sellers).map((date) => (
                    <motion.div
                      key={`sellers-${date}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div
                        className="px-6 py-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleDateExpansion("sellers", date)}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
                          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {groupedData.sellers[date].length} sellers
                          </span>
                        </div>
                        {expandedDates[`sellers-${date}`] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <AnimatePresence>
                        {expandedDates[`sellers-${date}`] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Email
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Phone
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Items
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {groupedData.sellers[date].map((seller, index) => (
                                    <motion.tr
                                      key={seller._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: index * 0.05 }}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {seller.name ? seller.name.charAt(0).toUpperCase() : "?"}
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                                            <div className="text-sm text-gray-500">ID: {seller._id}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{seller.email}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{seller.phone || "N/A"}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {seller.items?.length || 0}
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Items by Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Items by Date</h2>
              {Object.keys(groupedData.items).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <p className="text-gray-500">No item data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedData.items).map((date) => (
                    <motion.div
                      key={`items-${date}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div
                        className="px-6 py-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleDateExpansion("items", date)}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {groupedData.items[date].length} items
                          </span>
                        </div>
                        {expandedDates[`items-${date}`] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <AnimatePresence>
                        {expandedDates[`items-${date}`] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Seller
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Base Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Current Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Image
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {groupedData.items[date].map((item, index) => (
                                    <motion.tr
                                      key={item._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: index * 0.05 }}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">ID: {item._id}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.person}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                          }).format(item.base_price)}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-green-600">
                                          {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                          }).format(item.current_price)}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                          src={item.url || "/placeholder.svg"}
                                          alt={item.name}
                                          className="h-12 w-12 object-cover rounded-md border border-gray-200"
                                        />
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeFrameDashboard
