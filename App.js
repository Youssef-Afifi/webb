import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import RegisterPage from "./register.js";
import Products from "./Products";
import Checkout from "./checkout";

export const UserContext = createContext();

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <Router>
        <div className="App">
          {/* Navigation Bar */}
          <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            {userId ? (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/checkout">Checkout</Link>
              </>
            ) : (
              <Link to="/register">Register/Login</Link>
            )}
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/cart"
              element={
                userId ? <Cart userId={userId} /> : <Navigate to="/register" replace />
              }
            />
            <Route
              path="/checkout"
              element={
                userId ? <Checkout userId={userId} /> : <Navigate to="/register" replace />
              }
            />
            <Route path="*" element={<NotFound />} /> {/* Fallback for invalid routes */}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

// Not Found Component
const NotFound = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

// Placeholder Cart Component
const Cart = ({ userId }) => {
  return (
    <div>
      <h2>Your Cart</h2>
      <p>This is the cart page for user ID: {userId}</p>
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
};

export default App;
