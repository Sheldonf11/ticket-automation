import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from '../lib/auth-client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
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
    <div className="flex items-center justify-center h-screen relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute w-[600px] h-[600px] bg-[conic-gradient(from_180deg_at_50%_50%,#2a8af6_0deg,#a853ba_180deg,#e92a67_360deg)] blur-[120px] opacity-15 rounded-[50%] animate-[pulse_10s_ease-in-out_infinite_alternate]" style={{ transformOrigin: 'center' }}></div>

      <div className="w-full max-w-[420px] p-12 rounded-3xl relative z-10 flex flex-col gap-6 bg-panel-bg backdrop-blur-md border border-panel-border shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div>
          <h2 className="text-[2rem] font-semibold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-text-muted text-[0.95rem]">Log in to manage your tickets securely</p>
        </div>
        
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-lg border border-error/20 text-[0.9rem]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[0.85rem] font-medium text-text-muted">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="agent@helphesk.com"
              className={`p-[0.85rem_1rem] rounded-xl bg-black/20 border text-text-main font-inherit text-base transition-all duration-200 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(94,106,210,0.25)] ${errors.email ? 'border-error/50 shadow-[0_0_0_3px_rgba(248,81,73,0.15)]' : 'border-panel-border'}`}
            />
            {errors.email && <span className="text-error text-[0.8rem] mt-1">{errors.email.message}</span>}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[0.85rem] font-medium text-text-muted">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={`p-[0.85rem_1rem] rounded-xl bg-black/20 border text-text-main font-inherit text-base transition-all duration-200 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(94,106,210,0.25)] ${errors.password ? 'border-error/50 shadow-[0_0_0_3px_rgba(248,81,73,0.15)]' : 'border-panel-border'}`}
            />
            {errors.password && <span className="text-error text-[0.8rem] mt-1">{errors.password.message}</span>}
          </div>
          
          <button type="submit" disabled={isLoading} className="bg-accent text-white border-none p-[0.9rem] rounded-xl font-medium text-base cursor-pointer transition-all duration-200 mt-2 hover:not-disabled:bg-accent-hover hover:not-disabled:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

