import React from 'react';
import { useNavigate } from 'react-router';
import { useSession, signOut } from '../lib/auth-client';

export const Home: React.FC = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate('/login');
        },
      },
    });
  };

  return (
    <div className="app-layout">
      <nav className="glass-nav">
        <div className="nav-brand">
          <div className="brand-dot"></div>
          <h2>Helphesk</h2>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{session?.user?.name || 'Agent'}</span>
            <span className="user-role badge">
              {/* @ts-ignore: role is legally an additionalField not yet patched in client types */}
              {session?.user?.role || 'Agent'}
            </span>
          </div>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="main-content container glass-panel">
        <header className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back! You have 3 pending tickets to review.</p>
        </header>

        <section className="dashboard-grid">
          {/* We will build the ticket UI later, putting a placeholder here */}
          <div className="metric-card glass-panel">
            <h3>Open Tickets</h3>
            <span className="metric-value">12</span>
          </div>
          <div className="metric-card glass-panel">
            <h3>Avg Response Time</h3>
            <span className="metric-value">2.4h</span>
          </div>
          <div className="metric-card glass-panel highlight-border">
            <h3>Urgent</h3>
            <span className="metric-value warning">3</span>
          </div>
        </section>
      </main>
    </div>
  );
};
