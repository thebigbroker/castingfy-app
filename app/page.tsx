"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";
import Image from "next/image";

interface TalentProfile {
  id: string;
  user_id: string;
  stage_name: string;
  headshot_url: string;
  location: string;
  age?: number;
  gender?: string;
  skills?: string[];
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  useEffect(() => {
    if (code) {
      // Handle OAuth callback
      const handleOAuthCallback = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.session) {
          // Use upsert to ensure user exists in database (insert or update if exists)
          const { error: upsertError } = await supabase
            .from("users")
            .upsert(
              {
                id: data.user.id,
                email: data.user.email!,
                role: "talento",
                status: "pendiente",
              },
              {
                onConflict: "id",
                ignoreDuplicates: false, // Update if exists
              }
            );

          if (upsertError) {
            console.error("Error creating/updating user:", upsertError);
            router.push("/login?error=user_creation_failed");
            return;
          }

          // Check if user has completed profile
          const { data: talentProfile } = await supabase
            .from("talent_profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .single();

          const { data: producerProfile } = await supabase
            .from("producer_profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .single();

          // If no profile exists, redirect to complete profile
          if (!talentProfile && !producerProfile) {
            router.push("/registro/completar-perfil?role=talento");
          } else {
            // Profile exists, redirect to dashboard
            router.push("/dashboard");
          }
        } else {
          // Error handling
          console.error("OAuth exchange error:", error);
          router.push("/login?error=oauth_failed");
        }
      };

      handleOAuthCallback();
    }
  }, [code, router]);

  useEffect(() => {
    loadTalents();
  }, []);

  useEffect(() => {
    filterTalents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender, selectedSkill, talents]);

  const loadTalents = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("talent_profiles")
      .select("*")
      .not("headshot_url", "is", null)
      .limit(20);

    if (data) {
      setTalents(data);
      setFilteredTalents(data.slice(0, 5));
    }
  };

  const filterTalents = () => {
    let filtered = [...talents];

    if (selectedGender !== "all") {
      filtered = filtered.filter((t) => t.gender === selectedGender);
    }

    if (selectedSkill !== "all") {
      filtered = filtered.filter((t) =>
        t.skills?.includes(selectedSkill)
      );
    }

    setFilteredTalents(filtered.slice(0, 5));
  };

  const allSkills = Array.from(
    new Set(
      talents.flatMap((t) => t.skills || [])
    )
  ).sort();

  if (code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative text-white py-32 md:py-40 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1592685530141-64eb6bdbf1c6?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Encuentra el talento perfecto para tu próximo proyecto
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Conecta con actores, modelos, voiceovers y creadores de contenido profesionales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/castings-new"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg backdrop-blur-sm"
            >
              Ver castings activos
            </Link>
          </div>
        </div>
      </section>

      {/* Talent Showcase Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Descubre talento verificado</h2>
            <p className="text-xl text-gray-600">
              Miles de profesionales listos para tu próximo proyecto
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Género</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">Todos</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="no-binario">No binario</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Habilidad</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">Todas las habilidades</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className="relative group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 relative">
                  {talent.headshot_url && (
                    <Image
                      src={talent.headshot_url}
                      alt={talent.stage_name}
                      fill
                      className="object-cover blur-md group-hover:blur-lg transition-all duration-300"
                      unoptimized
                    />
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Info visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg blur-sm">
                      {talent.stage_name}
                    </p>
                    {talent.location && (
                      <p className="text-white/80 text-sm blur-sm">
                        {talent.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Overlay */}
          <div className="mt-12 bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                ¿Quieres ver todos los perfiles completos?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Únete a Castingfy para acceder a perfiles detallados, información de contacto, portfolios completos y mucho más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/registro"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Registrarse gratis
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Para Talento</h3>
              <p className="text-gray-600">
                Crea tu perfil profesional y accede a las mejores oportunidades de casting
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Para Productoras</h3>
              <p className="text-gray-600">
                Publica castings y encuentra el talento perfecto para tus proyectos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sin fricción</h3>
              <p className="text-gray-600">
                Proceso rápido y sencillo de principio a fin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-black mb-2">{talents.length}+</div>
              <div className="text-gray-600">Talentos registrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">Perfiles verificados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">24/7</div>
              <div className="text-gray-600">Soporte disponible</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">0€</div>
              <div className="text-gray-600">Registro gratuito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a la comunidad de casting más grande de habla hispana
          </p>
          <Link
            href="/registro"
            className="inline-block px-10 py-5 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
