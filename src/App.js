import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './Frontend/SignUp.js'; // Changed to relative path
import Login from './Frontend/LogIn.js'; // Changed to relative path
import Logout from './Frontend/LogOut.js'; // Changed to relative path
import Dashboard from './Frontend/Dashboard'; // Changed to relative path
import ProtectedRoute from '/Users/v450/myphysiotherapist/src/auth/ProtectedRoute.js';
import History from './Frontend/History.js'; // Changed to relative path
import axios from 'axios';


const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [therapyHistory, setTherapyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Added state for error handling

  useEffect(() => {
    const fetchTherapyHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/history`);
        setTherapyHistory(response.data);
      } catch (error) {
        console.error('Error fetching therapy history:', error);
        setError('Failed to fetch history. Please try again later.'); // Set error message
      }
      setLoading(false);
    };

    fetchTherapyHistory();
  }, []);

  return (
    <Router>
      

      <div>
        <nav className='nav'>
        <div className="nav-header">
                <h3><Link to="/" className="nav-title">My Physiotherapist</Link></h3> 
            </div>
            <h3><Link to="/signup" className="nav-link">Sign Up</Link></h3>
            <h3><Link to="/login" className="nav-link">Login</Link></h3>
            <h3><Link to="/logout" className="nav-link">Logout</Link></h3>
            <h3><Link to="/history" className="nav-link">History</Link></h3>
        </nav>
        <h1>Welcome to My Physiotherapist</h1>
      <p>My Physiotherapist is an app that guides you through the basic rehabilitation process.
        You can save your exercise data and track your pain intensity over time.</p>

        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/history" element={<History history={therapyHistory} loading={loading} error={error} />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



