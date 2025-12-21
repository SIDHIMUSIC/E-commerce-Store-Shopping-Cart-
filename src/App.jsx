import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './cartSlice';
import './App.css';
// 🔥 MEGA STORE DATA (60+ Items)
const PRODUCTS = [
  // --- MOBILES (10 Items) ---
  { id: 1, title: 'Apple iPhone 15 Pro Max', price: 159900, category: 'Mobiles', image: '📱', description: 'Natural Titanium, 256GB, A17 Pro Chip.' },
  { id: 2, title: 'Samsung Galaxy S24 Ultra', price: 129999, category: 'Mobiles', image: '📱', description: 'AI Phone, 200MP Camera, S-Pen included.' },
  { id: 3, title: 'OnePlus 12 (Flowy Emerald)', price: 64999, category: 'Mobiles', image: '📱', description: '16GB RAM, Snapdragon 8 Gen 3, Hasselblad Camera.' },
  { id: 4, title: 'Pixel 8 Pro', price: 98999, category: 'Mobiles', image: '📱', description: 'Google AI, Best Camera for photos, Obsidian Black.' },
  { id: 5, title: 'Nothing Phone (2a)', price: 23999, category: 'Mobiles', image: '📱', description: 'Transparent Design, Glyph Interface, Clean Android.' },
  { id: 6, title: 'Redmi Note 13 Pro+', price: 29999, category: 'Mobiles', image: '📱', description: '200MP Camera, 120W Charging, Curved Display.' },
  { id: 7, title: 'Realme 12 Pro 5G', price: 24999, category: 'Mobiles', image: '📱', description: 'Submarine Blue, Portrait Master Camera.' },
  { id: 8, title: 'Poco X6 Neo', price: 15999, category: 'Mobiles', image: '📱', description: 'Super Slim, AMOLED Display, 5000mAh Battery.' },
  { id: 9, title: 'Moto Edge 50 Fusion', price: 22999, category: 'Mobiles', image: '📱', description: 'Pantone Color, IP68 Waterproof, Curved Screen.' },
  { id: 10, title: 'Vivo V30 Pro', price: 41999, category: 'Mobiles', image: '📱', description: 'Zeiss Optics, Aura Light, Best for Portraits.' },

  // --- ELECTRONICS & LAPTOPS (10 Items) ---
  { id: 11, title: 'MacBook Air M2', price: 99900, category: 'Electronics', image: '💻', description: 'Super fast M2 chip, 13.6 inch Liquid Retina Display.' },
  { id: 12, title: 'HP Pavilion 15', price: 65000, category: 'Electronics', image: '💻', description: 'Intel i5 12th Gen, 16GB RAM, Backlit Keyboard.' },
  { id: 13, title: 'Sony PlayStation 5 (Slim)', price: 49990, category: 'Electronics', image: '🎮', description: '4K Gaming, 1TB SSD, DualSense Controller.' },
  { id: 14, title: 'iPad Air 5th Gen', price: 54900, category: 'Electronics', image: '📟', description: 'M1 Chip, 10.9 inch Display, Blue Color.' },
  { id: 15, title: 'Sony WH-1000XM5', price: 29990, category: 'Electronics', image: '🎧', description: 'Best Noise Cancelling Headphones, 30Hr Battery.' },
  { id: 16, title: 'JBL Flip 6 Speaker', price: 9999, category: 'Electronics', image: '🔊', description: 'Powerful Bass, Waterproof Bluetooth Speaker.' },
  { id: 17, title: 'GoPro Hero 12 Black', price: 39990, category: 'Electronics', image: '📷', description: '5.3K Video, Waterproof, HyperSmooth Stabilization.' },
  { id: 18, title: 'Apple Watch Series 9', price: 41900, category: 'Electronics', image: '⌚', description: 'S9 SiP, Double Tap Gesture, ECG & Blood Oxygen.' },
  { id: 19, title: 'Logitech MX Master 3S', price: 8995, category: 'Electronics', image: '🖱️', description: 'Ultimate Productivity Mouse, Silent Clicks.' },
  { id: 20, title: 'Canon EOS 200D II', price: 56995, category: 'Electronics', image: '📷', description: 'DSLR Camera with 18-55mm Lens, 4K Recording.' },

  // --- FASHION & SHOES (10 Items) ---
  { id: 21, title: 'Nike Air Jordan 1 High', price: 16995, category: 'Fashion', image: '👟', description: 'Lost & Found Chicago Colorway. Premium Sneaker.' },
  { id: 22, title: 'Adidas Ultraboost Light', price: 14999, category: 'Fashion', image: '👟', description: 'Best running shoes, maximum energy return.' },
  { id: 23, title: 'Puma Ferrari Drift Cat', price: 7999, category: 'Fashion', image: '👟', description: 'Motorsport shoes, sleek red design.' },
  { id: 24, title: 'Zara Men Denim Jacket', price: 3990, category: 'Fashion', image: '🧥', description: 'Classic blue denim jacket with rips.' },
  { id: 25, title: 'Ray-Ban Aviator Gold', price: 6590, category: 'Fashion', image: '🕶️', description: 'Classic green lens, gold frame sunglasses.' },
  { id: 26, title: 'Casio G-Shock GA-2100', price: 8995, category: 'Fashion', image: '⌚', description: 'Carbon Core Guard, "CasiOak" All Black.' },
  { id: 27, title: 'Levi\'s 511 Slim Jeans', price: 2499, category: 'Fashion', image: '👖', description: 'Stretchable dark blue denim for men.' },
  { id: 28, title: 'Manyavar Kurta Set', price: 4999, category: 'Fashion', image: '👘', description: 'Silk Blend Kurta Pajama for weddings.' },
  { id: 29, title: 'Women Banarasi Saree', price: 3499, category: 'Fashion', image: '🥻', description: 'Pure silk red saree with zari work.' },
  { id: 30, title: 'Woodland Leather Boots', price: 3995, category: 'Fashion', image: '👢', description: 'Camel color tough outdoor boots.' },

  // --- HOME & KITCHEN (10 Items) ---
  { id: 31, title: 'Philips Air Fryer', price: 8999, category: 'Home', image: '🍟', description: 'Fry with 90% less oil. Digital Touch Panel.' },
  { id: 32, title: 'Dyson V8 Vacuum Cleaner', price: 32900, category: 'Home', image: '🧹', description: 'Cord-free powerful suction for home cleaning.' },
  { id: 33, title: 'Godrej 1.5 Ton AC', price: 34990, category: 'Home', image: '❄️', description: '5 Star Inverter Split AC, Heavy Duty Cooling.' },
  { id: 34, title: 'LG Microwave Oven', price: 12990, category: 'Home', image: '🥘', description: 'Convection oven for baking and grilling.' },
  { id: 35, title: 'Milton Water Bottle Set', price: 999, category: 'Home', image: '🧴', description: 'Pack of 3 Thermosteel bottles, keeps water cold.' },
  { id: 36, title: 'Prestige Gas Stove', price: 4500, category: 'Home', image: '🔥', description: '3 Burner Glass Top Gas Stove.' },
  { id: 37, title: 'Bosch Washing Machine', price: 28990, category: 'Home', image: '🧺', description: '7kg Front Load, Fully Automatic.' },
  { id: 38, title: 'Kent RO Water Purifier', price: 15500, category: 'Home', image: '💧', description: 'RO + UV + UF + TDS Control.' },
  { id: 39, title: 'Sleepwell Mattress', price: 12000, category: 'Home', image: '🛏️', description: 'Queen Size Orthopedic Memory Foam Mattress.' },
  { id: 40, title: 'Philips Smart Bulb', price: 699, category: 'Home', image: '💡', description: 'Wi-Fi enabled, 16 Million Colors LED.' },

  // --- BEAUTY & GROOMING (5 Items) ---
  { id: 41, title: 'Philips OneBlade Trimmer', price: 1499, category: 'Medical', image: '✂️', description: 'Hybrid Trimmer and Shaver for Men.' },
  { id: 42, title: 'L\'Oreal Paris Serum', price: 499, category: 'Medical', image: '🧴', description: 'Hyaluronic Acid Serum for glowing skin.' },
  { id: 43, title: 'Dyson Airwrap Styler', price: 45900, category: 'Medical', image: '💇‍♀️', description: 'Hair styling without extreme heat.' },
  { id: 44, title: 'Nivea Men Grooming Kit', price: 850, category: 'Medical', image: '🧼', description: 'Face wash, Deodorant, Shaving Foam set.' },
  { id: 45, title: 'Maybelline Lipstick Set', price: 999, category: 'Medical', image: '💄', description: 'Pack of 4 Matte Lipsticks.' },

  // --- MEDICAL & HEALTH (5 Items) ---
  { id: 46, title: 'Omron BP Monitor', price: 2100, category: 'Medical', image: '🩺', description: 'Accurate Blood Pressure checking machine.' },
  { id: 47, title: 'Accu-Chek Active', price: 1050, category: 'Medical', image: '🩸', description: 'Glucometer for sugar test with 50 strips.' },
  { id: 48, title: 'Dr. Ortho Back Support', price: 599, category: 'Medical', image: '🦴', description: 'Orthopedic Lumbar Support Belt.' },
  { id: 49, title: 'Protein Powder (ON)', price: 3200, category: 'Medical', image: '💪', description: 'Optimum Nutrition Gold Standard Whey 1kg.' },
  { id: 50, title: 'Digital Weight Machine', price: 799, category: 'Medical', image: '⚖️', description: 'Glass top digital weighing scale.' },

  // --- TOYS & GAMING (6 Items) ---
  { id: 51, title: 'LEGO Ferrari Car', price: 2999, category: 'Toys', image: '🏎️', description: 'Technic series building block car kit.' },
  { id: 52, title: 'Barbie Dream House', price: 4500, category: 'Toys', image: '🏰', description: 'Large dollhouse with accessories.' },
  { id: 53, title: 'Hot Wheels 10 Pack', price: 1299, category: 'Toys', image: '🚗', description: 'Set of 10 die-cast racing cars.' },
  { id: 54, title: 'Remote Control Drone', price: 5999, category: 'Toys', image: '🚁', description: 'HD Camera drone with 20 mins flight time.' },
  { id: 55, title: 'Giant Teddy Bear (5ft)', price: 1899, category: 'Toys', image: '🧸', description: 'Very soft pink teddy bear, washable.' },
  { id: 56, title: 'Uno Flip Card Game', price: 299, category: 'Toys', image: '🃏', description: 'Double sided Uno cards for extra fun.' },

  // --- FOOD & CHOCOLATES (5 Items) ---
  { id: 60, title: 'Ferrero Rocher (24pcs)', price: 999, category: 'Food', image: '🍫', description: 'Premium hazelnut chocolates box.' },
  { id: 61, title: 'Lindt Dark Chocolate', price: 450, category: 'Food', image: '🍫', description: '85% Cocoa Dark Chocolate bar.' },
  { id: 62, title: 'Davidoff Coffee', price: 550, category: 'Food', image: '☕', description: 'Rich Aroma Instant Coffee 100g.' },
  { id: 63, title: 'Happilo Almonds (500g)', price: 499, category: 'Food', image: '🌰', description: 'California almonds, 100% natural.' },
  { id: 64, title: 'Nutella Spread (750g)', price: 720, category: 'Food', image: '🍯', description: 'Hazelnut cocoa spread family pack.' },
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
                    
