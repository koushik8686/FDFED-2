import { Link } from "react-router-dom";
import './Landing.css';  // Import the CSS file

export default function Component() {
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
          <Link to="/admin" className="nav-link">Admin</Link>
        </nav>
      </header>
      <main className="main">
        <section className="section">
          <div className="content">
            <h1 className="title">
              Discover Rare Artifacts at Our Auction House
            </h1>
            <p className="description">
              Explore a world of mystery and history with our curated selection of items, waiting for the highest bidder.
            </p>
            <Link to="/home" className="button">
              Browse Auctions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
