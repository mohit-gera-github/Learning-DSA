import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === adminPassword) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Incorrect Password');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h3>Admin Login</h3>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            required
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
