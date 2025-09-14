import React, { useState } from 'react';
import './Product.css';

function Product({ products, addProduct, updateProduct, deleteProduct }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    minStockLevel: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minStockLevel: parseInt(formData.minStockLevel)
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct({ ...productData, id: Date.now() });
    }

    // Reset form
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      minStockLevel: ''
    });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      minStockLevel: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>
      
      <form onSubmit={handleSubmit} className="product-form">
        <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Initial Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Minimum Stock Level:</label>
          <input
            type="number"
            name="minStockLevel"
            value={formData.minStockLevel}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
          {isEditing && <button type="button" onClick={handleCancel}>Cancel</button>}
        </div>
      </form>
      
      <div className="product-list">
        <h3>Product List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>M{product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Product;