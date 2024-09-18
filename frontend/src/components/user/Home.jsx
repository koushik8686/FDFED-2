import React, { useState ,useEffect } from 'react';
import { Link ,useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Items from './homecomponents/Items';
import Myitems from './homecomponents/myitems';
import Mostvisited from './homecomponents/mostvisited';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedItems, setSortedItems] = useState([]);
  const [display , setdisplay]= useState("items");
  const [myitems,setmyitems] = useState([])
  const [username, setUsername] = useState(''); // Initialize with a default or fetch from cookies
  const userid = Cookies.get('user');
  const navigate = useNavigate();
  const [items , setitems] = useState([]);
  const logout = ()=>{
   Cookies.remove('user')
   navigate('/')
  }
  useEffect(() => {

    if (Cookies.get("user")===undefined) {
      navigate("/login")
    }
    // Define the async function inside the useEffect to use async/await
    const fetchUserData = async () => {

      try {
        const response = await fetch(`/user/${userid}` , {method: 'GET'});
        const data = await response.json();
        console.log("response" , data);
        
        if (response.ok) {
          setUsername(data.data.user.username);
          setmyitems(data.data.user.items);
          setitems(data.data.items) // Assuming the API response has a field 'username'
          console.log(items);
          console.log(sortedItems);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchUserData();
  }, []);
  const filteredItems = items
    .filter(item => 
      (selectedCategory === 'All' || item.type === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const MyfilteredItems = myitems
    .filter(item => 
      (selectedCategory === 'All' || item.type === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-red-600 text-white py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <nav className="flex items-center gap-6">
        <div className="relative group">
            {/* Circle with the first letter */}
            <div className="w-10 h-10 bg-white text-red-600 flex items-center justify-center rounded-full cursor-pointer">
              {username.charAt(0).toUpperCase()}
            </div>
            {/* Full name on hover */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {username}
            </div>
          </div>
          <Link onClick={()=>{setdisplay("items")}} to="#" className="font-medium hover:text-gray-300">All Items</Link>
          <Link onClick={()=>{setdisplay("myitems")}} to="#" className="font-medium hover:text-gray-300">My Items</Link>
          <Link  onClick={()=>{setdisplay("mostvisited")}} to="#" className="font-medium hover:text-gray-300">Most Visited</Link>
          <Link to="/seller" className="font-medium hover:text-gray-300">Start Selling</Link>
        </nav>
        <div className="flex items-center gap-4">
        
          <button onClick={logout} className="font-medium hover:text-gray-300">Log Out</button>
        </div>
      </header>

      <div className="bg-white py-4 px-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-64"
            />
            <button
              className="sm:hidden px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => setShowFilterPopup(true)}
            >
              Filter
            </button>
          </div>
          <div className="hidden sm:flex gap-4">
            <button
              className={`px-6 py-2 border rounded-md ${selectedCategory === 'Art' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => setSelectedCategory('Art')}
            >
              Arts
            </button>
            <button
              className={`px-6 py-2 border rounded-md ${selectedCategory === 'Antique' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => setSelectedCategory('Antique')}
            >
              Antiques
            </button>
            <button
              className={`px-6 py-2 border rounded-md ${selectedCategory === 'Used' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => setSelectedCategory('Used')}
            >
              Used 
            </button>
            <button
              className={`px-6 py-2 border rounded-md ${selectedCategory === 'All' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Popup for Filters */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Filter Items</h2>
            <div className="flex flex-col gap-4">
              <button
                className={`px-6 py-2 border rounded-md ${selectedCategory === 'Art' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
                onClick={() => { setSelectedCategory('Arts'); setShowFilterPopup(false); }}
              >
                Arts
              </button>
              <button
                className={`px-6 py-2 border rounded-md ${selectedCategory === 'Antique' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
                onClick={() => { setSelectedCategory('Antiques'); setShowFilterPopup(false); }}
              >
                Antiques
              </button>
              <button
                className={`px-6 py-2 border rounded-md ${selectedCategory === 'Used s' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
                onClick={() => { setSelectedCategory('Used Items'); setShowFilterPopup(false); }}
              >
                Used Items
              </button>
              <button
                className={`px-6 py-2 border rounded-md ${selectedCategory === 'All' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
                onClick={() => { setSelectedCategory('All'); setShowFilterPopup(false); }}
              >
                All
              </button>
            </div>
            <button
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md w-full"
              onClick={() => setShowFilterPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

<main className="">
  {display === 'items' && <Items filteredItems={filteredItems} />}
  {display === 'myitems' && <Myitems  MyfilteredItems={MyfilteredItems}/>}
  {display === 'mostvisited' && <Mostvisited Items={filteredItems} />}
</main>
    </div>
  );
}
