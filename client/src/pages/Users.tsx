import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppNavbar } from '@/components/AppNavbar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

type UsersResponse = {
  users: User[];
};

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchUsers = async () => {
  const response = await axios.get<UsersResponse>(`${apiBaseUrl}/api/users`, {
    withCredentials: true,
  });

  return response.data.users;
};

export function Users() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <AppNavbar />

      <main className="flex-1 p-8 mx-auto w-full max-w-6xl">
        <header>
          <h1 className="text-2xl font-bold mb-6">Users</h1>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Unable to load users.'}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && (
          <div className="rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'Unknown'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
