import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { LogOut, Users } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AppNavbar: React.FC = () => {
  const { data: session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => navigate('/login'),
      },
    });
  };

  return (
    <nav className="flex items-center justify-between px-8 h-14 bg-background border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">H</span>
          </div>
          <h2 className="text-base font-semibold tracking-tight">Helphesk</h2>
        </Link>
        {userRole === 'admin' && (
          <Link
            to="/users"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
              location.pathname === '/users' && 'text-foreground',
            )}
          >
            <Users className="size-3.5" />
            Users
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{session?.user?.name || 'Agent'}</span>
          <Badge variant="secondary" className="uppercase tracking-wider">
            {userRole || 'Agent'}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="size-3.5" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
};
