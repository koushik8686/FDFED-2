import { Link } from "react-router-dom";
import './Landing.css';  // Import the CSS file
import { useEffect , useState} from "react";

export default function Component() {
  const [visibleLetters, setVisibleLetters] = useState({
    H: false,
    E: false,
    X: false,
    A: false,
    R: false,
    T: false,
  });

  useEffect(() => {
    const timeouts = [];
    const letters = ['H', 'E', 'X', 'A', 'R', 'T'];

    letters.forEach((letter, index) => {
      timeouts.push(setTimeout(() => {
        setVisibleLetters((prev) => ({ ...prev, [letter]: true }));
      }, index * 300)); // 300ms delay between each letter
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);
  return (
    <div className="page-container">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-text">HEXART</span>
        </Link>
        <nav className="nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/seller" className="nav-link">Seller</Link>
          <Link to="/admin/login" className="nav-link">Admin</Link>
        </nav>
      </header>
      <main className="main">
        <section className="section">
          <div className="content">
            <h1 className="title">
              <div className=" letter H">H</div>
              <div className=" letter E">E</div>
              <div className=" letter X">X</div>
              <div className=" letter A">A</div>
              <div className=" letter R">R</div>
              <div className=" letter T">T</div>
            </h1>
            <p className="description">
              Explore a world of mystery and history with our curated selection of items, waiting for the highest bidder.
            </p>
            <Link to="/login" className="button">
              Browse Auctions
            </Link>
          </div>
        </section>
        
      </main>
    </div>
  );
}
