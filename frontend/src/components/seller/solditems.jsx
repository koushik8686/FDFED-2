import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

export default function SellerSoldItems() {
  const navigate = useNavigate()
  const [soldItems, setSoldItems] = useState([])
  const [unsoldItems, setUnsoldItems] = useState([])
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const sellerid = Cookies.get("seller")

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalSold: 0,
    totalUnsold: 0,
    totalRevenue: 0,
    averageSoldPrice: 0,
    successRate: 0,
    timeSeriesData: [], // Will hold hourly/daily/weekly/monthly data
    categoryData: [], // For pie chart
  })

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        if (!sellerid) {
          return navigate("/seller")
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/sellerhome/${sellerid}`)
        setSeller(response.data.seller)

        const soldItems = response.data.seller.solditems || []
        const unsoldItems = response.data.items.filter((item) => item.aution_active === false)
       
        setSoldItems(soldItems)
        setUnsoldItems(unsoldItems)
        calculateAnalytics(soldItems, unsoldItems)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSoldItems()
  }, [sellerid, navigate])

  const logout = () => {
    Cookies.remove("seller")
    navigate("/")
  }

  const calculateAnalytics = (sold, unsold) => {
    const totalSold = sold.length
    const totalUnsold = unsold.length
    const totalRevenue = sold.reduce((sum, item) => sum + Number(item.current_price || 0), 0)
    const averageSoldPrice = totalSold > 0 ? totalRevenue / totalSold : 0
    const successRate = totalSold + totalUnsold > 0 ? (totalSold / (totalSold + totalUnsold)) * 100 : 0

    // Process data based on current time filter
    const { timeSeriesData, categoryData } = processChartData(sold, timeFilter)
 
    setAnalytics({
      totalSold,
      totalUnsold,
      totalRevenue,
      averageSoldPrice,
      successRate,
      timeSeriesData,
      categoryData,
    })
  }

  // Process data for charts based on time filter
  const processChartData = (soldItems, filter) => {
    const now = new Date()
    let timeSeriesData = []
    let categoryData = []

    // Process category data (same for all time filters)
    const categoryMap = {}
    soldItems.forEach(item => {
      const category = item.type || "Other"
      if (!categoryMap[category]) {
        categoryMap[category] = { name: category, value: 0, revenue: 0 }
      }
      categoryMap[category].value += 1
      categoryMap[category].revenue += Number(item.current_price || 0)
    })
    categoryData = Object.values(categoryMap)

    // Process time series data based on filter
    switch (filter) {
      case "day":
        // Hourly data for last 24 hours
        timeSeriesData = Array(24).fill().map((_, i) => {
          const hour = new Date(now)
          hour.setHours(now.getHours() - 23 + i)
          return {
            name: hour.getHours().toString().padStart(2, '0') + ':00',
            sales: 0,
            revenue: 0
          }
        })
        
        soldItems.forEach(item => {
          const soldDate = new Date(item.soldDate || item.updatedAt)
          const hourDiff = Math.floor((now - soldDate) / (1000 * 60 * 60))
          if (hourDiff >= 0 && hourDiff < 24) {
            const idx = 23 - hourDiff
            timeSeriesData[idx].sales += 1
            timeSeriesData[idx].revenue += Number(item.current_price || 0)
          }
        })
        break

      case "week":
        // Daily data for last 7 days
        timeSeriesData = Array(7).fill().map((_, i) => {
          const date = new Date(now)
          date.setDate(now.getDate() - 6 + i)
          return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            sales: 0,
            revenue: 0
          }
        })
        
        soldItems.forEach(item => {
          const soldDate = new Date(item.soldDate || item.updatedAt)
          const dayDiff = Math.floor((now - soldDate) / (1000 * 60 * 60 * 24))
          if (dayDiff >= 0 && dayDiff < 7) {
            const idx = 6 - dayDiff
            timeSeriesData[idx].sales += 1
            timeSeriesData[idx].revenue += Number(item.current_price || 0)
          }
        })
        break

      case "month":
        // Weekly data for last 4 weeks
        timeSeriesData = Array(4).fill().map((_, i) => {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - (7 * (3 - i)))
          return {
            name: `Week ${i + 1}`,
            sales: 0,
            revenue: 0
          }
        })
        
        soldItems.forEach(item => {
          const soldDate = new Date(item.soldDate || item.updatedAt)
          const weekDiff = Math.floor((now - soldDate) / (1000 * 60 * 60 * 24 * 7))
          if (weekDiff >= 0 && weekDiff < 4) {
            const idx = 3 - weekDiff
            timeSeriesData[idx].sales += 1
            timeSeriesData[idx].revenue += Number(item.current_price || 0)
          }
        })
        break

      case "year":
        // Monthly data for last 12 months
        timeSeriesData = Array(12).fill().map((_, i) => {
          const month = new Date(now)
          month.setMonth(now.getMonth() - 11 + i)
          return {
            name: month.toLocaleDateString('en-US', { month: 'short' }),
            sales: 0,
            revenue: 0
          }
        })
        
        soldItems.forEach(item => {
          const soldDate = new Date(item.soldDate || item.updatedAt)
          const monthDiff = (now.getFullYear() - soldDate.getFullYear()) * 12 + now.getMonth() - soldDate.getMonth()
          if (monthDiff >= 0 && monthDiff < 12) {
            const idx = 11 - monthDiff
            timeSeriesData[idx].sales += 1
            timeSeriesData[idx].revenue += Number(item.current_price || 0)
          }
        })
        break

      default:
        // All time - monthly data
        timeSeriesData = Array(12).fill().map((_, i) => ({
          name: new Date(0, i).toLocaleDateString('en-US', { month: 'short' }),
          sales: 0,
          revenue: 0
        }))
        
        soldItems.forEach(item => {
          const soldDate = new Date(item.soldDate || item.updatedAt)
          const month = soldDate.getMonth()
          timeSeriesData[month].sales += 1
          timeSeriesData[month].revenue += Number(item.current_price || 0)
        })
    }

    return { timeSeriesData, categoryData }
  }

  // Update charts when time filter changes
  useEffect(() => {
    if (soldItems.length > 0) {
      const { timeSeriesData, categoryData } = processChartData(soldItems, timeFilter)
      setAnalytics(prev => ({
        ...prev,
        timeSeriesData,
        categoryData
      }))
    }
  }, [timeFilter])

  useEffect(() => {
    if (soldItems.length > 0 || unsoldItems.length > 0) {
      const filteredSold = filterItemsByTime(soldItems, timeFilter)
      const filteredUnsold = filterItemsByTime(unsoldItems, timeFilter)
      calculateAnalytics(filteredSold, filteredUnsold) // Recalculate analytics for filtered items
    }
  }, [timeFilter, soldItems, unsoldItems])

  const filterItemsByTime = (items, filter) => {
    if (filter === "all") return items

    const now = new Date()
    const filterDate = new Date()

    switch (filter) {
      case "day":
        filterDate.setDate(now.getDate() - 1)
        break
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return items
    }

    return items.filter((item) => {
      const itemDate = new Date(item.updatedAt)
      return itemDate >= filterDate && itemDate <= now
    })
  }

  // Function to render the monthly sales chart
  const renderTimeSeriesChart = () => {
    let chartTitle = ""
    switch (timeFilter) {
      case "day": chartTitle = "Hourly Sales (Last 24 Hours)"; break
      case "week": chartTitle = "Daily Sales (Last 7 Days)"; break
      case "month": chartTitle = "Weekly Sales (Last 4 Weeks)"; break
      case "year": chartTitle = "Monthly Sales (Last 12 Months)"; break
      default: chartTitle = "Monthly Sales (All Time)"
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-2">{chartTitle}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics.timeSeriesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sales"
                name="Items Sold"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  // Render category distribution chart
  const renderCategoryChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">Category Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={analytics.categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {analytics.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                value, 
                `${name} (₹${props.payload.revenue.toLocaleString()})`
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  // Render revenue vs items sold chart
  const renderRevenueVsItemsChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">Revenue vs Items Sold</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analytics.timeSeriesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" name="Items Sold" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-4 rounded-full bg-blue-100">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const filteredSoldItems = filterItemsByTime(soldItems, timeFilter)
  const filteredUnsoldItems = filterItemsByTime(unsoldItems, timeFilter)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out bg-indigo-900 text-white shadow-lg`}
      >
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-xl font-bold">Auction Dashboard</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {seller.subscription === "free" ? "Free Plan" : "Premium Plan"}
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {seller.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-xs text-indigo-200">{seller.email}</p>
            </div>
          </div>
        </div>

        <nav className="mt-2">
          <Link to="/sellerhome" className="flex items-center w-full px-6 py-3 text-left hover:bg-indigo-800">
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
          </Link>

          <Link to="/sellerhome" className="flex items-center w-full px-6 py-3 text-left hover:bg-indigo-800">
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
          </Link>

          <Link to="/seller/solditems" className="flex items-center w-full px-6 py-3 bg-indigo-700 text-left">
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

          <Link to="/sellerhome" className="flex items-center w-full px-6 py-3 hover:bg-indigo-800">
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
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-800">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-indigo-200 hover:text-white">
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
              <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "all"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "sold"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Sold Items
              </button>
              <button
                onClick={() => setActiveTab("unsold")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "unsold"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Unsold Items
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "all" && (
            <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Sold Items</p>
                      <p className="text-2xl font-semibold">{analytics.totalSold}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
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
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Unsold Items</p>
                      <p className="text-2xl font-semibold">{analytics.totalUnsold}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
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
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold">₹{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600">
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="text-2xl font-semibold">{analytics.successRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderTimeSeriesChart()}
                {renderCategoryChart()}
              </div>
              <div className="grid grid-cols-1">
                {renderRevenueVsItemsChart()}
              </div>

        
            </div>
          )}

          {activeTab === "sold" && (
            <div className="space-y-6">
              {filteredSoldItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sold items in this time period</h3>
                  <p className="mt-1 text-sm text-gray-500">Try changing the time filter or check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSoldItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-48">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                          Sold
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{item.type}</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Base Price</p>
                            <p className="text-sm font-medium">₹{item.base_price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Sold Price</p>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">₹{Number(item.current_price).toLocaleString()}</p>
                              {Number(item.current_price) > item.base_price && (
                                <span className="ml-1 text-xs text-green-600">
                                  +
                                  {Math.round(((Number(item.current_price) - item.base_price) / item.base_price) * 100)}
                                  %
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                          <div className="flex justify-between mb-1">
                            <span>Sold Date:</span>
                            <span className="font-medium">
                              {new Date(item.soldDate || item.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Buyer:</span>
                            <span className="font-medium">{item.current_bidder || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "unsold" && (
            <div className="space-y-6">
              {filteredUnsoldItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No unsold items in this time period</h3>
                  <p className="mt-1 text-sm text-gray-500">Try changing the time filter or check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUnsoldItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-48">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                          Unsold
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{item.type}</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Base Price</p>
                            <p className="text-sm font-medium">₹{item.base_price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Final Price</p>
                            <p className="text-sm font-medium">₹{Number(item.current_price).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                          <div className="flex justify-between mb-1">
                            <span>Auction Date:</span>
                            <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>End Time:</span>
                            <span className="font-medium">
                              {new Date(item.EndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                     
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
