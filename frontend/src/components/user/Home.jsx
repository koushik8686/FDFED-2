"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useDispatch, useSelector } from "react-redux"
import { toggleWishlist } from "../../redux/LikedReducer"
import axios from "axios"

export default function UserHome() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [display, setDisplay] = useState("items")
  const [myitems, setMyItems] = useState([])
  const [email, setEmail] = useState("")
  const [showLikedWindow, setShowLikedWindow] = useState(false)
  const [items, setItems] = useState([])
  const [groupBy, setGroupBy] = useState("none") // For MyItems grouping
  const [username , setUsername] = useState("")
  const dataProcessed = useRef(false)

  // Redux and navigation
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const wishlist = useSelector((state) => state.liked)
  const userid = Cookies.get("user")

  // Handlers
  const logout = () => {
    Cookies.remove("user")
    navigate("/")
  }

  const toggleLikedWindow = () => {
    setShowLikedWindow((prev) => !prev)
  }

  const handleAddToWishlist = async (item) => {
    dispatch(toggleWishlist(item))
    if (userid) {
      try {
        if (wishlist.find((wishlistItem) => wishlistItem._id === item._id)) {
          await axios.delete(`${process.env.REACT_APP_BACKENDURL}/liked/${userid}/${item._id}`)
        } else {
          await axios.post(`${process.env.REACT_APP_BACKENDURL}/liked/${userid}/${item._id}`)
        }
      } catch (error) {
        console.error("Error updating wishlist:", error.message)
        alert("Failed to update wishlist. Please try again.")
      }
    } else {
      alert("Please log in to manage your wishlist.")
    }
  }

  // Fetch user data on component mount
  useEffect(() => {
    if (Cookies.get("user") === undefined) {
      navigate("/login")
    }

    const fetchUserData = () => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", `${process.env.REACT_APP_BACKENDURL}/user/${userid}`, true)

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && !dataProcessed.current) {
          dataProcessed.current = true
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            setEmail(data.data.user.email)
            setUsername(data.data.user.username)
            setMyItems(data.data.user.items)
            const currentTime = new Date()
            const validItems = data.data.items.filter((item) => {
              if (!item.EndTime) {
                return true
              }
              const endTime = new Date(item.EndTime)
              if (endTime > currentTime) {
                return true
              } else {
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
            data.data.user.liked.forEach((item) => {
              dispatch(toggleWishlist(item))
            })
          } else {
            console.error("Error fetching user data:", xhr.statusText)
          }
        }
      }

      xhr.onerror = () => {
        console.error("Fetch error:", xhr.statusText)
      }

      xhr.send()
    }

    fetchUserData()
  }, [userid, navigate, dispatch])

  // Filter items based on category and search query
  const filteredItems = items.filter(
    (item) =>
      (selectedCategory === "All" || item.type === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const MyfilteredItems = myitems.filter(
    (item) =>
      (selectedCategory === "All" || item.type === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Extract user bids from all items
  const userBids = [
    ...items
      .flatMap((item) => {
        return (item.auction_history || [])
          .filter((bid) => {
            // Match by user ID if available, otherwise try to match by name

            if (bid.bidder) {
              return bid.bidder === username
            } else {
              // This is a fallback and might not be accurate
              return bid.bidder && bid.bidder.toLowerCase().includes(username.toLowerCase())
            }
          })
          .map((bid) => ({
            ...bid,
            itemId: item._id,
            itemName: item.name,
            itemImage: item.url,
            itemOwner: item.person,
            bidTime: bid.time || item.updatedAt,
            currentPrice: bid.current_price,
          }))
      }),
    ...myitems
      .flatMap((item) => {
        return (item.auction_history || [])
          .filter((bid) => {
            // Match by user ID if available, otherwise try to match by name

            if (bid.bidder) {
              return bid.bidder === username
            } else {
              // This is a fallback and might not be accurate
              return bid.bidder && bid.bidder.toLowerCase().includes(username.toLowerCase())
            }
          })
          .map((bid) => ({
            ...bid,
            itemId: item._id,
            itemName: item.name,
            itemImage: item.url,
            itemOwner: item.person,
            bidTime: bid.time || item.updatedAt,
            currentPrice: bid.current_price,
          }))
      }),
  ].sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime))

  
  console.log(userBids)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-sm font-medium text-gray-700">{email}</div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <NavLink active={display === "items"} onClick={() => setDisplay("items")} label="All Items" />
              <NavLink active={display === "myitems"} onClick={() => setDisplay("myitems")} label="My Items" />
              <NavLink active={display === "mybids"} onClick={() => setDisplay("mybids")} label="My Bids" />
              <NavLink
                active={display === "mostvisited"}
                onClick={() => setDisplay("mostvisited")}
                label="Most Visited"
              />
              <NavLink href="/seller" label="Start Selling" />
            </nav>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryButton
              active={selectedCategory === "Art"}
              onClick={() => setSelectedCategory("Art")}
              label="Arts"
            />
            <CategoryButton
              active={selectedCategory === "Antique"}
              onClick={() => setSelectedCategory("Antique")}
              label="Antiques"
            />
            <CategoryButton
              active={selectedCategory === "Used"}
              onClick={() => setSelectedCategory("Used")}
              label="Used"
            />
            <CategoryButton
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
              label="All"
            />
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
              onClick={toggleLikedWindow}
            >
              <svg
                className="w-5 h-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="hidden sm:inline">Liked Items</span>
            </button>

            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
              onClick={() => setShowFilterPopup(true)}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Items</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <FilterOption
                active={selectedCategory === "Art"}
                onClick={() => {
                  setSelectedCategory("Art")
                  setShowFilterPopup(false)
                }}
                label="Arts"
              />
              <FilterOption
                active={selectedCategory === "Antique"}
                onClick={() => {
                  setSelectedCategory("Antique")
                  setShowFilterPopup(false)
                }}
                label="Antiques"
              />
              <FilterOption
                active={selectedCategory === "Used"}
                onClick={() => {
                  setSelectedCategory("Used")
                  setShowFilterPopup(false)
                }}
                label="Used Items"
              />
              <FilterOption
                active={selectedCategory === "All"}
                onClick={() => {
                  setSelectedCategory("All")
                  setShowFilterPopup(false)
                }}
                label="All"
              />
            </div>
            <button
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setShowFilterPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto relative">
        <div className="flex-grow">
          {display === "items" && (
            <ItemsDisplay items={filteredItems} handleAddToWishlist={handleAddToWishlist} wishlist={wishlist} />
          )}
          {display === "myitems" && (
            <MyItemsDisplay items={MyfilteredItems} groupBy={groupBy} setGroupBy={setGroupBy} />
          )}
          {display === "mybids" && <MyBidsDisplay bids={userBids} />}
          {display === "mostvisited" && (
            <MostVisitedDisplay items={filteredItems} handleAddToWishlist={handleAddToWishlist} wishlist={wishlist} />
          )}
        </div>
        {showLikedWindow && (
          <LikedItemsDisplay closepopup={() => setShowLikedWindow(false)} handleAddToWishlist={handleAddToWishlist} />
        )}
      </main>
    </div>
  )
}

// Helper Components
const NavLink = ({ active, onClick, href, label }) => {
  const baseClasses = "px-3 py-2 text-sm font-medium rounded-lg transition-colors"
  const activeClasses = "bg-red-50 text-red-700"
  const inactiveClasses = "text-gray-600 hover:bg-gray-100"

  if (href) {
    return (
      <Link to={href} className={`${baseClasses} ${inactiveClasses}`}>
        {label}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  )
}

const CategoryButton = ({ active, onClick, label }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

const FilterOption = ({ active, onClick, label }) => {
  return (
    <button
      className={`p-3 text-center rounded-lg transition-all ${
        active ? "bg-red-100 text-red-700 ring-2 ring-red-500" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// Items Display Component
const ItemsDisplay = ({ items, handleAddToWishlist, wishlist }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 animate-fadeIn">
      {items.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No items found</p>
        </div>
      ) : (
        items.map((item) => {
          const now = new Date(new Date().toISOString())
          const hasAuctionTiming = item.date && item.StartTime && item.EndTime
          const formattedDate = hasAuctionTiming ? new Date(item.date).toISOString().split("T")[0] : "N/A"
          const formattedStartTime = hasAuctionTiming ? item.StartTime.split("T")[1]?.slice(0, 5) + "" : "N/A"
          const formattedEndTime = hasAuctionTiming ? item.EndTime.split("T")[1]?.slice(0, 5) + "" : "N/A"
          const auctionStarted = hasAuctionTiming ? now >= new Date(item.StartTime) : false
          const auctionEnded = hasAuctionTiming ? now >= new Date(item.EndTime) : false

          return (
            <div
              key={item._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddToWishlist(item)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${
                      wishlist.find((wishlistItem) => wishlistItem._id === item._id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                {auctionEnded && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                    Auction Ended
                  </div>
                )}
                {!auctionStarted && !auctionEnded && hasAuctionTiming && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Upcoming
                  </div>
                )}
                {auctionStarted && !auctionEnded && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                    Live Auction
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name || "Unnamed Item"}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Owner:</span>
                    <span className="ml-2">{item.person}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Base Price:</span>
                    <span className="ml-2 font-semibold">₹{item.base_price}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <div className="text-center">
                      <div className="font-medium">Date</div>
                      <div>{formattedDate}</div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="font-medium">Start</div>
                      <div>{formattedStartTime}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">End</div>
                      <div>{formattedEndTime}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-lg font-bold text-gray-900">₹{item.current_price}</div>
                    <Link
                      to={`/auction/${item._id}`}
                      className={`px-4 py-2 ${
                        auctionEnded ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                      } text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1`}
                    >
                      {auctionEnded ? "Auction Ended" : "Bid Now"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// My Items Display Component with Grouping
const MyItemsDisplay = ({ items, groupBy, setGroupBy }) => {
  // Group items by date
  const groupItems = () => {
    if (groupBy === "none") return { "All Items": items }

    const grouped = {}

    items.forEach((item) => {
      let key = "Unknown Date"

      if (item.createdAt) {
        const date = new Date(item.createdAt)

        if (groupBy === "day") {
          key = date.toLocaleDateString()
        } else if (groupBy === "week") {
          // Get the week number
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
          const pastDaysOfYear = (date - firstDayOfYear) / 86400000
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
          key = `Week ${weekNum}, ${date.getFullYear()}`
        } else if (groupBy === "month") {
          key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        }
      }

      if (!grouped[key]) {
        grouped[key] = []
      }

      grouped[key].push(item)
    })

    return grouped
  }

  const groupedItems = groupItems()

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Items</h2>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Group by:</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="none">No Grouping</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">You don't have any items yet</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group} className="mb-8">
            {groupBy !== "none" && <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{group}</h3>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <h3 className="text-xl font-bold text-white p-4">{item.name || "Unnamed Item"}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Owner</div>
                        <div className="text-sm font-medium text-gray-900">{item.person}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Base Price</div>
                        <div className="text-sm font-medium text-gray-900">₹{item.base_price}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">Brought Price</div>
                        <div className="text-lg font-bold text-gray-900">₹{item.current_price}</div>
                      </div>
                      <PaymentButton item={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// My Bids Display Component
const MyBidsDisplay = ({ bids, username }) => {
  // Group bids by item
  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.itemId]) {
      acc[bid.itemId] = {
        itemName: bid.itemName,
        itemImage: bid.itemImage,
        itemOwner: bid.itemOwner,
        bids: [],
        totalBidAmount: 0,
        highestBid: 0,
        currentPrice: bid.currentPrice,
      }
    }

    acc[bid.itemId].bids.push(bid)
    acc[bid.itemId].totalBidAmount += Number.parseInt(bid.price)

    if (Number.parseInt(bid.price) > acc[bid.itemId].highestBid) {
      acc[bid.itemId].highestBid = Number.parseInt(bid.price)
    }

    return acc
  }, {})

  const totalBids = bids.length
  const totalBidAmount = bids.reduce((acc, bid) => acc + Number.parseInt(bid.price), 0)
  const wonAuctions = Object.values(groupedBids).filter(itemBids => itemBids.current_bidder === username).length

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bids</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-gray-200">
    <p className="text-gray-500 text-sm mb-1">Total Bids</p>
    <h2 className="text-2xl font-semibold text-gray-800">{totalBids}</h2>
  </div>

  <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-gray-200">
    <p className="text-gray-500 text-sm mb-1">Total Bid Amount</p>
    <h2 className="text-2xl font-semibold text-green-600">₹{totalBidAmount.toLocaleString()}</h2>
  </div>

  <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-gray-200">
    <p className="text-gray-500 text-sm mb-1">Won Auctions</p>
    <h2 className="text-2xl font-semibold text-blue-600">{wonAuctions}</h2>
  </div>
</div>


      {Object.keys(groupedBids).length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">You haven't placed any bids yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {Object.values(groupedBids).map((itemBids) => (
            <div
              key={itemBids.bids[0].itemId}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="h-48 md:h-full relative">
                    <img
                      src={itemBids.itemImage || "/placeholder.svg"}
                      alt={itemBids.itemName}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden flex items-end">
                      <h3 className="text-xl font-bold text-white p-4">{itemBids.itemName || "Unnamed Item"}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="hidden md:block mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{itemBids.itemName || "Unnamed Item"}</h3>
                    <p className="text-sm text-gray-500">Owned by {itemBids.itemOwner}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Your Bids</div>
                      <div className="text-lg font-bold text-gray-900">{itemBids.bids.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Your Highest Bid</div>
                      <div className="text-lg font-bold text-gray-900">₹{itemBids.highestBid}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Current Price</div>
                      <div className="text-lg font-bold text-gray-900">₹{itemBids.currentPrice}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Your Bids</h4>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {itemBids.bids.map((bid, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {new Date(bid.bidTime).toLocaleString()}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₹{bid.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Most Visited Display Component
const MostVisitedDisplay = ({ items, handleAddToWishlist, wishlist }) => {
  // Sort items by number of visited users (most visited first)
  const sortedItems = [...items].sort((a, b) => {
    const aVisits = a.visited_users?.length || 0
    const bVisits = b.visited_users?.length || 0
    return bVisits - aVisits
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 animate-fadeIn">
      {sortedItems.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No visited items found</p>
        </div>
      ) : (
        sortedItems.map((item) => {
          const now = new Date(new Date().toISOString())
          const hasAuctionTiming = item.date && item.StartTime && item.EndTime
          const formattedDate = hasAuctionTiming ? new Date(item.date).toISOString().split("T")[0] : "N/A"
          const formattedStartTime = hasAuctionTiming ? item.StartTime.split("T")[1]?.slice(0, 5) + "" : "N/A"
          const formattedEndTime = hasAuctionTiming ? item.EndTime.split("T")[1]?.slice(0, 5) + "" : "N/A"
          const visitCount = item.visited_users?.length || 0

          return (
            <div
              key={item._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                  {visitCount} {visitCount === 1 ? "visit" : "visits"}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddToWishlist(item)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${
                      wishlist.find((wishlistItem) => wishlistItem._id === item._id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name || "Unnamed Item"}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Owner:</span>
                    <span className="ml-2">{item.person}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Base Price:</span>
                    <span className="ml-2 font-semibold">₹{item.base_price}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <div className="text-center">
                      <div className="font-medium">Date</div>
                      <div>{formattedDate}</div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="font-medium">Start</div>
                      <div>{formattedStartTime}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">End</div>
                      <div>{formattedEndTime}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-lg font-bold text-gray-900">₹{item.current_price}</div>
                    <Link
                      to={`/auction/${item._id}`}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1"
                    >
                      Bid Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// Liked Items Display Component
const LikedItemsDisplay = ({ closepopup, handleAddToWishlist }) => {
  const likedItems = useSelector((state) => state.liked)

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">Liked Items</h2>
        </div>
        <button
          onClick={closepopup}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close liked items"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {likedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No items liked yet!</p>
            <p className="text-sm text-gray-400 mt-2">Browse items and click the heart icon to add them here</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {[...likedItems].reverse().map((item) => (
              <LikedItemCard key={item._id} item={item} handleAddToWishlist={handleAddToWishlist} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// Liked Item Card Component
const LikedItemCard = ({ item, handleAddToWishlist }) => {
  return (
    <li className="bg-gray-50 rounded-lg overflow-hidden flex shadow-sm hover:shadow transition-shadow">
      <Link to={`/auction/${item._id}`} className="flex-shrink-0 w-24 h-24 relative">
        <img src={item.url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
      </Link>

      <div className="flex-1 p-3 flex flex-col">
        <div className="flex justify-between items-start">
          <Link
            to={`/auction/${item._id}`}
            className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
          >
            {item.name || "Unnamed Item"}
          </Link>
          <button
            onClick={() => handleAddToWishlist(item)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove from wishlist"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-1 text-xs text-gray-500">Owner: {item.person}</div>

        <div className="mt-auto flex justify-between items-center pt-2">
          <div className="text-sm font-bold text-gray-900">₹{item.current_price}</div>
          <Link
            to={`/auction/${item._id}`}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition-colors"
          >
            Bid Now
          </Link>
        </div>
      </div>
    </li>
  )
}

// Payment Button Component
const PaymentButton = ({ item }) => {
  return (
    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200">
      Pay Now
    </button>
  )
}
