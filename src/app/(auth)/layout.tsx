export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-b from-teal-50 to-slate-50 px-4 py-8 sm:items-center">
      {children}
    </main>
  );
}
