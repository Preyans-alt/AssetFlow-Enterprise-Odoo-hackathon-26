import React, { useState } from 'react';
import { Hexagon, LogIn } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Login = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(email)) {
      setError('Invalid email. Try admin@assetflow.com or priya@assetflow.com');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="flex-center" style={{ flexDirection: 'column', marginBottom: 'var(--space-xl)' }}>
          <Hexagon size={48} className="sidebar-logo-icon" />
          <h2 className="text-gradient" style={{ marginTop: 'var(--space-sm)' }}>AssetFlow</h2>
          <p className="page-subtitle">Enterprise Asset Management</p>
        </div>

        {error && (
          <div className="badge-danger" style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@assetflow.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              defaultValue="password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
