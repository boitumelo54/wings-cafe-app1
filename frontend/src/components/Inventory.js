import React, { useState } from 'react';
import './Inventory.css';

function Inventory({ products }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Safe handling of products
  const safeProducts = products || [];

  // Get all unique categories
  const categories = ['all', ...new Set(safeProducts.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = safeProducts
    .filter(product => {
      // Filter by category
      const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
      
      // Filter by low stock
      const lowStockMatch = !lowStockOnly || product.quantity <= product.minStockLevel;
      
      // Filter by search term
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && lowStockMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort products
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate inventory statistics
  const totalProducts = safeProducts.length;
  const totalValue = safeProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockItems = safeProducts.filter(product => product.quantity <= product.minStockLevel);
  const outOfStockItems = safeProducts.filter(product => product.quantity === 0);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="inventory-module">
      <h2>Inventory Management</h2>
      
      <div className="inventory-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <p className="stat-number">M{totalValue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p className="stat-number">{lowStockItems.length}</p>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <p className="stat-number">{outOfStockItems.length}</p>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
              />
              Show low stock only
            </label>
          </div>
        </div>
      </div>

      <div className="inventory-list">
        <h3>Product Inventory</h3>
        
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found. {searchTerm && 'Try a different search term.'}</p>
          </div>
        ) : (
          <>
            <div className="sort-controls">
              <span>Sort by: </span>
              <button 
                className={sortBy === 'name' ? 'active' : ''}
                onClick={() => handleSort('name')}
              >
                Name {getSortIcon('name')}
              </button>
              <button 
                className={sortBy === 'quantity' ? 'active' : ''}
                onClick={() => handleSort('quantity')}
              >
                Quantity {getSortIcon('quantity')}
              </button>
              <button 
                className={sortBy === 'price' ? 'active' : ''}
                onClick={() => handleSort('price')}
              >
                Price {getSortIcon('price')}
              </button>
            </div>
            
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className={
                    product.quantity === 0 ? 'out-of-stock' : 
                    product.quantity <= product.minStockLevel ? 'low-stock' : ''
                  }>
                    <td>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-desc">{product.description}</div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className="quantity-display">{product.quantity}</span>
                    </td>
                    <td>{product.minStockLevel}</td>
                    <td>
                      {product.quantity === 0 ? (
                        <span className="status-out">Out of Stock</span>
                      ) : product.quantity <= product.minStockLevel ? (
                        <span className="status-low">Low Stock</span>
                      ) : (
                        <span className="status-ok">In Stock</span>
                      )}
                    </td>
                    <td>${(product.price * product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="inventory-summary">
              <p>
                Showing {filteredProducts.length} of {safeProducts.length} products • 
                Total value: <strong>M{filteredProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}</strong>
              </p>
            </div>
          </>
        )}
      </div>

      {lowStockItems.length > 0 && (
        <div className="low-stock-alert">
          <h3>⚠️ Low Stock Alert</h3>
          <p>The following products are running low on stock:</p>
          <ul>
            {lowStockItems.map(product => (
              <li key={product.id}>
                {product.name} - Only {product.quantity} left (Min: {product.minStockLevel})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Inventory;