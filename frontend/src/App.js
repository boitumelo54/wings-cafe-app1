import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Product from './components/Product';
import StockManagement from './components/StockManagement';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Customer from './components/Customer';
import Reporting from './components/Reporting';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventoryProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Load initial data from the JSON file
      fetch('/data/database.json')
        .then(response => response.json())
        .then(data => {
          setProducts(data.products);
          localStorage.setItem('inventoryProducts', JSON.stringify(data.products));
        })
        .catch(error => console.error('Error loading data:', error));
    }
  }, []);

  // Save data to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const updateStock = (productId, adjustment) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, quantity: Math.max(0, product.quantity + adjustment) }
          : product
      )
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard products={products} />;
      case 'products':
        return (
          <Product
            products={products} 
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        );
      case 'stock':
        return (
          <StockManagement 
            products={products} 
            updateStock={updateStock}
          />
        );
      case 'sales':
        return <Sales />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <Customer />;
      case 'reporting':
        return <Reporting />;
      default:
        return <Dashboard products={products} />;
    }
  };

  return (
    <div className="app">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;