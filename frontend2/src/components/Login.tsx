import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 

interface LoginProps {
    onLoginSuccess?: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setMessage("Already logged in");
      setIsLoggedIn(true);
      navigate("/browse"); 
    }
  }, [navigate]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await axios.post('http://localhost:6969/api/users/login', {
        username,
        password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
        setMessage("Login successful");
        // if (onLoginSuccess) {
        //   onLoginSuccess(username);
        // }
        navigate("/home");
      } else {
        setMessage("Login failed: Incorrect username or password");
      }
    } catch (error: any) {
      setMessage("Login failed: An unexpected error occurred");
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setMessage("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username"
                 value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password"
                 value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
        {message && <p className="login-message">{message}</p>}
        <div className="form-group signup-link">
          Don't have an account? <a href="#" onClick={() => navigate("/register")}>Sign up</a>
        </div>
      </form>
      {isLoggedIn && <button onClick={handleLogout}>Log Out</button>}
    </div>
  );
}

export default Login;
