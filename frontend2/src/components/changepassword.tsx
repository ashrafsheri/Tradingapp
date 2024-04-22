import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "../styles/changepassword.css";

interface FormData {
  username: string | null;
  oldPassword: string;
  newPassword: string;
}

const ChangePassword: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn); 

    if (!loggedIn) {
      console.log("No token found, redirecting to login...");
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    username: username,
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6969/api/users/change-password",
        formData
      );
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error: any) { 
      setMessage(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <div className="change-password-container">
      {isLoggedIn ? (
        <>
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="username" value={username || ''} />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              defaultValue={username || ''}
              disabled
            />

            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />

            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">Change Password</button>
          </form>
          {message && <p>{message}</p>}
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
};

export default ChangePassword;
