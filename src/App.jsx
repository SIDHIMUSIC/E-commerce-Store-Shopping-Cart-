import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from './cartSlice';
import './App.css';

// Nakli Products ka Data
const PRODUCTS = [
  { id: 1, title: 'Super Sneakers', price: 2500, image: '👟' },
  { id: 2, title: 'Cool Headphones', price: 1500, image: '🎧' },
  { id: 3, title: 'Gaming Mouse', price: 800, image: '🖱️' },
  { id: 4, title: 'Mechanical Keyboard', price: 4500, image: '⌨️' },
  { id: 5, title: 'Smart Watch', price: 3000, image: '⌚' },
  { id: 6, title: 'Sunglasses', price: 1200, image: '🕶️' },
];

function App() {
  const [showCart, setShowCart] = useState(false);
  
  // Redux se data nikalna
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  
  const dispatch = useDispatch();

  return (
    <div className="app">
      {/* Header / Navbar */}
      <header>
        <h1>My Redux Shop</h1>
        <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({totalQuantity})
        </button>
      </header>

      {/* Main Content */}
      <main>
        {showCart ? (
          // --- CART VIEW ---
          <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>Cart is empty! 😢</p> : null}
            
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

            {cartItems.length > 0 && (
              <div className="total">
                <h3>Total: ₹{totalAmount}</h3>
                <button className="checkout-btn" onClick={() => alert('Order Placed! 🥳')}>Checkout</button>
              </div>
            )}
          </div>
        ) : (
          // --- PRODUCT LIST VIEW ---
          <div className="products-grid">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-img">{product.image}</div>
                <h3>{product.title}</h3>
                <p>₹{product.price}</p>
                <button onClick={() => dispatch(addToCart(product))}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
