import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [painLocation, setPainLocation] = useState('knee');  // Default value is 'knee'
    const [painIntensity, setPainIntensity] = useState(0);  // Default value is 0

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit behavior

        const userData = {
            username,
            password,
            painLocation,
            painIntensity
        };

        try {
            // Making a POST request to your server endpoint
            const response = await axios.post('http://localhost:5000/signup', userData);
            alert('Signup Successful'); // Alerting the user on successful registration
            console.log('Server Response:', response.data);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert('Signup Failed: ' + error.response.data);
                console.error('Signup Error:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                alert('Signup Failed: No response from the server');
                console.error('No response:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Signup Failed: ' + error.message);
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label className='sign_up'>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <label className='sign_up'>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <label className='sign_up'>
                    Pain Location:
                    <select className='sign_up' value={painLocation} onChange={e => setPainLocation(e.target.value)}>
                        <option value="knee">Knee</option>
                        <option value="shoulder">Shoulder</option>
                        <option value="back">Back</option>
                    </select>
                </label>
                <br/>
                <label className='sign_up'>
                    Pain Intensity (0-10):
                    <input className='sign_up'
                        type="number"
                        value={painIntensity}
                        onChange={e => setPainIntensity(parseInt(e.target.value, 10))}
                        min="0"
                        max="10"
                        required
                    />
                </label>
                <br/>
                <button className='sign_up' type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;


