import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../auth.css';

const ROLES = [
  { value: 'CUSTOMER', label: '🛒 Customer' },
  { value: 'RESTAURANT_OWNER', label: '🏪 Owner' },
  { value: 'ADMIN', label: '⚙️ Admin' },
];

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const user = res.data.user;
        if (user.role !== role) {
          setError(`Role mismatch: selected ${role}, but account is ${user.role}.`);
          return;
        }
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError(res.data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Invalid credentials or backend unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fillCreds = (e, em, pw, r) => {
    e.preventDefault();
    setEmail(em); setPassword(pw); setRole(r);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-brand">
        <div className="auth-brand-logo">Foodie<span>Hub</span></div>
        <p>Order from the best restaurants near you. Fast delivery, great deals.</p>
        <div className="auth-brand-illustration">🍽️</div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-box">
          <h2>Welcome back</h2>
          <p className="auth-sub">Sign in to continue ordering</p>

          <div className="role-tabs">
            {ROLES.map(r => (
              <button key={r.value} type="button"
                className={`role-tab ${role === r.value ? 'active' : ''}`}
                onClick={() => setRole(r.value)}>
                {r.label}
              </button>
            ))}
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : `Sign in as ${ROLES.find(r => r.value === role).label}`}
            </button>
          </form>

          <div className="creds-panel">
            <h4>Quick-start credentials</h4>
            <div className="cred-row">
              <span className="cred-role">Admin</span>
              <span className="cred-info">admin@food.com / admin123</span>
              <button type="button" className="auth-switch" style={{marginTop:0}}
                onClick={e => fillCreds(e, 'admin@food.com', 'admin123', 'ADMIN')}>Fill</button>
            </div>
            <div className="cred-row">
              <span className="cred-role">Owner</span>
              <span className="cred-info">spice@owner.com / owner123</span>
              <button type="button" className="auth-switch" style={{marginTop:0}}
                onClick={e => fillCreds(e, 'spice@owner.com', 'owner123', 'RESTAURANT_OWNER')}>Fill</button>
            </div>
            <div className="cred-row">
              <span className="cred-role">Customer</span>
              <span className="cred-info">customer@food.com / customer123</span>
              <button type="button" className="auth-switch" style={{marginTop:0}}
                onClick={e => fillCreds(e, 'customer@food.com', 'customer123', 'CUSTOMER')}>Fill</button>
            </div>
          </div>

          <div className="auth-switch">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')}>Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
