import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-1 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {isSignUp
              ? 'Sign up to start planning trips'
              : 'Sign in to your account'}
          </p>
        </div>

        <div className='space-y-3'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring'
          />

          {error && <p className='text-sm text-destructive'>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full py-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={() => void handleOAuthSignIn('google')}
            disabled={loading}
            className='flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50'
          >
            Google
          </button>
          <button
            type='button'
            onClick={() => void handleOAuthSignIn('github')}
            disabled={loading}
            className='flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50'
          >
            GitHub
          </button>
        </div>

        <p className='text-center text-sm text-muted-foreground'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className='text-primary underline-offset-4 hover:underline'
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
