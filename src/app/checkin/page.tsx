import CheckInForm from '@/components/CheckInForm';

export const metadata = {
  title: 'Blue Hour - Check-in',
  description: 'A gentle check-in to reflect on how you feel today.',
};

export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="mb-10">
          <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
            <span className="text-sm font-semibold text-teal-700">📝 Check-in</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Today’s check-in
          </h1>
          <p className="text-lg text-gray-600">
            You can keep this simple. Small notes count.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
          <CheckInForm />
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md">
          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">💙</span>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">A gentle reminder</h4>
              <p className="text-sm text-amber-800">
                This space is here to support reflection. If you feel unsafe or overwhelmed,
                reaching out to someone you trust can help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
