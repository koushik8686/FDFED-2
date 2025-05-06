"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, User, Mail, AlertCircle, Calendar, ThumbsUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AdminNav from "./AdminNav"
import Cookies from "js-cookie"
import { Link, useNavigate } from "react-router-dom"

const ReviewsDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterRating, setFilterRating] = useState(0) // 0 means no filter
  const navigate = useNavigate()
  const admin = Cookies.get("admin")

  useEffect(() => {

    if (!admin) {
      navigate("/admin/login")
    }

    const fetchFeedbacks = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/feedbacks`)
        const feedbackData = await response.json()
        setFeedbacks(feedbackData)

        // Calculate average rating
        if (feedbackData.length > 0) {
          let totalRating = 0
          for (const feedback of feedbackData) {
            totalRating += feedback.Rating
          }
          setAverageRating((totalRating / feedbackData.length).toFixed(1))
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
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
    fetchFeedbacks()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback)
    setIsModalOpen(true)
  }

  const getFilteredFeedbacks = () => {
    if (filterRating === 0) return feedbacks
    return feedbacks.filter((feedback) => feedback.Rating === filterRating)
  }

  const filteredFeedbacks = getFilteredFeedbacks()

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading feedback data...</p>
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Customer Feedback</h1>
                    <p className="text-white/80 mt-2">Review and analyze customer feedback and ratings</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      <span className="font-medium">{feedbacks.length} Total Reviews</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center">
                      <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{averageRating} Average Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Rating Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-purple-600 mb-2">{averageRating}</div>
                        <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                        <p className="text-gray-500">Based on {feedbacks.length} reviews</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = feedbacks.filter((f) => f.Rating === rating).length
                        const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0

                        return (
                          <div key={rating} className="flex items-center">
                            <button
                              onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                              className={`flex items-center space-x-1 min-w-[60px] ${filterRating === rating ? "text-purple-600 font-medium" : "text-gray-600"}`}
                            >
                              <span>{rating}</span>
                              <Star
                                className={`h-4 w-4 ${filterRating === rating ? "fill-purple-600 text-purple-600" : "fill-gray-400 text-gray-400"}`}
                              />
                            </button>
                            <div className="flex-1 mx-3">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.1 }}
                                  className="bg-purple-600 h-2.5 rounded-full"
                                ></motion.div>
                              </div>
                            </div>
                            <div className="text-gray-600 min-w-[50px] text-right">
                              {count} ({percentage.toFixed(0)}%)
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filter Controls */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
              {filterRating > 0 && (
                <button
                  onClick={() => setFilterRating(0)}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  <span>Clear filter</span>
                </button>
              )}
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredFeedbacks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <p className="text-gray-500">No reviews found</p>
                  </motion.div>
                ) : (
                  filteredFeedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                              {feedback.name ? feedback.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{feedback.name}</h3>
                              <div className="flex mt-1">{renderStars(feedback.Rating)}</div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(feedback.CreatedAt)}</span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{feedback.email}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            <span>Issue: {feedback.issue}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{feedback.Feedback}</p>

                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Feedback Details</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {selectedFeedback.name ? selectedFeedback.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedFeedback.name}</h3>
                    <div className="flex mt-1">{renderStars(selectedFeedback.Rating)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-sm font-medium">{selectedFeedback.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm font-medium">{selectedFeedback.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Issue</div>
                      <div className="text-sm font-medium">{selectedFeedback.issue}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm font-medium">{formatDate(selectedFeedback.CreatedAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 whitespace-pre-line">{selectedFeedback.Feedback}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ReviewsDashboard
