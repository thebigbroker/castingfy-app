"use client";

import Link from "next/link";

interface HeaderProps {
  variant?: "light" | "dark";
}

export default function Header({ variant = "light" }: HeaderProps) {
  const isDark = variant === "dark";

  return (
    <header className={`${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/95' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Castingfy - Inicio"
          >
            <span className={`text-base font-bold tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>
              CASTINGFY
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6" role="list">
            <Link
              href="/castings-new"
              className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
            >
              Castings
            </Link>
            <Link
              href="/"
              className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
            >
              Encuentra Talento
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden md:block text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className={`hidden md:block px-4 py-2 text-sm font-medium border-2 ${
                isDark
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-black text-black hover:bg-black hover:text-white'
              } rounded-lg transition-all`}
            >
              Registrarse
            </Link>
            <Link
              href="/login"
              className={`px-4 py-2 text-sm font-semibold ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-900'
              } rounded-lg transition-colors`}
            >
              Publicar un trabajo
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              aria-label="Abrir menú"
              aria-expanded="false"
            >
              <div className="space-y-1.5">
                <span className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}></span>
                <span className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}></span>
                <span className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
