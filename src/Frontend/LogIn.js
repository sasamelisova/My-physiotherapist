import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        try {
            const response = await axios.post(`${baseURL}/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username); // Storing username if needed for further requests
            navigate('/dashboard');
        } catch (error) {
            setLoading(false);
            const errorMsg = error.response ? error.response.data : 'No response from server';
            setError('Login Failed: ' + errorMsg);
        }
    };

    return (
        <div>
            <h1>Log in</h1>
            <form  onSubmit={handleSubmit}>
                <input className='log_in' type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input className='log_in' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button className='log_in' type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;












