import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AppNavbar } from '@/components/AppNavbar';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <AppNavbar />

      {/* Main content */}
      <main className="flex-1 p-8 mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! You have 3 pending tickets to review.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Open Tickets</p>
              <span className="text-3xl font-bold">12</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Avg Response Time</p>
              <span className="text-3xl font-bold">2.4h</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Urgent</p>
              <span className="text-3xl font-bold text-destructive">3</span>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};
