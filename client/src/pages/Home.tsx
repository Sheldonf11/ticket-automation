import React from 'react';
import { useNavigate } from 'react-router';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-muted">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-14 bg-background border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">H</span>
          </div>
          <h2 className="text-base font-semibold tracking-tight">Helphesk</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{session?.user?.name || 'Agent'}</span>
            <Badge variant="secondary" className="uppercase tracking-wider">
              {/* @ts-ignore: role is legally an additionalField not yet patched in client types */}
              {session?.user?.role || 'Agent'}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="size-3.5" />
            Sign Out
          </Button>
        </div>
      </nav>

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
