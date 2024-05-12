import React from 'react';

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('You are now logged out');
    };

    return (
        <div>
            <h1>Do you really want to log out?</h1>
            <button className='logout_button' onClick={handleLogout}>Logout</button>
        </div>
        
    );
}

export default Logout;
