"use client"

import { useState, useEffect } from "react"
import { Users, Crown, Star, Package, Search, ChevronDown, Filter, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import AdminNav from "./AdminNav"
import { UserPlus } from "lucide-react"
const SellersBySubscription = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newseller, setnewseller] = useState({ name: "", email: "", password: "", phone: "" })
  const [editingSeller, setEditingSeller] = useState(null)
  const [isEditSellerModalOpen, setIsEditSellerModalOpen] = useState(false)

  const handleAddSeller = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/sellerregister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newseller),
      })

      const data = await response.json()
      setSellers([...sellers, data])
      setnewseller({ name: "", email: "", password: "", phone: "" })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const handleOpenEditSellerModal = (seller) => {
    setEditingSeller({ ...seller })
    setIsEditSellerModalOpen(true)
  }

  const handleCloseEditSellerModal = () => {
    setEditingSeller(null)
    setIsEditSellerModalOpen(false)
  }

  const handleSaveSellerEdit = async () => {
    if (!editingSeller) return
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/seller/edit/${editingSeller._id}`, {
        method: "POST", // or PUT, depending on your backend API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingSeller.name, email: editingSeller.email, phone: editingSeller.phone }), // Send only necessary fields
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedSeller = await response.json()
      setSellers(sellers.map((s) => (s._id === updatedSeller._id ? updatedSeller : s)))
      handleCloseEditSellerModal()
    } catch (error) {
      console.error("Error updating seller:", error)
    }
  }

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/seller/delete/${sellerId}`, {
          method: "GET", // or DELETE, depending on your backend API
        })
        if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
        }
        setSellers(sellers.filter((s) => s._id !== sellerId))
      } catch (error) {
        console.error("Error deleting seller:", error)
      }
    }
  }

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/admin/home`)
        const data = await response.json()
        setSellers(data.data.sellers)
      } catch (error) {
        console.error("Error fetching sellers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [])

  const getFilteredSellers = () => {
    let filtered = [...sellers]

    // Filter by subscription type if not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter((seller) => seller.subscription === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (seller) =>
          seller.name?.toLowerCase().includes(term) ||
          seller.email?.toLowerCase().includes(term) ||
          seller.phone?.includes(term),
      )
    }

    // Sort the results
    filtered.sort((a, b) => {
      let valueA, valueB

      // Determine which field to sort by
      switch (sortBy) {
        case "name":
          valueA = a.name || ""
          valueB = b.name || ""
          break
        case "email":
          valueA = a.email || ""
          valueB = b.email || ""
          break
        case "items":
          valueA = a.items?.length || 0
          valueB = b.items?.length || 0
          break
        case "date":
          valueA = new Date(a.createdAt || 0).getTime()
          valueB = new Date(b.createdAt || 0).getTime()
          break
        default:
          valueA = a.name || ""
          valueB = b.name || ""
      }

      // Apply sort order
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return filtered
  }

  const filteredSellers = getFilteredSellers()

  const subscriptionCounts = {
    all: sellers.length,
    free: sellers.filter((seller) => seller.subscription === "free").length,
    standard: sellers.filter((seller) => seller.subscription === "standard").length,
    premium: sellers.filter((seller) => seller.subscription === "premium").length,
  }

  const getSubscriptionIcon = (type) => {
    switch (type) {
      case "free":
        return <Package className="h-5 w-5 text-gray-500" />
      case "standard":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "premium":
        return <Crown className="h-5 w-5 text-purple-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getSubscriptionBadge = (type) => {
    switch (type) {
      case "free":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Free
          </span>
        )
      case "standard":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Standard
          </span>
        )
      case "premium":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Premium
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Free
          </span>
        )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading sellers data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
     <AdminNav/>
      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-lg hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Your existing content */}
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Seller Management</h1>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="font-medium">{sellers.length} Total Sellers</span>
                    </div>
                  </div>
                   <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="bg-white text-purple-600 hover:bg-purple-50 rounded-lg px-3 py-2 flex items-center font-medium"
                                      >
                                        <UserPlus className="h-5 w-5 mr-2" />
                                        Add Seller
                                      </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center ${
                      activeTab === "all"
                        ? "border-b-2 border-purple-500 text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    All Sellers
                    <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {subscriptionCounts.all}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("free")}
                    className={`px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center ${
                      activeTab === "free"
                        ? "border-b-2 border-purple-500 text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Free
                    <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {subscriptionCounts.free}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("standard")}
                    className={`px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center ${
                      activeTab === "standard"
                        ? "border-b-2 border-purple-500 text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Standard
                    <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                      {subscriptionCounts.standard}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("premium")}
                    className={`px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center ${
                      activeTab === "premium"
                        ? "border-b-2 border-purple-500 text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Premium
                    <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                      {subscriptionCounts.premium}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, email or phone..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter & Sort
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {isFilterOpen && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        id="sortBy"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="items">Number of Items</option>
                        <option value="date">Registration Date</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <select
                        id="sortOrder"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Sellers List */}
              <div className="overflow-x-auto">
                {filteredSellers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <Users className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sellers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "No sellers match the current filter criteria."}
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            Seller
                            <button
                              onClick={() => {
                                setSortBy("name")
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                              }}
                              className="ml-1 text-gray-400 hover:text-gray-500"
                            >
                              <ArrowUpDown className="h-4 w-4" />
                            </button>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            Items
                            <button
                              onClick={() => {
                                setSortBy("items")
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                              }}
                              className="ml-1 text-gray-400 hover:text-gray-500"
                            >
                              <ArrowUpDown className="h-4 w-4" />
                            </button>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            Joined
                            <button
                              onClick={() => {
                                setSortBy("date")
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                              }}
                              className="ml-1 text-gray-400 hover:text-gray-500"
                            >
                              <ArrowUpDown className="h-4 w-4" />
                            </button>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subscription
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSellers.map((seller) => (
                        <tr key={seller._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                {seller.name ? seller.name.charAt(0).toUpperCase() : "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{seller.name || "Unnamed Seller"}</div>
                                <div className="text-sm text-gray-500">ID: {seller._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{seller.email}</div>
                            <div className="text-sm text-gray-500">{seller.phone || "No phone"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-4">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">{seller.items?.length || 0}</span> Active
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">{seller.solditems?.length || 0}</span> Sold
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(seller.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getSubscriptionIcon(seller.subscription)}
                              <div className="ml-2">{getSubscriptionBadge(seller.subscription)}</div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleOpenEditSellerModal(seller)}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSeller(seller._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination placeholder - could be implemented with actual pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">{filteredSellers.length}</span> of{" "}
                      <span className="font-medium">{filteredSellers.length}</span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Free Plan</h3>
                      <p className="text-gray-500 text-sm">Basic features, up to 3 items</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{subscriptionCounts.free}</p>
                      <p className="ml-2 text-sm text-gray-500">sellers</p>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-gray-400 rounded-full"
                        style={{
                          width: `${(subscriptionCounts.free / sellers.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Standard Plan</h3>
                      <p className="text-gray-500 text-sm">Enhanced features, up to 10 items</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{subscriptionCounts.standard}</p>
                      <p className="ml-2 text-sm text-gray-500">sellers</p>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{
                          width: `${(subscriptionCounts.standard / sellers.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                      <Crown className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Premium Plan</h3>
                      <p className="text-gray-500 text-sm">All features, unlimited items</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{subscriptionCounts.premium}</p>
                      <p className="ml-2 text-sm text-gray-500">sellers</p>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-purple-400 rounded-full"
                        style={{
                          width: `${(subscriptionCounts.premium / sellers.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Seller Modal (existing) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Seller</h2> {/* Corrected Title */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newseller.name}
                  onChange={(e) => setnewseller({ ...newseller, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newseller.email}
                  onChange={(e) => setnewseller({ ...newseller, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newseller.password}
                  onChange={(e) => setnewseller({ ...newseller, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newseller.phone}
                  onChange={(e) => setnewseller({ ...newseller, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSeller}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Seller Modal */}
      {isEditSellerModalOpen && editingSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Seller</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingSeller.name}
                  onChange={(e) => setEditingSeller({ ...editingSeller, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingSeller.email}
                  onChange={(e) => setEditingSeller({ ...editingSeller, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingSeller.phone || ''}
                  onChange={(e) => setEditingSeller({ ...editingSeller, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCloseEditSellerModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSellerEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellersBySubscription
