export default function AdminNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
          <span className="text-sm font-semibold text-teal-700">🔒 Not available</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">This page isn’t part of Blue Hour</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          The admin area has been removed for safety and simplicity.
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
          >
            ← Return to home
          </a>
        </div>
      </div>
    </main>
  );
}
