import { Link } from "react-router-dom";
import './Landing.css';  // Import the CSS file
import { motion } from 'framer-motion';
import { Gavel , ArrowRight } from 'lucide-react';
import { Navbar } from "./LandingComponents/NavBAr";
import Hero from './LandingComponents/Hero'
import { Features } from "./LandingComponents/Features";
import FeedBack from "./LandingComponents/FeedBack";

//landing page

export default function Component() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FeedBack/>
      </main>
    </div>
  );
}


