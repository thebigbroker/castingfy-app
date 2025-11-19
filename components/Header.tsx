"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-black hover:text-gray-800 transition-colors"
          >
            CASTINGFY
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/producciones"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Mis Producciones
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Descubrir
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push("/producciones")}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-all"
            >
              Nuevo Proyecto
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/producciones"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                Mis Producciones
              </Link>
              <Link
                href="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                Descubrir
              </Link>
              <Link
                href="/dashboard/editar-perfil"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                Editar Perfil
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/producciones");
                }}
                className="mx-4 mt-2 px-4 py-3 bg-black text-white text-base font-medium rounded-lg hover:bg-gray-900 transition-all"
              >
                Nuevo Proyecto
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
