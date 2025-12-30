'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface CheckInFormProps {
  onSuccess?: (entry: MoodEntry) => void;
}

export default function CheckInForm({ onSuccess }: CheckInFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    entry_date: today,
    entry_time_label: '',
    mood: 5,
    anxiety: 5,
    energy: 5,
    notes: '',
    triggers: '',
    helped: '',
    felt_safe: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSetToday = () => {
    setFormData((prev) => ({
      ...prev,
      entry_date: today,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // If not authenticated, redirect to login
        if (response.status === 401) {
          setMessage({
            type: 'error',
            text: 'Please login first to save your check-in.',
          });
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
          return;
        }
        
        throw new Error(error.error || 'Failed to save entry');
      }

      const entry = await response.json();
      setMessage({
        type: 'success',
        text: "Your reflection has been saved with care. Take a moment for yourself.",
      });

      // Reset form
      setFormData({
        entry_date: today,
        entry_time_label: '',
        mood: 5,
        anxiety: 5,
        energy: 5,
        notes: '',
        triggers: '',
        helped: '',
        felt_safe: false,
      });

      if (onSuccess) {
        onSuccess(entry);
      }

      // Clear message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
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

  const ScaleInput = ({
    label,
    name,
    value,
    description,
  }: {
    label: string;
    name: string;
    value: number;
    description?: string;
  }) => (
    <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
      <label className="block text-sm font-semibold text-gray-900">{label}</label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="space-y-3">
        <input
          type="range"
          name={name}
          min="1"
          max="10"
          value={value}
          onChange={handleChange}
          className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-emerald-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Low</span>
          <span className="text-lg font-bold text-teal-700">{value}/10</span>
          <span className="text-xs text-gray-500">High</span>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
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

      {/* Date Section */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          📅 When was this?
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleChange}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={handleSetToday}
            className="rounded-lg bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-200 transition"
          >
            Today
          </button>
        </div>
      </div>

      {/* Time Label Section */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          🕐 Time of day (optional)
        </label>
        <input
          type="text"
          name="entry_time_label"
          placeholder="e.g., morning, evening, before bed..."
          value={formData.entry_time_label}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
      </div>

      {/* Scale Inputs */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">📊 How are you feeling?</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <ScaleInput
            label="Mood"
            name="mood"
            value={formData.mood}
            description="struggling → great"
          />
          <ScaleInput
            label="Anxiety"
            name="anxiety"
            value={formData.anxiety}
            description="calm → very anxious"
          />
          <ScaleInput
            label="Energy"
            name="energy"
            value={formData.energy}
            description="exhausted → energized"
          />
        </div>
      </div>

      {/* Optional Text Fields */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          💬 Notes (optional)
        </label>
        <textarea
          name="notes"
          placeholder="What's on your mind? What happened today?..."
          value={formData.notes}
          onChange={handleChange}
          maxLength={2000}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 resize-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.notes.length} / 2000
        </p>
      </div>

      {/* Triggers */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          🎯 Triggers or stressors (optional)
        </label>
        <p className="text-xs text-gray-500">
          Comma-separated: work, sleep, conflict...
        </p>
        <input
          type="text"
          name="triggers"
          placeholder="e.g., work stress, lack of sleep, conflict"
          value={formData.triggers}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
      </div>

      {/* What Helped */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          ✨ What helped (optional)
        </label>
        <p className="text-xs text-gray-500">
          Comma-separated: exercise, talking, rest...
        </p>
        <input
          type="text"
          name="helped"
          placeholder="e.g., exercise, talking to a friend, rest"
          value={formData.helped}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
      </div>

      {/* Safety Toggle */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
        <input
          type="checkbox"
          id="felt_safe"
          name="felt_safe"
          checked={formData.felt_safe}
          onChange={handleChange}
          className="w-5 h-5 rounded border-gray-300 text-emerald-600 cursor-pointer accent-emerald-500"
        />
        <label htmlFor="felt_safe" className="text-sm font-semibold text-gray-900 cursor-pointer">
          ✅ I feel safe right now
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transform"
      >
        {loading ? '💾 Saving...' : '📝 Save Reflection'}
      </button>
    </form>
  );
}
