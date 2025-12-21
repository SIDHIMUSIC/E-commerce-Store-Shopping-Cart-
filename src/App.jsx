import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './cartSlice';
import './App.css';

// Products Data
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
  const [currentView, setCurrentView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('myOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: '', address: '', pincode: '', mobile: '', paymentMethod: 'cod'
  });

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('myOrders', JSON.stringify(orders));
  }, [orders]);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STRICT INDIAN VALIDATION LOGIC ---
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // 1. Empty Check
    if(!formData.name || !formData.address || !formData.pincode || !formData.mobile) {
      alert("⚠️ Please fill all details!");
      return;
    }

    // 2. Indian Mobile Validation (Starts with 6-9, Total 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert("⚠️ Invalid Indian Mobile Number!\nMust be 10 digits and start with 6, 7, 8, or 9.");
      return;
    }

    // 3. Indian Pincode Validation (6 digits, cannot start with 0)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert("⚠️ Invalid Pincode!\nMust be 6 digits and cannot start with 0.");
      return;
    }

    // 4. Address Length
    if (formData.address.length < 10) {
      alert("⚠️ Address is too short. Please enter detailed address.");
      return;
    }
    
    // Calculate Dates
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3); 

    const newOrder = {
      id: Date.now(),
      date: today.toDateString(),
      deliveryDate: deliveryDate.toDateString(),
      items: cartItems,
      total: totalAmount,
      address: formData.address,
      status: 'Shipped'
    };

    setOrders([newOrder, ...orders]);
    alert(`Order Successful! 🎉\nArriving by: ${deliveryDate.toDateString()}`);
    
    dispatch(clearCart());
    setFormData({ name: '', address: '', pincode: '', mobile: '', paymentMethod: 'cod' });
    setCurrentView('orders');
  };

  return (
    <div className="app">
      <header>
        <div className="logo" onClick={() => setCurrentView('products')}>My Shop 🛍️</div>
        <div className="nav-buttons">
          <button onClick={() => setCurrentView('orders')}>📦 Orders</button>
          <button className="cart-btn" onClick={() => setCurrentView('cart')}>
            🛒 ({totalQuantity})
          </button>
        </div>
      </header>

      <main>
        {/* VIEW 1: PRODUCTS */}
        {currentView === 'products' && (
          <>
            <div className="search-bar">
              <input 
                type="text" placeholder="Search products..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filters">
              {["All", "Electronics", "Fashion", "Home"].map(cat => (
                <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card" onClick={() => openProductDetails(product)}>
                  <div className="product-img">{product.image}</div>
                  <h3>{product.title}</h3>
                  <p>₹{product.price}</p>
                  <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }}>Add</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW 2: DETAILS */}
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
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
              <div className="empty-cart"><p>Empty!</p><button onClick={() => setCurrentView('products')}>Shop Now</button></div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span className="item-icon">{item.image}</span>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="actions">
                      <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                  </div>
                ))}
                <div className="total"><h3>Total: ₹{totalAmount}</h3><button className="checkout-btn" onClick={() => setCurrentView('checkout')}>Checkout ➡️</button></div>
              </>
            )}
          </div>
        )}

        {/* VIEW 4: CHECKOUT (With Indian Validation) */}
        {currentView === 'checkout' && (
          <div className="checkout-container">
            <h2>🚚 Delivery Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Required" />
              </div>
              <div className="form-group">
                <label>Mobile (+91)</label>
                <input type="number" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="e.g. 9800012345" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="House No, Area, Landmark..." rows="2"></textarea>
              </div>
              <div className="form-group">
                <label>Pincode (India)</label>
                <input type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 110001" />
              </div>
              <div className="summary-box"><h3>Payable: ₹{totalAmount}</h3></div>
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
                      <strong>Order ID: #{order.id.toString().slice(-4)}</strong>
                      <span className="order-price">₹{order.total}</span>
                    </div>
                    
                    <div className="delivery-tracker">
                      <div className="step completed">
                        <div className="dot">✔</div>
                        <span>Ordered<br/><small>{order.date}</small></span>
                      </div>
                      <div className="line"></div>
                      <div className="step active">
                        <div className="dot">🚚</div>
                        <span>Arriving<br/><small>{order.deliveryDate}</small></span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="mini-item">
                           {item.image} {item.title} (x{item.quantity})
                        </div>
                      ))}
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

