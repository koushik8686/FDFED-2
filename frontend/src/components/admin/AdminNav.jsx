import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'




export default function AdminNav() {
    const navigate = useNavigate()
    const logout = () => {
        Cookies.remove("admin")
       navigate("/admin/login")
       }
  return (
    <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform 
       transition-transform duration-300 ease-in-out z-30`}>
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">Auction Admin</h1>
        </div>
        <nav className="mt-4">
          <Link to="/admin" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Users
          </Link>
          <Link to="/subscriptions" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Sellers
          </Link>
          <Link to="/admin/items" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Items
          </Link>
          <Link to="/admin/calender" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Calendar
          </Link>
          <Link to="/reviews" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Reviews
          </Link>

          <Link to="/performance" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            Performance
          </Link>
    
          <button 
            onClick={logout} 
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-100"
          >
            Log Out
          </button>
        </nav>
      </aside>
    
  )
}
