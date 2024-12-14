import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const laptops = [
  {
    id: 1,
    model: "Dell XPS 13 Plus Core i5-1340P, 8GB RAM, 512GB SSD, Intel UHD graphics",
    price: 999,
    image: "XPS.jpeg",
  },
  {
    id: 2,
    model: "Lenovo LOQ i7 15IRH8 NVIDIA GeForce RTX 4050-15.6 FHD - 144Hz - 16GB RAM - 1TB SSD",
    price: 1299,
    image: "LOQ.jpg",
  },
  {
    id: 3,
    model: "HP Pavilion 13.3 FHD. Intel core i3, 8GB RAM",
    price: 699,
    image: "HP.jpeg",
  },
  {
    id: 4,
    model: "Lenovo ThinkPad X1 Carbon Intel Core i7, 8GB RAM, 256GB SSD",
    price: 759,
    image: "thinkpad.jpg",
  },
];

const Products = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Add to Cart
  const addToCart = (laptop) => {
    const existingItem = cart.find((item) => item.id === laptop.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === laptop.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...laptop, quantity: 1 }]);
    }
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Save cart to localStorage before navigating to checkout
  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout");
  };

  return (
    <div className="products-container">
      <div className="header">
        <img src="logo.png" alt="Logo" className="logo" />
        <h1>Available Laptops</h1>
        <button onClick={handleCheckout} className="checkout-button">
          Checkout
        </button>
      </div>
      <div className="products-grid">
        {laptops.map((laptop) => (
          <div key={laptop.id} className="product-card">
            <img src={laptop.image} alt={laptop.model} className="product-image" />
            <h2>{laptop.model}</h2>
            <p className="product-price">${laptop.price}</p>
            <button onClick={() => addToCart(laptop)} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="cart-section">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.model}</span>
                  <span className="item-price">${item.price}</span>
                </div>
                <div className="item-quantity">
                  <span>Qty: {item.quantity}</span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
