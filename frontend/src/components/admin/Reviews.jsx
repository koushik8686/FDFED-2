import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  async function fetchFeedbacks() {
    try {
      const response = await axios.get('/feedbacks');
      const feedbackData = response.data;
      setFeedbacks(feedbackData);

      // Calculate average rating
      const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.Rating, 0);
      setAverageRating((totalRating / feedbackData.length).toFixed(1));
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  }

  useEffect(() => {
    if (!Cookies.get('admin')) {
      navigate('/admin/login');
    }
    fetchFeedbacks();
  }, []);

  const logout = () => {
    Cookies.remove('admin');
    navigate('/');
  };

  return (
    <div className="admin-home-div flex ">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <h1 className="sidebar-title">Auction Admin</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">Dashboard</Link>
          <Link to="/admin/calender" className="nav-item">Calender</Link>
          <a href="/reviews" className='nav-item'>Reviews</a>
          <p onClick={logout} className="nav-item">Log Out</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Feedback Reviews</h2>

        {/* Average Rating */}
        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Average Rating</h3>
          <p className="text-4xl font-bold text-indigo-600">{averageRating} <FaStar className="inline text-yellow-500" /></p>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white shadow-md p-4 rounded-md">
              <h3 className="text-lg font-bold">{feedback.name}</h3>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {feedback.email}</p>
              <p className="text-sm text-gray-600"><strong>Issue:</strong> {feedback.issue}</p>
              <p className="text-sm text-gray-600"><strong>Feedback:</strong> {feedback.Feedback}</p>
              <p className="text-sm text-gray-600"><strong>Rating:</strong> {feedback.Rating} <FaStar className="inline text-yellow-500" /></p>
              <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(feedback.CreatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
