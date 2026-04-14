import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { signIn, useSession } from '../lib/auth-client';

export const Login: React.FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already signed in, declarative navigation handles the route automatically
  // This solves race conditions between the SPA router and the auth-client cache update
  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          // Component will re-render and navigate declaratively via the `if (session)` check
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || 'Login failed. Please check your credentials.');
        },
      }
    );
  };

  return (
    <div className="auth-layout">
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to manage your tickets securely</p>
        
        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@helphesk.com"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="primary-button glowing-btn">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
