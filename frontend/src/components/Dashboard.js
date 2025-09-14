import React from 'react';
import './Dashboard.css';
import Marquee from 'react-fast-marquee';

function Dashboard({ products }) {
  const lowStockProducts = products.filter(product => product.quantity <= product.minStockLevel);
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '10px 0',
        overflow: 'hidden'
      }}>
        <p style={{
          margin: 0,
          padding: '0 20px',
          fontSize: '18px',
          color: '#fff',
          whiteSpace: 'nowrap',
          animation: 'breathe 3s ease-in-out infinite',
          transformOrigin: 'center',
          fontFamily: '"Poppins", sans-serif',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
        }}>
          📢 Get ready for the Holiday Sale! All products 15% off for the next 24 hours!
        </p>
      </div>
      <div className="stats">
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>Total Inventory Value</h3>
          <p>M{totalValue.toFixed(2)}</p>
        </div>
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>Low Stock Items</h3>
          <p>{lowStockProducts.length}</p>
        </div>
      </div>
      
      <div className="low-stock-alert" style={{ marginTop: '20px' }}>
        {lowStockProducts.length > 0 && (
          <>
            <h3>Low Stock Alert</h3>
            
            <ul>
              {lowStockProducts.map(product => (
                <li key={product.id}>
                  {product.name} - Only {product.quantity} left (Min: {product.minStockLevel})
                </li>
              ))}
            </ul>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;