'use client';

import { useState, useEffect } from 'react';

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

interface HistoryListProps {
  entries: MoodEntry[];
  onDelete?: (id: string) => void;
}

export default function HistoryList({ entries: initialEntries, onDelete }: HistoryListProps) {
  const [entries, setEntries] = useState<MoodEntry[]>(initialEntries);
  const [filter, setFilter] = useState<'all' | 'low_mood' | 'high_anxiety' | 'not_safe'>(
    'all'
  );
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const applyFilter = async (newFilter: typeof filter) => {
    setFilter(newFilter);
    setLoading(true);

    try {
      const url =
        newFilter === 'all'
          ? '/api/entries'
          : `/api/entries?filter=${newFilter}`;
      const response = await fetch(url);

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

  const handleDelete = async (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        setDeleteId(null);
        if (onDelete) {
          onDelete(id);
        }
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setDeleteId(null);
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'bg-red-100 text-red-700';
    if (mood <= 5) return 'bg-amber-100 text-amber-700';
    if (mood <= 7) return 'bg-cyan-100 text-cyan-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const getAnxietyColor = (anxiety: number) => {
    if (anxiety >= 8) return 'bg-red-100 text-red-700';
    if (anxiety >= 6) return 'bg-orange-100 text-orange-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">🔍 Filter Your Reflections</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'low_mood', 'high_anxiety', 'not_safe'] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => applyFilter(f)}
                disabled={loading}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === f
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white border border-teal-200 text-teal-700 hover:bg-teal-50'
                } disabled:opacity-50`}
              >
                {f === 'all' && '📊 All'}
                {f === 'low_mood' && '😔 Low Mood (≤3)'}
                {f === 'high_anxiety' && '😰 High Anxiety (≥8)'}
                {f === 'not_safe' && '⚠️ Not Safe'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600 text-lg">
              {filter === 'all'
                ? '✨ No reflections yet. Start with your first check-in!'
                : '😶 No entries match this filter.'}
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    📅 {formatDate(entry.entry_date)}
                  </div>
                  {entry.entry_time_label && (
                    <div className="text-sm text-gray-500 capitalize">
                      🕐 {entry.entry_time_label}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition ${
                    deleteId === entry.id
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'text-teal-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {deleteId === entry.id ? '❌ Confirm?' : '🗑️ Delete'}
                </button>
              </div>

              {/* Scales */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${getMoodColor(entry.mood)}`}>
                  <div className="text-xl">😊</div>
                  <div className="font-bold">{entry.mood}/10</div>
                  <div className="text-xs opacity-75">Mood</div>
                </div>
                <div className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${getAnxietyColor(entry.anxiety)}`}>
                  <div className="text-xl">😰</div>
                  <div className="font-bold">{entry.anxiety}/10</div>
                  <div className="text-xs opacity-75">Anxiety</div>
                </div>
                <div className="rounded-lg px-3 py-2 text-center text-sm font-semibold bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900">
                  <div className="text-xl">⚡</div>
                  <div className="font-bold">{entry.energy}/10</div>
                  <div className="text-xs opacity-75">Energy</div>
                </div>
              </div>

              {/* Safety Status */}
              {entry.felt_safe && (
                <div className="text-xs font-medium text-green-700 bg-green-50 rounded px-2 py-1 inline-block mb-3">
                  ✓ Felt Safe
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700">{entry.notes}</p>
                </div>
              )}

              {/* Triggers & Helped */}
              <div className="grid md:grid-cols-2 gap-3">
                {entry.triggers && entry.triggers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">
                      Triggers
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.triggers.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-700"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.helped && entry.helped.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">
                      What Helped
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.helped.map((help, idx) => (
                        <span
                          key={idx}
                          className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                        >
                          {help}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
