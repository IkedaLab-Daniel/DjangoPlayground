'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function PasswordResetConfirmPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';
  const params = useParams<{ uid: string; token: string }>();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/users/reset_password_confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: params.uid,
          token: params.token,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const detail =
          data?.new_password?.[0] ||
          data?.token?.[0] ||
          data?.uid?.[0] ||
          data?.detail ||
          'Password reset failed. The link may be invalid or expired.';
        throw new Error(detail);
      }

      setSuccessMessage('Password has been reset successfully. Redirecting to login...');
      setNewPassword('');
      setConfirmPassword('');

      window.setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to connect to password reset service.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-600 mt-2">
          Enter your new password below to complete account recovery.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Repeat new password"
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-800 text-white py-2.5 text-sm font-semibold uppercase tracking-wide hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <Link href="/" className="block text-center mt-5 text-sm font-medium text-blue-800 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
