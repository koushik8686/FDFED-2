"use client"

import { useState, useCallback , useEffect} from "react"
import Cookies from "js-cookie"
import SubscriptionModal from "./subscriptionModal"

const AddItem = ({ onClose, onAdd, sellerdata }) => {
  const seller = Cookies.get("seller")
  const [image, setImage] = useState(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    basePrice: 0,
    type: "",
    date: "",
    StartTime: "",
    EndTime: "",
  })

  useEffect(() => {
    if (sellerdata.subscription === "free" && sellerdata.items.length + sellerdata.solditems.length >= 3) {
      setShowSubscriptionModal(true)
    }
    if (sellerdata.subscription === "standard" && sellerdata.items.length  + sellerdata.solditems.length>= 10) {
      setShowSubscriptionModal(true)
    }
  }, [sellerdata])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      setNewItem((prev) => ({
        ...prev,
        image: file,
      }))
      setImage(URL.createObjectURL(file))
    }
  }, [])

  const handleSubscribe = async (plan) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/seller/${seller}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })
      const data = await response.json()
      setShowSubscriptionModal(false)
    } catch (error) {
      console.error("Error updating subscription:", error)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
      setLoading(true)

    try {
      const formData = new FormData()
      Object.keys(newItem).forEach((key) => {
        formData.append(key, newItem[key])
      })

      const result = await fetch(`${process.env.REACT_APP_BACKENDURL}/create/${seller}`, {
        method: "POST",
        body: formData,
      })

      setNewItem({
        name: "",
        basePrice: 0,
        type: "",
        date: "",
        StartTime: "",
        EndTime: "",
      })
      setImage(null)
      onClose()
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-center mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (showSubscriptionModal) {
    return <SubscriptionModal onClose={onClose} onSubscribe={handleSubscribe} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="space-y-4">
          <div className="text-lg font-bold text-gray-800">Add New Item</div>
          <div className="text-sm text-gray-600">Fill out the details for the new item you want to add.</div>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Enter item name"
              value={newItem.name}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              id="image"
              name="image"
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 max-w-xs rounded"
              />
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
              Base Price
            </label>
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              placeholder="Enter base price"
              value={newItem.basePrice}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={newItem.type}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select item type
              </option>
              <option value="Art">Art</option>
              <option value="Antique">Antique</option>
              <option value="Used">Used</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={newItem.date}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2 w-1/2">
              <label htmlFor="StartTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                id="StartTime"
                name="StartTime"
                type="time"
                value={newItem.StartTime}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2 w-1/2">
              <label htmlFor="EndTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                id="EndTime"
                name="EndTime"
                type="time"
                value={newItem.EndTime}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
              Add Item
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddItem
