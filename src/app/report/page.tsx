'use client';

import { useEffect, useMemo, useState } from 'react';

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

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; entries: MoodEntry[] }
  | { status: 'error'; message: string };

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function ReportPage() {
  const [days, setDays] = useState(7);
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const load = async () => {
      setState({ status: 'loading' });
      try {
        const res = await fetch('/api/entries');
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(data?.error || 'Could not load your reflections.');
        }
        const entries = (await res.json()) as MoodEntry[];
        setState({ status: 'ready', entries });
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : 'Something went wrong while loading your report.';
        setState({ status: 'error', message });
      }
    };

    load();
  }, []);

  const { fromDate, toDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (Math.max(1, days) - 1));
    return { fromDate: toISODate(start), toDate: toISODate(end) };
  }, [days]);

  const filtered = useMemo(() => {
    if (state.status !== 'ready') return [];
    return state.entries
      .filter((e) => e.entry_date >= fromDate && e.entry_date <= toDate)
      .sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1));
  }, [state, fromDate, toDate]);

  const summary = useMemo(() => {
    if (filtered.length === 0) {
      return {
        count: 0,
        avgMood: null as number | null,
        avgAnxiety: null as number | null,
        avgEnergy: null as number | null,
        safePct: null as number | null,
      };
    }

    const sumMood = filtered.reduce((acc, e) => acc + e.mood, 0);
    const sumAnxiety = filtered.reduce((acc, e) => acc + e.anxiety, 0);
    const sumEnergy = filtered.reduce((acc, e) => acc + e.energy, 0);
    const safeCount = filtered.reduce((acc, e) => acc + (e.felt_safe ? 1 : 0), 0);

    return {
      count: filtered.length,
      avgMood: sumMood / filtered.length,
      avgAnxiety: sumAnxiety / filtered.length,
      avgEnergy: sumEnergy / filtered.length,
      safePct: (safeCount / filtered.length) * 100,
    };
  }, [filtered]);

  const dailySeries = useMemo(() => {
    // Always show a stable last-N-days timeline, even if some days have 0 entries.
    const end = new Date(`${toDate}T00:00:00`);
    const daysList: string[] = [];

    for (let i = Math.max(1, days) - 1; i >= 0; i -= 1) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      daysList.push(toISODate(d));
    }

    const byDate = new Map<string, MoodEntry[]>();
    for (const e of filtered) {
      const arr = byDate.get(e.entry_date) ?? [];
      arr.push(e);
      byDate.set(e.entry_date, arr);
    }

    return daysList.map((date) => {
      const entries = byDate.get(date) ?? [];
      if (entries.length === 0) {
        return {
          date,
          label: formatDayLabel(date),
          count: 0,
          mood: null as number | null,
          anxiety: null as number | null,
          energy: null as number | null,
          feltSafeCount: 0,
        };
      }

      const mood = entries.reduce((a, e) => a + e.mood, 0) / entries.length;
      const anxiety =
        entries.reduce((a, e) => a + e.anxiety, 0) / entries.length;
      const energy =
        entries.reduce((a, e) => a + e.energy, 0) / entries.length;
      const feltSafeCount = entries.reduce((a, e) => a + (e.felt_safe ? 1 : 0), 0);

      return {
        date,
        label: formatDayLabel(date),
        count: entries.length,
        mood,
        anxiety,
        energy,
        feltSafeCount,
      };
    });
  }, [filtered, days, toDate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-10">
          <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
            <span className="text-sm font-semibold text-teal-700">📈 Report</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Your last {days} days
          </h1>
          <p className="text-lg text-gray-600">
            A gentle summary to help you notice patterns and check in with what mattered.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Range</p>
              <p className="text-sm text-gray-600">
                {formatDayLabel(fromDate)} <span className="mx-1">→</span>{' '}
                {formatDayLabel(toDate)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-900" htmlFor="days">
                Days
              </label>
              <select
                id="days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              >
                <option value={7}>7</option>
                <option value={14}>14</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>
        </div>

        {state.status === 'loading' && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4" />
              <p className="text-teal-600 font-medium">Putting your report together...</p>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">
            <p className="font-semibold mb-1">We couldn’t load your report right now.</p>
            <p className="text-sm">{state.message}</p>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Reflections</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{summary.count}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Average mood</p>
                <p className="text-3xl font-bold text-teal-700 mt-1">
                  {summary.avgMood === null ? '—' : `${summary.avgMood.toFixed(1)}/10`}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Average anxiety</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">
                  {summary.avgAnxiety === null
                    ? '—'
                    : `${summary.avgAnxiety.toFixed(1)}/10`}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Felt safe</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">
                  {summary.safePct === null ? '—' : `${Math.round(summary.safePct)}%`}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Day-by-day</h2>

              <div className="space-y-3">
                {dailySeries.map((d) => (
                  <div
                    key={d.date}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{d.label}</p>
                        <p className="text-xs text-gray-500">{d.count} reflection{d.count === 1 ? '' : 's'}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold">Felt safe</p>
                        <p className="text-sm font-bold text-gray-900">
                          {d.count === 0 ? '—' : `${d.feltSafeCount}/${d.count}`}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 mt-4">
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                        <p className="text-xs font-semibold text-gray-600">Mood</p>
                        <p className="text-lg font-bold text-teal-700">
                          {d.mood === null ? '—' : `${d.mood.toFixed(1)}/10`}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                        <p className="text-xs font-semibold text-gray-600">Anxiety</p>
                        <p className="text-lg font-bold text-amber-700">
                          {d.anxiety === null ? '—' : `${d.anxiety.toFixed(1)}/10`}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                        <p className="text-xs font-semibold text-gray-600">Energy</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {d.energy === null ? '—' : `${d.energy.toFixed(1)}/10`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <p className="font-semibold">No reflections in this range yet.</p>
                  <p className="text-sm text-amber-800">
                    If you’d like, you can start with a small check-in on the home page.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md">
              <div className="flex gap-4">
                <span className="text-2xl flex-shrink-0">💙</span>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">A gentle reminder</h4>
                  <p className="text-sm text-amber-800">
                    This report is for reflection and self-awareness. If you notice anything that feels heavy,
                    it may help to reach out to someone you trust.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
