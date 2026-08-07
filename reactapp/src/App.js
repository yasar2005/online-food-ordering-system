import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerDashboard from './components/CustomerDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Invalid saved user in localStorage', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getDashboardComponent = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'CUSTOMER':
        return <CustomerDashboard user={user} onLogout={handleLogout} />;
      case 'RESTAURANT_OWNER':
        return (
          <div className="dashboard">
            <h1>Restaurant Owner Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        );
      case 'ADMIN':
        return (
          <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        );
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <Signup />} 
          />
          <Route 
            path="/dashboard" 
            element={getDashboardComponent()} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
