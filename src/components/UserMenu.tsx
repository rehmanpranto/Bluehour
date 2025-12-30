'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  full_name: string;
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage (set after login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        setUser(null);
        setIsOpen(false);
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
      >
        🔑 Login
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-100 hover:bg-teal-200 transition font-semibold text-teal-700"
      >
        <span>👤 {user.full_name.split(' ')[0]}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-teal-200 shadow-lg z-50">
          <div className="p-4 border-b border-teal-100">
            <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold transition disabled:opacity-50 flex items-center gap-2"
          >
            <span>🚪</span> {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}
