"use client";

import { useState, useEffect } from "react";

interface IMDBFeedProps {
  imdbUrl: string | null;
}

export default function IMDBFeed({ imdbUrl }: IMDBFeedProps) {
  const [nameId, setNameId] = useState<string | null>(null);

  useEffect(() => {
    if (imdbUrl) {
      // Extraer el ID del nombre de la URL de IMDB
      const match = imdbUrl.match(/\/name\/(nm\d+)/);
      if (match) {
        setNameId(match[1]);
      }
    }
  }, [imdbUrl]);

  if (!imdbUrl || !nameId) {
    return null;
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
            <path fill="#000" d="M6 8h2v8H6V8zm3 0h1.5l1.5 5 1.5-5H15v8h-1.5v-5.5L12 16h-1l-1.5-5.5V16H8V8z"/>
          </svg>
          IMDB
        </h3>
        <span className="text-xs text-text-muted font-medium bg-yellow-50 px-2 py-1 rounded">
          {nameId}
        </span>
      </div>

      {/* Bonito mensaje con icono */}
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-lg p-6 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
                <path fill="#000" d="M6 8h2v8H6V8zm3 0h1.5l1.5 5 1.5-5H15v8h-1.5v-5.5L12 16h-1l-1.5-5.5V16H8V8z"/>
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Perfil Profesional en IMDB
            </h4>
            <p className="text-sm text-gray-600">
              Filmografía, créditos y trayectoria profesional verificada en la base de datos más grande de cine y televisión.
            </p>
          </div>
        </div>
      </div>

      {/* Botón grande y llamativo para ver IMDB */}
      <a
        href={imdbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <div className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
          <div className="relative flex items-center justify-center gap-3">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
              <path fill="#000" d="M6 8h2v8H6V8zm3 0h1.5l1.5 5 1.5-5H15v8h-1.5v-5.5L12 16h-1l-1.5-5.5V16H8V8z"/>
            </svg>
            <span className="text-white font-bold text-lg">
              Ver filmografía en IMDB
            </span>
            <svg
              className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>

          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000"></div>
        </div>
      </a>

      {/* Stats decorativos */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-surface rounded-lg">
          <div className="text-xs text-text-muted mb-1">Películas</div>
          <div className="text-lg font-bold text-primary">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </div>
        <div className="text-center p-3 bg-surface rounded-lg">
          <div className="text-xs text-text-muted mb-1">Series TV</div>
          <div className="text-lg font-bold text-primary">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="text-center p-3 bg-surface rounded-lg">
          <div className="text-xs text-text-muted mb-1">Créditos</div>
          <div className="text-lg font-bold text-primary">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
