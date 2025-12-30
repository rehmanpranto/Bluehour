'use client';

import HistoryList from '@/components/HistoryList';
import { useEffect, useState } from 'react';

interface MoodEntry {
  id: string;
  created_at: string;
  entry_date: string;
  entry_time_label: string | null;
  mood: number;
  anxiety: number;
  energy: number;
  notes: string | null;
  triggers: string[] | null;
  helped: string[] | null;
  felt_safe: boolean;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
            <span className="text-sm font-semibold text-teal-700">📖 Your Journey</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Your Reflections
          </h1>
          <p className="text-lg text-gray-600">
            Review your mood patterns and personal growth over time
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav>
            <a
              href="/checkin"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-teal-200 px-6 py-3 font-semibold text-teal-700 hover:bg-teal-50 transition shadow-sm hover:shadow-md"
            >
              ← New Check-in
            </a>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
              <p className="text-teal-600 font-medium">Loading your reflections...</p>
            </div>
          </div>
        ) : (
          <HistoryList entries={entries} onDelete={() => fetchEntries()} />
        )}

        {/* Support Note */}
        <div className="mt-12 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md">
          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">💙</span>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">A Gentle Reminder</h4>
              <p className="text-sm text-amber-800">
                This tool supports reflection and self-awareness. It's not a substitute for professional mental health care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
