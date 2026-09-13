import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Lock } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Lock size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Login</h1>
        <p className="text-center text-slate-500 text-sm mb-8">Sign in with Google to manage your portfolio</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In with Google'}
          </Button>
        </div>
      </div>
    </div>
  );
}
