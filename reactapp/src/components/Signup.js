import React, { useState } from 'react';
import axios from 'axios';
import '../auth.css';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password
      });
      
      if (response.data.success) {
        setSuccess(`Account created successfully! Use email: ${email} and your password to login.`);
      }
    } catch (err) {
      console.error('Signup failed', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Cannot reach backend at http://localhost:8080. Start the Spring app and refresh this page.');
      } else {
        setError('Unable to create account right now');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="auth-container">
        <h2>Sign Up</h2>
        <p className="subtitle">or login to your account</p>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <p>Already have an account? <button onClick={() => window.location.href = '/login'}>Login</button></p>
      </div>
    </div>
  );
};

export default Signup;
