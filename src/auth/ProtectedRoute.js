import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Function to check if the token is expired
    const isTokenExpired = (token) => {
        try {
            const { exp } = jwtDecode(token);
            console.log('Token expiration:', exp); // Log decoded expiration timestamp
            if (!exp) {
                return false;  // If there's no expiration field, assume non-expiring token
            }
            return Date.now() >= exp * 1000;  // Check if current date is greater than exp
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Treat decoding errors as expired tokens
        }
    };

    // Check for authentication token and its expiry
    if (!token || isTokenExpired(token)) {
        // Optionally clear the invalid or expired token from storage
        localStorage.removeItem('token');
        return <Navigate to="/login" state={{ from: "expired" }} />; // Inform login about the reason for redirection
    }

    return children;
};

export default ProtectedRoute;








