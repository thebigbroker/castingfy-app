import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

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
