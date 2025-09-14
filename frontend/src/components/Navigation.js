import React, { useState } from 'react';
import './Navigation.css';

function Navigation({ currentView, setCurrentView }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 992);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Product Management', icon: '📦' },
    { id: 'stock', label: 'Stock Management', icon: '📋' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'inventory', label: 'Inventory', icon: '📁' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'reporting', label: 'Reporting', icon: '📈' }
  ];

  const toggleNav = () => {
    if (window.innerWidth < 576) {
      setIsNavOpen(!isNavOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (itemId) => {
    setCurrentView(itemId);
    if (window.innerWidth < 576) {
      setIsNavOpen(false);
    }
  };

  return (
    <>
      <button className="toggle-nav" onClick={toggleNav}>
        ☰
      </button>
      <nav className={`navigation ${isCollapsed ? 'collapsed' : ''} ${isNavOpen ? 'open' : ''}`}>
        <div className="navigation-header">
          <h2>Wings Cafe Inventory</h2>
          <button className="toggle-nav-inner" onClick={toggleNav}>
            ✕
          </button>
        </div>
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button 
                className={currentView === item.id ? 'active' : ''}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navigation;