"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import PublicProfileCTA from "@/components/PublicProfileCTA";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentGallery from "@/components/TalentGallery";
import TalentReviews from "@/components/TalentReviews";

interface TalentProfile {
  stage_name: string;
  headshot_url: string | null;
  bio: string | null;
  location: string | null;
  instagram_url: string | null;
  imdb_url: string | null;
  average_rating?: number;
  total_reviews?: number;
}

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function TalentoPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

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

    if (user) {
      // Get user role
      const { data: dbUser } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", user.id)
        .single();

      if (dbUser) {
        setCurrentUser({ id: dbUser.id, role: dbUser.role });
      }
    }
  };

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Obtener datos del usuario
      const { data: user } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("id", params.id)
        .single();

      if (user) {
        setUserData(user);

        if (user.role === "talento") {
          // Obtener perfil de talento
          const { data: talentProfile } = await supabase
            .from("talent_profiles")
            .select("*")
            .eq("user_id", params.id)
            .single();

          setProfile(talentProfile);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Perfil no encontrado</h2>
          <p className="text-text-muted mb-4">
            Este perfil no existe o no está disponible
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header variant="light" />

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header del Perfil */}
        <div className="bg-white border border-border rounded-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
          <div className="px-8 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
                {profile.headshot_url ? (
                  <Image
                    src={profile.headshot_url}
                    alt={profile.stage_name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-4xl bg-primary/10">
                    {profile.stage_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info básica */}
              <div className="flex-1 mt-16 md:mt-4">
                <h1 className="text-3xl font-bold mb-2">
                  {profile.stage_name}
                </h1>
                <p className="text-text-muted capitalize mb-3">
                  {userData.role}
                </p>

                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">Sobre mí</h2>
            <p className="text-text-muted whitespace-pre-line">{profile.bio}</p>
          </div>
        )}

        {/* Enlaces sociales */}
        {(profile.instagram_url || profile.imdb_url) && (
          <div className="bg-white border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">Enlaces</h2>
            <div className="flex flex-wrap gap-3">
              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {profile.imdb_url && (
                <a
                  href={profile.imdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-semibold"
                >
                  <span className="text-lg">★</span>
                  IMDb
                </a>
              )}
            </div>
          </div>
        )}

        {/* Galería */}
        <div className="mb-6">
          <TalentGallery
            userId={params.id as string}
            isOwnProfile={false}
          />
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <TalentReviews
            talentUserId={params.id as string}
            currentUserId={currentUser?.id}
            currentUserRole={currentUser?.role}
            averageRating={profile.average_rating || 0}
            totalReviews={profile.total_reviews || 0}
          />
        </div>

        {/* Gate para ver más información */}
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
              ¿Quieres ver más información?
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Regístrate en Castingfy para acceder a información completa del
              portafolio, experiencia, contacto directo y mucho más.
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

        {/* Información completa para usuarios autenticados */}
        {isAuthenticated && (
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">Información de Contacto</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-text-muted"
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
                <span className="text-text-muted">{userData.email}</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4">
              💡 Conecta con este talento desde la página de{" "}
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
      {!isAuthenticated && <PublicProfileCTA profileType="talent" />}
      <Footer />
    </>
  );
}
