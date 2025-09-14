import React, { useState } from 'react';
import './StockManagement.css';

function StockManagement({ products, updateStock }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity) return;
    
    const adjustment = adjustmentType === 'add' ? parseInt(quantity) : -parseInt(quantity);
    updateStock(selectedProduct, adjustment);
    
    // Reset form
    setQuantity('');
  };

  return (
    <div className="stock-management">
      <h2>Stock Management</h2>
      
      <form onSubmit={handleSubmit} className="stock-form">
        <div className="form-group">
          <label>Select Product:</label>
          <select 
            value={selectedProduct} 
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">-- Select Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Current: {product.quantity})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Adjustment Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="add"
                checked={adjustmentType === 'add'}
                onChange={() => setAdjustmentType('add')}
              />
              Add Stock
            </label>
            <label>
              <input
                type="radio"
                value="deduct"
                checked={adjustmentType === 'deduct'}
                onChange={() => setAdjustmentType('deduct')}
              />
              Deduct Stock
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Update Stock</button>
      </form>
      
      <div className="stock-list">
        <h3>Current Stock Levels</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className={product.quantity <= product.minStockLevel ? 'low-stock' : ''}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>
                  {product.quantity <= product.minStockLevel 
                    ? `Low Stock (Min: ${product.minStockLevel})` 
                    : 'In Stock'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockManagement;