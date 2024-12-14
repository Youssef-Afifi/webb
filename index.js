import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import RegistrationAndLogin from './register.js';
import Products from './Products.js';
import Checkout from './checkout.js';


export const UserContext = createContext();

const App = () => {
  const [userId, setUserId] = useState(null); 

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <Router>
        <Routes>
          {/* Default route (Registration and Login) */}
          <Route path="/" element={<RegistrationAndLogin />} />

          {/* Products route */}
          <Route path="/products" element={<Products />} />

          {/* Checkout route (protected, requires userId) */}
          <Route
            path="/checkout"
            element={userId ? <Checkout userId={userId} /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

