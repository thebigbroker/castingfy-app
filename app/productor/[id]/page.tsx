"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import PublicProfileCTA from "@/components/PublicProfileCTA";

interface ProducerProfile {
  company_name: string;
  bio: string | null;
  location: string | null;
  cover_image_url: string | null;
  instagram_url: string | null;
  imdb_url: string | null;
}

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function ProductorPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ProducerProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadProfile();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setIsAuthenticated(!!user);
  };

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get user data
      const { data: user } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("id", params.id)
        .single();

      if (user) {
        setUserData(user);

        if (user.role === "productor") {
          // Get producer profile
          const { data: producerProfile } = await supabase
            .from("producer_profiles")
            .select("*")
            .eq("user_id", params.id)
            .single();

          setProfile(producerProfile);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">Perfil no encontrado</h2>
          <p className="text-gray-600 mb-6">
            Este perfil no existe o no está disponible públicamente
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.company_name)}&size=200&background=6dcff6&color=fff`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl"><¬</span>
            <h1 className="text-xl font-bold">Castingfy</h1>
          </div>
          {!isAuthenticated && (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
          )}
          {isAuthenticated && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Ir al Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-gradient-to-r from-black/10 to-gray-300/20 h-48 sm:h-64 relative overflow-hidden">
        {profile.cover_image_url ? (
          <Image
            src={profile.cover_image_url}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-gray-300/20" />
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative pb-16">
        {/* Company Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white relative mb-4">
            <Image
              src={avatarUrl}
              alt={profile.company_name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">{profile.company_name}</h1>
          <p className="text-gray-600 mb-4">
            Productor
            {profile.location && ` · ${profile.location}`}
          </p>

          {profile.bio && (
            <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
          )}
        </div>

        {/* Social Links */}
        {(profile.instagram_url || profile.imdb_url) && (
          <div className="flex justify-center gap-2 mb-8">
            {profile.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                </svg>
                <span className="hidden sm:inline">Instagram</span>
              </a>
            )}
            {profile.imdb_url && (
              <a
                href={profile.imdb_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-black rounded-lg hover:opacity-90 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 14.5h1v-5h-1v5zM22 7.5v9c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1h18c.55 0 1 .45 1 1zm-11 5.83l.83-2.5.83 2.5h-1.66zm3.21-5.83h-1.71v5h1.71v-5zm-4 5h1.5l-.5-1.5h-.5v1.5zm.79-5h-1.85l-1.15 3.5v-3.5h-1.84v5h1.84v-1.5h.68l.47 1.5h1.85l-1-3.08.96-.42z" />
                </svg>
                <span className="hidden sm:inline">IMDb</span>
              </a>
            )}
          </div>
        )}

        {/* Limited Content Notice - Only for non-authenticated */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-primary mx-auto mb-4"
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
            <h3 className="text-2xl font-bold mb-2">
              ¿Quieres ver los proyectos de este productor?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Regístrate en Castingfy para acceder a proyectos activos,
              castings abiertos y contacto directo.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-all font-semibold"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/registro")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
              >
                Registrarse gratis
              </button>
            </div>
          </div>
        )}

        {/* Full Information for authenticated users */}
        {isAuthenticated && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">Información de Contacto</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600">{userData.email}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              =¡ Conecta con este productor desde la página de{" "}
              <button
                onClick={() => router.push("/explorar")}
                className="text-primary underline"
              >
                Explorar
              </button>
            </p>
          </div>
        )}
      </div>

      {/* CTA Overlay for non-authenticated users */}
      {!isAuthenticated && <PublicProfileCTA profileType="producer" />}
    </div>
  );
}
