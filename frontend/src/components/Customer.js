import React, { useState } from 'react';
import './Customer.css';

function Customer() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-1234', loyaltyPoints: 120, lastVisit: '2023-08-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678', loyaltyPoints: 85, lastVisit: '2023-08-20' },
    { id: 3, name: 'Mike Williams', email: 'mike@example.com', phone: '555-9012', loyaltyPoints: 200, lastVisit: '2023-08-25' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loyaltyPoints: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...formData, id: editingCustomer.id, lastVisit: editingCustomer.lastVisit }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...formData,
        id: Date.now(),
        lastVisit: new Date().toISOString().split('T')[0]
      };
      setCustomers([...customers, newCustomer]);
    }
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', loyaltyPoints: 0 });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      loyaltyPoints: customer.loyaltyPoints
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="customer-module">
      <h2>Customer Management</h2>
      
      <div className="customer-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="btn-add-customer"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Customer'}
        </button>
      </div>

      {showForm && (
        <div className="customer-form">
          <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Loyalty Points:</label>
              <input
                type="number"
                name="loyaltyPoints"
                value={formData.loyaltyPoints}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                  setFormData({ name: '', email: '', phone: '', loyaltyPoints: 0 });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="customers-list">
        <h3>Customer List</h3>
        
        {filteredCustomers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found. {searchTerm && 'Try a different search term.'}</p>
          </div>
        ) : (
          <table className="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Loyalty Points</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className="loyalty-badge">{customer.loyaltyPoints}</span>
                  </td>
                  <td>{customer.lastVisit}</td>
                  <td>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="customer-stats">
        <div className="stat-card">
          <h4>Total Customers</h4>
          <p className="stat-number">{customers.length}</p>
        </div>
        <div className="stat-card">
          <h4>Top Loyalty Points</h4>
          <p className="stat-number">
            {customers.length > 0 ? Math.max(...customers.map(c => c.loyaltyPoints)) : 0}
          </p>
        </div>
        <div className="stat-card">
          <h4>Average Points</h4>
          <p className="stat-number">
            {customers.length > 0 
              ? Math.round(customers.reduce((sum, c) => sum + c.loyaltyPoints, 0) / customers.length) 
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Customer;