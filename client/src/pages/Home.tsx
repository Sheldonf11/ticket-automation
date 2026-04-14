import React from 'react';
import { useNavigate } from 'react-router';
import { useSession, signOut } from '../lib/auth-client';

export const Home: React.FC = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => navigate('/login'),
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex items-center justify-between p-4 px-8 bg-panel-bg backdrop-blur-md border-b border-panel-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[linear-gradient(135deg,#a853ba,#e92a67)] shadow-[0_0_10px_rgba(233,42,103,0.5)]"></div>
          <h2 className="text-xl font-bold tracking-tight">Helphesk</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-medium">{session?.user?.name || 'Agent'}</span>
            <span className="bg-[#5e6ad233] text-[#a4affb] px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#5e6ad24d]">
              {/* @ts-ignore: role is legally an additionalField not yet patched in client types */}
              {session?.user?.role || 'Agent'}
            </span>
          </div>
          <button onClick={handleSignOut} className="bg-transparent text-text-muted border border-panel-border px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:bg-white/5 hover:text-text-main hover:border-white/20">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-1 p-12 my-8 mx-auto w-full max-w-[1200px] rounded-[24px] bg-panel-bg backdrop-blur-md border border-panel-border shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <header className="mb-10">
          <h1 className="text-[2.25rem] font-semibold tracking-tight mb-2">Dashboard</h1>
          <p className="text-text-muted">Welcome back! You have 3 pending tickets to review.</p>
        </header>

        <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          <div className="p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 bg-panel-bg backdrop-blur-md border border-panel-border shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h3 className="text-[0.95rem] text-text-muted font-medium tracking-tight">Open Tickets</h3>
            <span className="text-[2.5rem] font-bold">12</span>
          </div>
          <div className="p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 bg-panel-bg backdrop-blur-md border border-panel-border shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h3 className="text-[0.95rem] text-text-muted font-medium tracking-tight">Avg Response Time</h3>
            <span className="text-[2.5rem] font-bold">2.4h</span>
          </div>
          <div className="p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-0.5 bg-panel-bg backdrop-blur-md border border-error/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h3 className="text-[0.95rem] text-text-muted font-medium tracking-tight">Urgent</h3>
            <span className="text-[2.5rem] font-bold text-error drop-shadow-[0_0_15px_rgba(248,81,73,0.4)]">3</span>
          </div>
        </section>
      </main>
    </div>
  );
};
