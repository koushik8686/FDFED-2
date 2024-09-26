import { Link } from "react-router-dom";
import './Landing.css';  // Import the CSS file
import { useEffect , useState} from "react";

export default function Component() {

  
  return (
    <div  className="page-container">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-text">HEXART</span>
        </Link>
        <nav className="nav">
          <Link to="/register" className="nav-link">User</Link>
          <Link to="/seller" className="nav-link">Seller</Link>
          <Link to="/admin/login" className="nav-link">Admin</Link>
        </nav>
      </header>
      <main className="main">
        <section className="section">
          <div className="content">
          <h1 className="title">
      <div style={{ display: 'flex'}} className="left">
        <div className="letter H">H</div>
        <div className="letter E">E</div>
        <div className="letter X">X</div>
      </div>
      <div style={{ display: 'flex' }} className="right">
        <div className="letter A">A</div>
        <div className="letter R">R</div>
        <div className="letter T">T</div>
      </div>
    </h1>
            <p className="description">
              Explore a world of mystery and history with our curated selection of items, waiting for the highest bidder.
            </p>
           
          </div>
          <div className="features">
          <div className="uline"></div>
          </div>
        </section>
        
      </main>
    </div>
  );
}


