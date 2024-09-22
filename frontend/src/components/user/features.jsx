'use client'

import { useState } from 'react'
import { Users, ShieldCheck, Store, ShoppingCart, ChartBar, Bell, Tag, Star, Heart } from 'lucide-react'
import './features.css'

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState("")

  const features = [
    {
      role: "Users",
      icon: <Users size={32} className="icon" />,
      items: [
        { title: "Easy Shopping", description: "Browse and purchase products with ease", icon: <ShoppingCart size={16} className="icon-small" /> },
        { title: "Product Reviews", description: "Read and write product reviews", icon: <Star size={16} className="icon-small" /> },
        { title: "Wishlist", description: "Save items for future purchase", icon: <Heart size={16} className="icon-small" /> },
      ],
    },
    {
      role: "Sellers",
      icon: <Store size={32} className="icon" />,
      items: [
        { title: "Product Management", description: "Add, edit, and manage product listings", icon: <Tag size={16} className="icon-small" /> },
        { title: "Order Processing", description: "View and process customer orders", icon: <ShoppingCart size={16} className="icon-small" /> },
        { title: "Store Analytics", description: "Track sales and performance metrics", icon: <ChartBar size={16} className="icon-small" /> },
      ],
    },
    {
      role: "Admins",
      icon: <ShieldCheck size={32} className="icon" />,
      items: [
        { title: "User Management", description: "Manage user accounts and permissions", icon: <Users size={16} className="icon-small" /> },
        { title: "Analytics Dashboard", description: "View site-wide analytics and reports", icon: <ChartBar size={16} className="icon-small" /> },
        { title: "Content Moderation", description: "Moderate user-generated content", icon: <Bell size={16} className="icon-small" /> },
      ],
    },
  ]

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-grid">
          {features.map((role, index) => (
            <div key={role.role} className={`feature-box ${index === 1 ? 'center-feature' : ''}`}>
              <div className="feature-content">
                <div className="feature-header">
                  {role.icon}
                  <h3>{role.role}</h3>
                </div>
                <ul>
                  {role.items.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`feature-item ${hoveredFeature === `${role.role}-${featureIndex}` ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredFeature(`${role.role}-${featureIndex}`)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="feature-icon">{feature.icon}</div>
                      <div>
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
