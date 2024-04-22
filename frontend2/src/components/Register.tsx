import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/register.css"

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('http://localhost:6969/api/users/register', {
                username,
                password
            });

            setMessage('Registration successful');
            alert("Registration successful")
            navigate('/login')
            console.log(response.data); 

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message?: string }>;
                if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                    setMessage('Registration failed: ' + axiosError.response.data.message);
                } else {
                    setMessage('Registration failed. Please try again later.');
                    console.error(axiosError);
                }
            } else {
                setMessage('Registration failed. Please try again later.');
                console.error(error);
            }
        }
    };

    return (
        <div className="register-page">
        <div className="container">
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Signup</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username"
                        value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirm-password" placeholder="Re-enter your password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <button type="submit">Sign Up</button>
                </div>
                <div className="form-group signup-link">
                    Already have an account? <a href="#" onClick={() => navigate("/login")}>Login</a>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    </div>
    );
}

export default Register;
