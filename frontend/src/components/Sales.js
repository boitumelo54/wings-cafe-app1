import React, { useState } from 'react';
import './Sales.css';

function Sales({ products }) {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [dateFilter, setDateFilter] = useState('today');
  
  // Sample sales data
  const [sales, setSales] = useState([
    { id: 1, customer: "John Smith", items: ["Coffee", "Sandwich"], total: 7.50, date: "2023-09-01", payment: "cash" },
    { id: 2, customer: "Sarah Johnson", items: ["Coffee", "Cake"], total: 5.75, date: "2023-09-01", payment: "card" },
    { id: 3, customer: "Mike Williams", items: ["Sandwich", "Juice"], total: 8.25, date: "2023-09-02", payment: "cash" }
  ]);

  // Safe handling of products
  const safeProducts = products || [];

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = cartTotal - (cartTotal * (discount / 100));

  // Process sale
  const processSale = () => {
    if (cart.length === 0) {
      alert("Please add items to cart first!");
      return;
    }

    const newSale = {
      id: Date.now(),
      customer: customerName || "Walk-in Customer",
      items: cart.map(item => `M{item.quantity}x M{item.name}`),
      total: finalTotal,
      date: new Date().toLocaleDateString(),
      payment: paymentMethod
    };

    // Add to sales history
    setSales([newSale, ...sales]);
    
    // Reset cart and form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    
    alert(`Sale completed successfully! Total: $M{finalTotal.toFixed(2)}`);
  };

  // Filter sales by date
  const filteredSales = sales.filter(sale => {
    const today = new Date().toLocaleDateString();
    if (dateFilter === 'today') return sale.date === today;
    if (dateFilter === 'week') return true; // For simplicity, showing all
    return true;
  });

  // Calculate sales statistics
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => sale.date === new Date().toLocaleDateString())
                         .reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;

  return (
    <div className="sales-module">
      <h2>Sales Management</h2>
      
      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-number">M{totalSales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <p className="stat-number">M{todaySales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-number">{totalTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Average Sale</h3>
          <p className="stat-number">M{totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="sales-container">
        <div className="products-section">
          <h3>Products</h3>
          <div className="products-grid">
            {safeProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <div className="product-stock">Stock: {product.quantity}</div>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.quantity === 0}
                  className={product.quantity === 0 ? 'out-of-stock' : ''}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h3>Shopping Cart</h3>
          
          <div className="customer-info">
            <h4>Customer Information</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add products from the list</p>
            </div>
          ) : (
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>M{item.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td>M{(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>M{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <label>Discount:</label>
                  <div className="discount-control">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="summary-row total">
                  <span>Total:</span>
                  <span>M{finalTotal.toFixed(2)}</span>
                </div>

                <div className="payment-method">
                  <label>Payment Method:</label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                    <option value="mobile">Mobile Payment</option>
                  </select>
                </div>

                <button 
                  onClick={processSale}
                  className="checkout-btn"
                >
                  Process Sale
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sales-history">
        <h3>Sales History</h3>
        
        <div className="history-controls">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {filteredSales.length === 0 ? (
          <div className="no-sales">
            <p>No sales recorded yet</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.date}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.items.join(', ')}</td>
                  <td>${sale.total.toFixed(2)}</td>
                  <td>
                    <span className={`payment-badge M{sale.payment}`}>
                      {sale.payment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sales;