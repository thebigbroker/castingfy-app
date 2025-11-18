import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-black">
            Castingfy
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-text-muted border-t border-border">
        <p>&copy; 2025 Castingfy. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
