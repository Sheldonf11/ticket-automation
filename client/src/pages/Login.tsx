import { useState } from 'react';
import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from '@/lib/auth-client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (session) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');

    await signIn.email(
      { email: data.email, password: data.password },
      {
        onSuccess: () => setIsLoading(false),
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || 'Login failed. Please check your credentials.');
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-muted text-foreground">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-background border-r border-border">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 [background-image:radial-gradient(circle,_var(--border)_1px,_transparent_1px)] [background-size:24px_24px]"
          aria-hidden="true"
        />

        {/* Top — logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">Helphesk</span>
        </div>

        {/* Center — tagline */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-4">
            Support that<br />
            <span className="text-muted-foreground">scales with you.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            AI-powered ticket management designed to deliver faster, more personalized support.
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-muted-foreground text-xs">
          © {new Date().getFullYear()} Helphesk
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">Helphesk</span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-1">
                Sign in
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  className="h-10"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="h-10"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-2 h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
