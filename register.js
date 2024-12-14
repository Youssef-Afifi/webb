import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./registerCSS.css";

const RegistrationAndLogin = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); 

  // Handle registration form submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
      console.log("Registered Data:", registerData);
      alert("Registration successful!");
      navigate("/products"); 
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
      console.log("Login Data:", loginData);
      alert("Login successful!");
      navigate("/products"); // Redirect to Products page
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="header">
        <img src="Logo.png" alt="Logo" className="logo" />
        <h1 className="site-name">LIGHTNING</h1>
      </div>

      <div className="form-container">
        {isLogin ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            {error && <span className="error">{error}</span>}
            <button type="submit" className="submit-btn">
              Login
            </button>
            <p onClick={() => setIsLogin(false)} className="toggle-form-link">
              Don't have an account? Register here
            </p>
            {}
            <button
              type="button"
              className="guest-btn"
              onClick={() => navigate("/products")}
            >
              Continue as Guest
            </button>
          </form>
        ) : (
          <form className="registration-form" onSubmit={handleRegisterSubmit}>
            <h2>Sign Up</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
              {error && <span className="error">{error}</span>}
            </div>
            <button type="submit" className="submit-btn">
              Register
            </button>
            <p onClick={() => setIsLogin(true)} className="toggle-form-link">
              Already have an account? Login here
            </p>
            {}
            <button
              type="button"
              className="guest-btn"
              onClick={() => navigate("/products")}
            >
              Continue as Guest
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationAndLogin;
