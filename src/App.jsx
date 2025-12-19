import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './cartSlice';
import './App.css';

const PRODUCTS = [
  { id: 1, title: 'Super Sneakers', price: 2500, image: '👟' },
  { id: 2, title: 'Cool Headphones', price: 1500, image: '🎧' },
  { id: 3, title: 'Gaming Mouse', price: 800, image: '🖱️' },
  { id: 4, title: 'Mechanical Keyboard', price: 4500, image: '⌨️' },
  { id: 5, title: 'Smart Watch', price: 3000, image: '⌚' },
  { id: 6, title: 'Sunglasses', price: 1200, image: '🕶️' },
];

function App() {
  const [currentView, setCurrentView] = useState('products');
  
  // Form State (Payment Method added)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    mobile: '',
    paymentMethod: 'cod' // Default: Cash on Delivery
  });

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if(!formData.name || !formData.address || !formData.pincode || !formData.mobile) {
      alert("Please fill all details! 📝");
      return;
    }
    
    // Payment Method Check
    let paymentMsg = formData.paymentMethod === 'cod' 
      ? '💵 Payment: Cash on Delivery' 
      : `💳 Payment: Paid via ${formData.paymentMethod.toUpperCase()}`;

    alert(`Order Successful! 🎉\n\n${paymentMsg}\nDelivering to: ${formData.name}`);
    
    dispatch(clearCart());
    setFormData({ name: '', address: '', pincode: '', mobile: '', paymentMethod: 'cod' });
    setCurrentView('products');
  };

  return (
    <div className="app">
      <header>
        <h1 onClick={() => setCurrentView('products')} style={{cursor:'pointer'}}>My Redux Shop</h1>
        <button className="cart-btn" onClick={() => setCurrentView('cart')}>
          🛒 Cart ({totalQuantity})
        </button>
      </header>

      <main>
        {/* VIEW 1: PRODUCT LIST */}
        {currentView === 'products' && (
          <div className="products-grid">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-img">{product.image}</div>
                <h3>{product.title}</h3>
                <p>₹{product.price}</p>
                <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: CART */}
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
                  <div key={item.id} className="cart-item">
                    <span className="item-icon">{item.image}</span>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>₹{item.price}</p>
                    </div>
                    <div className="actions">
                      <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                  </div>
                ))}
                <div className="total">
                  <h3>Total: ₹{totalAmount}</h3>
                  <button className="checkout-btn" onClick={() => setCurrentView('checkout')}>
                    Proceed to Checkout ➡️
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW 3: CHECKOUT FORM + PAYMENT */}
        {currentView === 'checkout' && (
          <div className="checkout-container">
            <h2>🚚 Delivery & Payment</h2>
            <form onSubmit={handlePlaceOrder}>
              
              {/* Address Section */}
              <div className="form-section">
                <h3>📍 Address Details</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="number" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10-digit mobile" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full address here..." rows="2"></textarea>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 803101" />
                </div>
              </div>

              {/* Payment Section (NEW) */}
              <div className="form-section">
                <h3>💳 Payment Method</h3>
                <div className="payment-options">
                  
                  <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi" 
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange} 
                    />
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                  </label>

                  <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange} 
                    />
                    <span>Credit / Debit Card</span>
                  </label>

                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange} 
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>

                </div>
              </div>

              <div className="summary-box">
                <p>Items Total: <strong>₹{totalAmount}</strong></p>
                <p>Delivery: <strong style={{color:'green'}}>FREE</strong></p>
                <hr/>
                <h3>Payable Amount: ₹{totalAmount}</h3>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => setCurrentView('cart')}>Back</button>
                <button type="submit" className="confirm-btn">
                  {formData.paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'} ✅
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;

