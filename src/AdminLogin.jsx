import { useState, useRef, useEffect } from 'react';
import './Admin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate password by checking with backend
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${BACKEND_URL}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid password');
        setPassword('');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('adminToken', data.token || 'authenticated');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      onLoginSuccess();
    } catch (err) {
      setError('Failed to authenticate: ' + err.message);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Admin Access</h1>
          <p>Enter password to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              ref={passwordInputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              disabled={isLoading}
              autoComplete="current-password"
              className="password-input"
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="login-submit-btn"
          >
            {isLoading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <button
            className="back-to-chat-btn"
            onClick={() => { window.location.href = '/#/'; }}
            title="Back to chat"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
}
