"use client"

import { useState, useEffect } from "react"
import { Package, Search, ChevronDown, Filter, ArrowUpDown, Edit, Trash2, PlusCircle } from "lucide-react"
import AdminNav from "./AdminNav"
import Cookies from "js-cookie"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const ItemForm = ({ item, onSave, onClose, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    base_price: item?.base_price || 0,
    type: item?.type || "Art",
    description: item?.description || "",
    date: item?.date ? new Date(item.date).toISOString().split('T')[0] : "",
    StartTime: item?.StartTime ? new Date(item.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "12:00",
    EndTime: item?.EndTime ? new Date(item.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "23:59",
  });
  
  const [imagePreview, setImagePreview] = useState(item?.url || null);
  const [imageFile, setImageFile] = useState(null);
  const [sellerId, setSellerId] = useState(item?.seller || "");
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // Fetch sellers for the dropdown
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/sellers`);
        setSellers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    
    // Append all form data
    Object.keys(formData).forEach(key => {
      updatedData.append(key, formData[key]);
    });
    
    if (imageFile) {
      updatedData.append('image', imageFile);
    }
    
    if (sellerId) {
      updatedData.append('seller', sellerId);
    }
    
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="popup-form space-y-4 p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {mode === 'add' ? 'Add New Item' : 'Edit Item'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)*</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleInputChange}
            className="form-input w-full"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          >
            <option value="Art">Art</option>
            <option value="Antique">Antique</option>
            <option value="Collectible">Collectible</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seller*</label>
          <select
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            className="form-input w-full"
            required
          >
            <option value="">Select Seller</option>
            {sellers.map(seller => (
              <option key={seller._id} value={seller._id}>
                {seller.name} ({seller.email})
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input w-full"
            rows="3"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auction Date*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
          <input
            type="time"
            name="StartTime"
            value={formData.StartTime}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
          <input
            type="time"
            name="EndTime"
            value={formData.EndTime}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Image*</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required={mode === 'add'}
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-40 object-contain rounded border border-gray-200" 
              />
              <p className="text-xs text-gray-500 mt-1">Image Preview</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
        >
          {mode === 'add' ? 'Add Item' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
const ItemsDashboard = () => {
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    person: "",
    base_price: "",
    current_price: "",
    description: "",
    url: "",
  })

  useEffect(() => {
    const admin = Cookies.get("admin")
    if (!admin) {
      navigate("/admin/login")
    }
    const fetchItems = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/admin/home`)
        const data = await response.json()
        setItems(data.data.items)
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const getFilteredItems = () => {
    let filtered = [...items]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.person?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term),
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
        case "person":
          valueA = a.person || ""
          valueB = b.person || ""
          break
        case "base_price":
          valueA = Number.parseFloat(a.base_price) || 0
          valueB = Number.parseFloat(b.base_price) || 0
          break
        case "current_price":
          valueA = Number.parseFloat(a.current_price) || 0
          valueB = Number.parseFloat(b.current_price) || 0
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

  const filteredItems = getFilteredItems()

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatPrice = (price) => {
    if (!price) return "$0.00"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handleEditItem = (item) => {
    setEditingItem({ ...item })
    setIsEditModalOpen(true)
  }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Replace with your actual API endpoint
        await fetch(`${process.env.REACT_APP_BACKENDURL}/delete/item/${itemId}`)
        setItems(items.filter((item) => item._id !== itemId))
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const handleSaveEdit = async () => {
    try {
      // Replace with your actual API endpoint
      await fetch(`${process.env.REACT_APP_BACKENDURL}/update/item/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingItem),
      })

      // Update the local state
      setItems(items.map((item) => (item._id === editingItem._id ? editingItem : item)))
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const handleAddItem = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/add/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })

      const data = await response.json()
      setItems([...items, data])
      setNewItem({
        name: "",
        person: "",
        base_price: "",
        current_price: "",
        description: "",
        url: "",
      })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading items data...</p>
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Item Management</h1>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      <span className="font-medium">{items.length} Total Items</span>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-white text-purple-600 hover:bg-purple-50 rounded-lg px-3 py-2 flex items-center font-medium"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add Item
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
                      placeholder="Search by name, seller or description..."
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
                        <option value="name">Name</option>
                        <option value="person">Seller</option>
                        <option value="base_price">Base Price</option>
                        <option value="current_price">Current Price</option>
                        <option value="date">Date Added</option>
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
  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
                      <p className="text-gray-500 text-sm">All active items</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">{filteredItems.length}</p>
                      <p className="ml-2 text-sm text-gray-500">items</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Average Price</h3>
                      <p className="text-gray-500 text-sm">Current average price</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {formatPrice(
                          filteredItems.reduce((acc, item) => acc + Number.parseFloat(item.current_price || 0), 0) /
                            (filteredItems.length || 1),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Total Value</h3>
                      <p className="text-gray-500 text-sm">Sum of all current prices</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {formatPrice(filteredItems.reduce((acc, item) => acc + Number.parseFloat(item.current_price || 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              {/* Items List */}
              <div className="overflow-x-auto">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <Package className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "No items match the current filter criteria."}
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
                            Item
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
                          <div className="flex items-center">
                            Seller
                            <button
                              onClick={() => {
                                setSortBy("person")
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
                            Base Price
                            <button
                              onClick={() => {
                                setSortBy("base_price")
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
                            Current Price
                            <button
                              onClick={() => {
                                setSortBy("current_price")
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
                          Image
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
                      {filteredItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name || "Unnamed Item"}</div>
                                <div className="text-sm text-gray-500">ID: {item._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.person}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatPrice(item.base_price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-green-600">{formatPrice(item.current_price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={item.url || "/placeholder.svg"}
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item._id)}
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
                      <span className="font-medium">{filteredItems.length}</span> of{" "}
                      <span className="font-medium">{filteredItems.length}</span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Stats Cards */}
          
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                <input
                  type="text"
                  value={editingItem.person}
                  onChange={(e) => setEditingItem({ ...editingItem, person: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <input
                    type="number"
                    value={editingItem.base_price}
                    onChange={(e) => setEditingItem({ ...editingItem, base_price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                  <input
                    type="number"
                    value={editingItem.current_price}
                    onChange={(e) => setEditingItem({ ...editingItem, current_price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
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

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                <input
                  type="text"
                  value={newItem.person}
                  onChange={(e) => setNewItem({ ...newItem, person: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <input
                    type="number"
                    value={newItem.base_price}
                    onChange={(e) => setNewItem({ ...newItem, base_price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                  <input
                    type="number"
                    value={newItem.current_price}
                    onChange={(e) => setNewItem({ ...newItem, current_price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
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
                onClick={handleAddItem}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemsDashboard
