import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name: name.trim(), email: email.trim(), password });
      if (res.data.success) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-brand">
        <div className="auth-brand-logo">Foodie<span>Hub</span></div>
        <p>Join thousands of food lovers. Sign up and start ordering in minutes.</p>
        <div className="auth-brand-illustration">🍕</div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-box">
          <h2>Create account</h2>
          <p className="auth-sub">It's free and takes less than a minute</p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="Min. 6 characters" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
