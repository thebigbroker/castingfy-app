"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Role {
  id: string;
  name: string;
  category: string;
  ageMin: number;
  ageMax: number;
  gender?: string;
}

interface Producer {
  id: string;
  companyName: string;
  location?: string;
}

interface Casting {
  id: string;
  title: string;
  description: string;
  projectType: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  roles: Role[];
  compensation?: {
    byRole?: Record<string, { type: string; amount?: number }>;
  };
  unionStatus?: string;
  producer: Producer;
}

export default function CastingsPage() {
  const router = useRouter();
  const [castings, setCastings] = useState<Casting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCasting, setSelectedCasting] = useState<Casting | null>(null);

  useEffect(() => {
    checkAuth();
    loadCastings();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const loadCastings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/public/castings");
      const data = await response.json();
      setCastings(data.castings || []);
    } catch (error) {
      console.error("Error loading castings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = (casting: Casting) => {
    if (!isAuthenticated) {
      setSelectedCasting(casting);
      setShowAuthModal(true);
    } else {
      // TODO: Implementar lógica de aplicación
      alert(`Aplicando a: ${casting.title}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Por definir";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Cargando castings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🎬</span>
              <h1 className="text-xl font-bold">Castingfy</h1>
            </button>
          </div>
          {!isAuthenticated ? (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-medium text-text hover:bg-surface rounded-lg transition-colors"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/registro")}
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Registrarse
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Ir al Dashboard
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Encuentra tu próximo casting
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explora oportunidades de casting en toda la región. {castings.length} proyectos activos.
          </p>
        </div>
      </section>

      {/* Castings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {castings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold mb-2">No hay castings disponibles</h2>
            <p className="text-text-muted">
              Vuelve pronto para ver nuevas oportunidades
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {castings.map((casting) => (
              <article
                key={casting.id}
                className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-black to-gray-900 text-white p-6">
                  <h2 className="text-xl font-bold mb-2">{casting.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>🏢</span>
                    <span>{casting.producer.companyName}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Type & Location */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {casting.projectType && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {casting.projectType}
                      </span>
                    )}
                    {casting.location && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        📍 {casting.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-muted mb-4 line-clamp-3">
                    {casting.description}
                  </p>

                  {/* Roles */}
                  {casting.roles.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">
                        Roles ({casting.roles.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {casting.roles.slice(0, 3).map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                          >
                            {role.name}
                          </span>
                        ))}
                        {casting.roles.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{casting.roles.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="text-xs text-text-muted mb-4">
                    <div>
                      <strong>Inicio:</strong> {formatDate(casting.startDate)}
                    </div>
                    {casting.endDate && (
                      <div>
                        <strong>Fin:</strong> {formatDate(casting.endDate)}
                      </div>
                    )}
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApplyClick(casting)}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
                  >
                    Aplicar a este casting
                  </button>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-border text-xs text-text-muted">
                  Publicado el {formatDate(casting.createdAt)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && selectedCasting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            {/* Icon */}
            <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-center mb-3 text-black">
              ¿Quieres aplicar a este casting?
            </h2>

            <p className="text-center text-gray-600 mb-2">
              <strong>{selectedCasting.title}</strong>
            </p>

            <p className="text-center text-gray-600 mb-6">
              Regístrate gratis para aplicar y gestionar tus audiciones
            </p>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-sm mb-3 text-gray-700">
                Con una cuenta gratuita podrás:
              </p>
              <ul className="space-y-2">
                {[
                  "Aplicar a castings y audiciones",
                  "Crear y gestionar tu perfil profesional",
                  "Recibir notificaciones de nuevos castings",
                  "Comunicarte directamente con productores",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/registro")}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-semibold"
              >
                Crear cuenta gratis
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full px-6 py-3 bg-white text-black border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Ya tengo cuenta
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedCasting(null);
                }}
                className="w-full px-6 py-3 text-gray-600 hover:text-black transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
