"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* ARTISTAS */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase">Artistas</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/castings-new" className="hover:text-white transition-colors">Actores & Performers</Link></li>
              <li><Link href="/castings-new" className="hover:text-white transition-colors">Voiceover Artists</Link></li>
              <li><Link href="/castings-new" className="hover:text-white transition-colors">Creativos & Producción</Link></li>
              <li><Link href="/castings-new" className="hover:text-white transition-colors">Influencers & Creadores</Link></li>
              <li><Link href="/castings-new" className="hover:text-white transition-colors">Modelos</Link></li>
              <li><Link href="/castings-new" className="hover:text-white transition-colors mt-4 block">Audiciones populares</Link></li>
              <li><Link href="/como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors font-semibold">Crea tu perfil gratis</Link></li>
            </ul>
          </div>

          {/* CREADORES */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase">Creadores</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/registro" className="hover:text-white transition-colors">Film, Video & TV</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Teatro & Artes Escénicas</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Producción Voiceover</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Comercial & Contenido</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Influencers & UGC</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Empresas & ONGs</Link></li>
              <li><Link href="/explorar" className="hover:text-white transition-colors mt-4 block">Base de datos de talentos</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors font-semibold">Publica un trabajo</Link></li>
            </ul>
          </div>

          {/* EMPRESA */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/acerca-de" className="hover:text-white transition-colors">Acerca de</Link></li>
              <li><Link href="/carreras" className="hover:text-white transition-colors">Carreras</Link></li>
              <li><Link href="/asociados" className="hover:text-white transition-colors">Asociados</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* SOPORTE */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/ayuda" className="hover:text-white transition-colors">Ayuda</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/precios" className="hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="/reportar" className="hover:text-white transition-colors">Reportar contenido</Link></li>
            </ul>
          </div>

          {/* CONECTA */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase">Conecta</h3>
            <div className="flex gap-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </a>
            </div>

            <h4 className="font-bold text-xs mb-2 uppercase text-gray-400">Suscríbete al boletín</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-3 py-2 bg-gray-900 text-white text-sm rounded border border-gray-800 focus:outline-none focus:border-gray-600"
              />
              <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© 2025 Castingfy. Todos los derechos reservados</span>
              <span>•</span>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos de uso</Link>
              <span>•</span>
              <Link href="/privacidad" className="hover:text-white transition-colors">Política de privacidad</Link>
            </div>
            <div className="text-sm text-gray-400">
              <p className="text-center md:text-right">
                <span className="text-white font-semibold">🎬 Castingfy</span>
                <br />
                La plataforma de casting más confiable.
                <br />
                Hecho con ❤️ desde España.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
