import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Blue Hour - Login',
  description: 'Login to your Blue Hour account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto max-w-md px-4 py-12 sm:py-16 flex flex-col justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🌊</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Blue Hour
          </h1>
          <p className="text-lg text-gray-600">
            Your safe space for reflection
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-teal-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
          <LoginForm />
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            All your reflections are private and secure
          </p>
        </div>
      </div>
    </main>
  );
}
