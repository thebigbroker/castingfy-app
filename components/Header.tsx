import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-black hover:text-gray-800 transition-colors"
          >
            CASTINGFY
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/producciones"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Mis Producciones
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Descubrir
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              Perfil
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Ayuda
            </button>
            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-all">
              Nuevo Proyecto
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
