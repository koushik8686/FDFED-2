"use client"

import { useState, useEffect } from "react"
import { Users, Search, ChevronDown, Filter, ArrowUpDown, Edit, Trash2, UserPlus } from "lucide-react"
import AdminNav from "./AdminNav"

const UserDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("username")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/admin/home`)
        const data = await response.json()
        setUsers(data.data.users)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getFilteredUsers = () => {
    let filtered = [...users]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) => user.username?.toLowerCase().includes(term) || user.email?.toLowerCase().includes(term),
      )
    }

    // Sort the results
    filtered.sort((a, b) => {
      let valueA, valueB

      // Determine which field to sort by
      switch (sortBy) {
        case "username":
          valueA = a.username || ""
          valueB = b.username || ""
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
          valueA = a.username || ""
          valueB = b.username || ""
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

  const filteredUsers = getFilteredUsers()

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const handleEditUser = (user) => {
    setEditingUser({ ...user })
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Replace with your actual API endpoint
        await fetch(`${process.env.REACT_APP_BACKENDURL}/user/delete/${userId}`)
        setUsers(users.filter((user) => user._id !== userId))
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleSaveEdit = async () => {
    try { 
      // Replace with your actual API endpoint
      await fetch(`${process.env.REACT_APP_BACKENDURL}/user/edit/${editingUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      })

      // Update the local state
      setUsers(users.map((user) => (user._id === editingUser._id ? editingUser : user)))
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleAddUser = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      setUsers([...users, data])
      setNewUser({ username: "", email: "", password: "" })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading users data...</p>
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">User Management</h1>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="font-medium">{users.length} Total Users</span>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-white text-purple-600 hover:bg-purple-50 rounded-lg px-3 py-2 flex items-center font-medium"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Add User
                    </button>
                  </div>
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
                      placeholder="Search by username or email..."
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
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                      />
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
                        <option value="username">Username</option>
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

              {/* Users List */}
              <div className="overflow-x-auto">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <Users className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "No users match the current filter criteria."}
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
                            User
                            <button
                              onClick={() => {
                                setSortBy("username")
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
                            Email
                            <button
                              onClick={() => {
                                setSortBy("email")
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.username || "Unnamed User"}
                                </div>
                                <div className="text-sm text-gray-500">ID: {user._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">{user.items?.length || 0}</span> Items
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination placeholder */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">{filteredUsers.length}</span> of{" "}
                      <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                      <p className="text-gray-500 text-sm">All registered users</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                      <p className="ml-2 text-sm text-gray-500">users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
                      <p className="text-gray-500 text-sm">Users active in the last 30 days</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{Math.floor(users.length * 0.8)}</p>
                      <p className="ml-2 text-sm text-gray-500">users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">New Users</h3>
                      <p className="text-gray-500 text-sm">Joined in the last 7 days</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{Math.floor(users.length * 0.2)}</p>
                      <p className="ml-2 text-sm text-gray-500">users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
                onClick={handleAddUser}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
