import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

const Landing: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {

        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true); 
    };

    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div>
            <h1>Welcome to Our Site!</h1>
            <Login onLoginSuccess={handleLoginSuccess} />
            <Register />
        </div>
    );
}

export default Landing;
