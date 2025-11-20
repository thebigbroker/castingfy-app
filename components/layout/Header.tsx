"use client";

import Link from "next/link";

interface HeaderProps {
  variant?: "light" | "dark";
}

export default function Header({ variant = "light" }: HeaderProps) {
  const isDark = variant === "dark";

  return (
    <header className={`${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/95' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🎬</span>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              Castingfy
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/castings-new"
            className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
          >
            Buscar Castings
          </Link>
          <Link
            href="/#talentos"
            className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
          >
            Descubrir Talento
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className={`px-4 py-2 text-sm font-medium ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'} rounded-lg transition-colors`}
          >
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
}
