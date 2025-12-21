import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './cartSlice';
import './App.css';

// 🔥 FLIPKART STYLE DATASET (40+ ITEMS)
const PRODUCTS = [
  // --- MOBILES ---
  { id: 1, title: 'Apple iPhone 15 (Black, 128 GB)', price: 72999, category: 'Mobiles', image: '📱', description: 'Dynamic Island, 48MP Main Camera, A16 Bionic chip.' },
  { id: 2, title: 'Samsung Galaxy S24 Ultra 5G', price: 129999, category: 'Mobiles', image: '📱', description: 'Titanium Grey, 200MP Camera, S-Pen, AI Features.' },
  { id: 3, title: 'Realme 12 Pro+ 5G', price: 29999, category: 'Mobiles', image: '📱', description: 'Submarine Blue, Periscope Portrait Camera, 120Hz Curved Display.' },
  { id: 4, title: 'POCO X6 Neo 5G', price: 15999, category: 'Mobiles', image: '📱', description: 'Martian Orange, AMOLED Display, 108MP Camera.' },
  { id: 5, title: 'Motorola Edge 50 Pro', price: 31999, category: 'Mobiles', image: '📱', description: 'Luxe Lavender, 125W Charging, World’s 1st Pantone Camera.' },
  { id: 6, title: 'Redmi 13C (Starshine Green)', price: 8999, category: 'Mobiles', image: '📱', description: 'Budget King. 50MP Camera, 5000mAh Battery.' },
  { id: 7, title: 'Vivo V30 Pro', price: 41999, category: 'Mobiles', image: '📱', description: 'Zeiss Optics, Aura Light Portrait, Slimmest 5G Phone.' },

  // --- ELECTRONICS ---
  { id: 10, title: 'HP Pavilion 15 Laptop', price: 65000, category: 'Electronics', image: '💻', description: 'Intel i5 12th Gen, 16GB RAM, 512GB SSD, Backlit Keyboard.' },
  { id: 11, title: 'Sony Bravia 55" 4K TV', price: 54990, category: 'Electronics', image: '📺', description: 'Google TV, X1 4K Processor, Dolby Audio.' },
  { id: 12, title: 'boAt Airdopes 161', price: 999, category: 'Electronics', image: '🎧', description: '40 Hours Playback, ASAP Charge, Bluetooth 5.3.' },
  { id: 13, title: 'Canon EOS 3000D Camera', price: 35999, category: 'Electronics', image: '📷', description: 'DSLR with 18-55mm Lens, 18MP, WiFi Support.' },
  { id: 14, title: 'Apple Watch SE (2nd Gen)', price: 28900, category: 'Electronics', image: '⌚', description: 'GPS, Health Tracking, Crash Detection, Waterproof.' },

  // --- FASHION (MEN & WOMEN) ---
  { id: 20, title: 'Men Puffer Jacket', price: 1499, category: 'Fashion', image: '🧥', description: 'Black Hooded Jacket, Waterproof, heavy winter protection.' },
  { id: 21, title: 'Nike Air Jordan High', price: 12999, category: 'Fashion', image: '👟', description: 'Premium basketball sneakers. Red and Black edition.' },
  { id: 22, title: 'Women Banarasi Saree', price: 2499, category: 'Fashion', image: '👘', description: 'Red & Gold Silk Saree, perfect for weddings.' },
  { id: 23, title: 'Ray-Ban Aviator Sunglasses', price: 5500, category: 'Fashion', image: '🕶️', description: 'Classic Gold Frame, Green Lens, 100% UV Protection.' },
  { id: 24, title: 'Puma Sports Shoes', price: 1899, category: 'Fashion', image: '👟', description: 'Navy Blue Running Shoes, Soft Foam comfort.' },
  { id: 25, title: 'Denim Jeans (Slim Fit)', price: 899, category: 'Fashion', image: '👖', description: 'Dark Blue Stretchable Denim for Men.' },
  { id: 26, title: 'Kurta Set with Dupatta', price: 1299, category: 'Fashion', image: '👗', description: 'Cotton printed suit set for daily wear.' },

  // --- HOME, KITCHEN & MEDICAL ---
  { id: 30, title: 'Dr. Morepen BP Monitor', price: 1250, category: 'Home', image: '🩺', description: 'Fully automatic digital blood pressure checking machine.' },
  { id: 31, title: 'Accu-Chek Glucometer', price: 999, category: 'Home', image: '🩸', description: 'Instant sugar check kit with 10 free strips.' },
  { id: 32, title: 'Philips Mixer Grinder', price: 3299, category: 'Home', image: '🔌', description: '750 Watt Motor, 3 Jars, Heavy duty grinding.' },
  { id: 33, title: 'Bosch Drill Machine Kit', price: 4500, category: 'Home', image: '🛠️', description: 'Professional tool kit for home repairs and drilling.' },
  { id: 34, title: 'Double BedSheet (Cotton)', price: 699, category: 'Home', image: '🛏️', description: 'King size floral print bedsheet with 2 pillow covers.' },

  // --- TOYS & FOOD ---
  { id: 40, title: 'Cadbury Celebrations Pack', price: 350, category: 'Toys', image: '🍫', description: 'Assorted chocolates gift pack for festivals.' },
  { id: 41, title: 'Ferrero Rocher (24 Pcs)', price: 949, category: 'Toys', image: '🍫', description: 'Luxury Hazelnut Chocolates.' },
  { id: 42, title: 'Remote Control Ferrari', price: 1199, category: 'Toys', image: '🏎️', description: 'Rechargeable racing car with LED lights.' },
  { id: 43, title: 'Soft Teddy Bear (4 Feet)', price: 1499, category: 'Toys', image: '🧸', description: 'Pink Giant Teddy, washable fabric, very soft.' },
  { id: 44, title: 'California Almonds (1kg)', price: 899, category: 'Toys', image: '🌰', description: 'Premium Badam Giri for health.' },
  { id: 45, title: 'Uno Card Game', price: 199, category: 'Toys', image: '🃏', description: 'Family fun card game for kids and adults.' },
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

  // --- INDIAN VALIDATION ---
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if(!formData.name || !formData.address || !formData.pincode || !formData.mobile) {
      alert("⚠️ Please fill all details!"); return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      alert("⚠️ Invalid Mobile! (Must be 10 digits starting with 6-9)"); return;
    }
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      alert("⚠️ Invalid Pincode! (Must be 6 digits)"); return;
    }
    if (formData.address.length < 10) {
      alert("⚠️ Address too short!"); return;
    }
    
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
        <div className="logo" onClick={() => setCurrentView('products')}>FlipMart 🛍️</div>
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
                type="text" placeholder="Search Mobiles, Shoes, Watch..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* NEW CATEGORY BUTTONS */}
            <div className="category-filters">
              {["All", "Mobiles", "Electronics", "Fashion", "Home", "Toys"].map(cat => (
                <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>{cat}</button>
              ))}
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card" onClick={() => openProductDetails(product)}>
                  <div className="product-img">{product.image}</div>
                  <h3>{product.title}</h3>
                  <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                  <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }}>Add to Cart</button>
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
                <h2>₹{selectedProduct.price.toLocaleString('en-IN')}</h2>
                <p className="description">{selectedProduct.description}</p>
                <div className="features-list">
                    <p>✅ 7 Days Replacement Policy</p>
                    <p>✅ Cash on Delivery Available</p>
                    <p>✅ 1 Year Brand Warranty</p>
                </div>
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
              <div className="empty-cart"><p>Cart is empty!</p><button onClick={() => setCurrentView('products')}>Start Shopping</button></div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span className="item-icon">{item.image}</span>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>₹{item.price.toLocaleString('en-IN')} x {item.quantity}</p>
                    </div>
                    <div className="actions">
                      <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                  </div>
                ))}
                <div className="total"><h3>Total: ₹{totalAmount.toLocaleString('en-IN')}</h3><button className="checkout-btn" onClick={() => setCurrentView('checkout')}>Checkout ➡️</button></div>
              </>
            )}
          </div>
        )}

        {/* VIEW 4: CHECKOUT */}
        {currentView === 'checkout' && (
          <div className="checkout-container">
            <h2>🚚 Secure Checkout</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" />
              </div>
              <div className="form-group">
                <label>Mobile (+91)</label>
                <input type="number" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="e.g. 9812345678" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="House No, Colony, City..." rows="2"></textarea>
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 800001" />
              </div>
              <div className="summary-box"><h3>Payable: ₹{totalAmount.toLocaleString('en-IN')}</h3></div>
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
                      <span className="order-price">₹{order.total.toLocaleString('en-IN')}</span>
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
                    
