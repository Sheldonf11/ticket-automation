import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { CreateUserForm } from '@/components/CreateUserForm';
import { UsersTable } from '@/components/UsersTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';




export function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <AppNavbar />

      <main className="flex-1 p-8 mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="size-4" />
            New User
          </Button>
        </header>

        <UsersTable />
      </main>

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      >
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b bg-muted/40 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                <UserPlus className="size-4" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base">Create user</DialogTitle>
                <DialogDescription className="mt-1">
                  Add a new agent account with email and password access.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <CreateUserForm
            onSuccess={() => setIsCreateModalOpen(false)}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
