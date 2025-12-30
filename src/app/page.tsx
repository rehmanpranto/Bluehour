import Link from 'next/link';

export const metadata = {
  title: 'Blue Hour - Welcome',
  description: 'A gentle, private space to reflect and track how you feel over time.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
            <span className="text-sm font-semibold text-teal-700">✨ Welcome</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Blue Hour
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A calm, private space to check in with yourself—one day at a time.
          </p>
        </div>

        {/* Primary actions */}
        <div className="flex justify-center mb-10">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white transition hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
          >
            🔑 Login / Create account
          </Link>
        </div>

        {/* Value props */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-teal-100 bg-white/80 backdrop-blur-sm p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🔒 Private by design</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your reflections stay in your account. We keep things minimal and respectful.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🌿 Gentle language</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              No harsh labels—just space to notice what’s true for you today.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">📈 See patterns</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Review your history and a simple 7‑day report whenever you’re ready.
            </p>
          </div>
        </div>

        {/* Secondary links */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/history"
            className="block rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">Your reflections</h3>
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-sm text-gray-600">Browse past check-ins and notice what’s been changing.</p>
          </Link>

          <Link
            href="/report"
            className="block rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-teal-50 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">7‑day report</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-sm text-gray-600">A small summary to support reflection and self-awareness.</p>
          </Link>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md">
            <div className="flex gap-4">
              <span className="text-2xl flex-shrink-0">💙</span>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">A gentle reminder</h4>
                <p className="text-sm text-amber-800">
                  This app supports reflection and self-awareness. If you’re in immediate danger or crisis,
                  please contact local emergency services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
