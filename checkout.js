import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

const Checkout = ({ userId }) => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/${userId}`);
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter your address.");
      return;
    }

    const response = await fetch("/order/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, address, paymentMethod }),
    });

    if (response.ok) {
      alert("Order placed successfully!");
      navigate("/products");
    } else {
      alert("Failed to place order.");
    }
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {cart.length > 0 ? (
        <div>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.product_id} className="cart-item">
                <span>{item.model}</span>
                <span>
                  {item.quantity} x ${item.price}
                </span>
              </li>
            ))}
          </ul>
          <h3>Total: ${calculateTotal()}</h3>
          <div className="address-section">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="payment-section">
            <label>Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <button onClick={handlePlaceOrder} className="place-order-button">
            Place Order
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Checkout;
