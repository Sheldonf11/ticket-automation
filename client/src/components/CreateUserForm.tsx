import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createUserSchema, type CreateUserInput } from 'core';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const createUser = async (values: CreateUserInput) => {
  await axios.post(`${apiBaseUrl}/api/users`, values, {
    withCredentials: true,
  });
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : 'Unable to create user.';
}

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onSuccess();
    },
  });

  const onSubmit = (values: CreateUserInput) => {
    createUserMutation.mutate(values);
  };

  const handleCancel = () => {
    if (createUserMutation.isPending) return;
    createUserMutation.reset();
    reset();
    onCancel();
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input
        aria-hidden="true"
        autoComplete="username"
        className="hidden"
        tabIndex={-1}
        type="text"
      />
      <input
        aria-hidden="true"
        autoComplete="current-password"
        className="hidden"
        tabIndex={-1}
        type="password"
      />
      <div className="grid gap-5 px-6 py-5">
        {createUserMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{getErrorMessage(createUserMutation.error)}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label htmlFor="create-user-name" className="text-xs uppercase tracking-wider text-muted-foreground">
            Name
          </Label>
          <Input
            id="create-user-name"
            type="text"
            autoComplete="name"
            placeholder="Agent Smith"
            aria-invalid={!!errors.name}
            disabled={createUserMutation.isPending}
            className="h-10"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="create-user-email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <Input
            id="create-user-email"
            type="email"
            autoComplete="off"
            placeholder="agent@company.com"
            aria-invalid={!!errors.email}
            disabled={createUserMutation.isPending}
            className="h-10"
            data-1p-ignore
            data-form-type="other"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="create-user-password" className="text-xs uppercase tracking-wider text-muted-foreground">
            Password
          </Label>
          <Input
            id="create-user-password"
            type="password"
            autoComplete="off"
            placeholder="Minimum 8 characters"
            aria-invalid={!!errors.password}
            disabled={createUserMutation.isPending}
            className="h-10"
            data-1p-ignore
            data-form-type="other"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0 rounded-none border-t bg-muted/30 px-6 py-5">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={createUserMutation.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createUserMutation.isPending}>
          {createUserMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Creating
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              Create user
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
