'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setMessage({
        type: 'success',
        text: data.message,
      });

      // Store user in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Reset form and redirect after success
      setTimeout(() => {
        setFormData({ email: '', password: '', full_name: '' });
        router.push('/checkin');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Display */}
      {message && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          📧 Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          🔐 Password
        </label>
        <input
          type="password"
          name="password"
          placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
      </div>

      {/* Full Name (Sign Up Only) */}
      {isSignUp && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            👤 Full Name
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Your name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transform"
      >
        {loading
          ? '⏳ Please wait...'
          : isSignUp
          ? '✨ Create Account'
          : '🔑 Login'}
      </button>

      {/* Toggle Sign Up / Login */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="font-semibold text-teal-600 hover:text-teal-700 transition"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </form>
  );
}
