import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './cartSlice';
import './App.css';

// Products Data with Categories & Description
const PRODUCTS = [
  { id: 1, title: 'Super Sneakers', price: 2500, category: 'Fashion', image: '👟', description: 'High quality sneakers for running and casual wear. Very comfortable.' },
  { id: 2, title: 'Cool Headphones', price: 1500, category: 'Electronics', image: '🎧', description: 'Noise cancelling headphones with deep bass sound.' },
  { id: 3, title: 'Gaming Mouse', price: 800, category: 'Electronics', image: '🖱️', description: 'RGB gaming mouse with high DPI sensor for pro gamers.' },
  { id: 4, title: 'Mechanical Keyboard', price: 4500, category: 'Electronics', image: '⌨️', description: 'Clicky mechanical keyboard with blue switches.' },
  { id: 5, title: 'Smart Watch', price: 3000, category: 'Electronics', image: '⌚', description: 'Track your fitness, heart rate and sleep automatically.' },
  { id: 6, title: 'Sunglasses', price: 1200, category: 'Fashion', image: '🕶️', description: 'UV protection sunglasses with stylish frame.' },
  { id: 7, title: 'Cotton T-Shirt', price: 500, category: 'Fashion', image: '👕', description: '100% Cotton breathable fabric for summer.' },
  { id: 8, title: 'Coffee Maker', price: 4000, category: 'Home', image: '☕', description: 'Brew fresh coffee instantly. Easy to clean.' },
];

function App() {
  const [currentView, setCurrentView] = useState('products'); // views: products, cart, checkout, details, orders
  const [selectedProduct, setSelectedProduct] = useState(null); // For Detail View
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Order History State (Load from LocalStorage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('myOrders');
    return saved ? JSON.parse(saved) : [];
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '', address: '', pincode: '', mobile: '', paymentMethod: 'cod'
  });

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  // Save Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem('myOrders', JSON.stringify(orders));
  }, [orders]);

  // Handle Search & Filter
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Product Click
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if(!formData.name || !formData.address || !formData.pincode || !formData.mobile) {
      alert("Please fill all details! 📝");
      return;
    }
    
    // Create Order Object
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: cartItems,
      total: totalAmount,
      address: formData.address,
      status: 'Processing'
    };

    setOrders([newOrder, ...orders]); // Add to history
    alert("Order Placed Successfully! 🎉");
    
    dispatch(clearCart());
    setFormData({ name: '', address: '', pincode: '', mobile: '', paymentMethod: 'cod' });
    setCurrentView('orders'); // Go to Order History
  };

  return (
    <div className="app">
      <header>
        <div className="logo" onClick={() => setCurrentView('products')}>My Shop 🛍️</div>
        <div className="nav-buttons">
          <button onClick={() => setCurrentView('orders')}>📦 My Orders</button>
          <button className="cart-btn" onClick={() => setCurrentView('cart')}>
            🛒 ({totalQuantity})
          </button>
        </div>
      </header>

      <main>
        {/* VIEW 1: PRODUCTS LIST (With Search & Filter) */}
        {currentView === 'products' && (
          <>
            {/* Search Bar */}
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              {["All", "Electronics", "Fashion", "Home"].map(cat => (
                <button 
                  key={cat} 
                  className={selectedCategory === cat ? 'active' : ''} 
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card" onClick={() => openProductDetails(product)}>
                  <div className="product-img">{product.image}</div>
                  <h3>{product.title}</h3>
                  <p>₹{product.price}</p>
                  {/* StopPropagation to prevent opening details when clicking Add */}
                  <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW 2: PRODUCT DETAILS (Video Style) */}
        {currentView === 'details' && selectedProduct && (
          <div className="details-container">
            <button className="back-btn-simple" onClick={() => setCurrentView('products')}>⬅ Back</button>
            <div className="detail-content">
              <div className="big-image">{selectedProduct.image}</div>
              <div className="info">
                <h1>{selectedProduct.title}</h1>
                <span className="category-tag">{selectedProduct.category}</span>
                <h2>₹{selectedProduct.price}</h2>
                <p className="description">{selectedProduct.description}</p>
                <div className="detail-actions">
                  <button className="add-btn" onClick={() => dispatch(addToCart(selectedProduct))}>Add to Cart 🛒</button>
                  <button className="buy-btn" onClick={() => { dispatch(addToCart(selectedProduct)); setCurrentView('cart'); }}>Buy Now ⚡</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CART */}
        {currentView === 'cart' && (
          <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Cart is empty! 😢</p>
                <button onClick={() => setCurrentView('products')}>Go Shopping</button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item" onClick={() => openProductDetails(item)}>
                    <span className="item-icon">{item.image}</span>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="actions" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                  </div>
                ))}
                <div className="total">
                  <h3>Total: ₹{totalAmount}</h3>
                  <button className="checkout-btn" onClick={() => setCurrentView('checkout')}>Proceed to Checkout ➡️</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW 4: CHECKOUT FORM */}
        {currentView === 'checkout' && (
          <div className="checkout-container">
            <h2>🚚 Delivery Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Mobile</label><input type="number" name="mobile" value={formData.mobile} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} required></textarea></div>
              <div className="form-group"><label>Pincode</label><input type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} required /></div>
              
              <div className="summary-box">
                <h3>Total to Pay: ₹{totalAmount}</h3>
              </div>
              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => setCurrentView('cart')}>Back</button>
                <button type="submit" className="confirm-btn">Confirm Order ✅</button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 5: ORDER HISTORY */}
        {currentView === 'orders' && (
          <div className="orders-container">
            <h2>📦 My Orders</h2>
            {orders.length === 0 ? <p>No previous orders.</p> : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span>Date: {order.date}</span>
                      <span className="status">{order.status}</span>
                    </div>
                    <div className="order-items">
                      {order.items.map(item => (
                        <span key={item.id}>{item.quantity} x {item.title}, </span>
                      ))}
                    </div>
                    <div className="order-total">
                      Total: ₹{order.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="back-btn-simple" onClick={() => setCurrentView('products')}>Back to Shop</button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;

