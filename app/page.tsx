"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-7xl mx-auto text-center space-y-8 w-full">
        <h1 className="text-6xl font-bold text-primary">
          Castingfy
        </h1>

        <p className="text-2xl text-text-muted">
          Tu plataforma de castings profesional
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/login"
            className="px-8 py-4 bg-surface border border-border rounded-md text-text hover:bg-surface/80 transition-colors"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/registro"
            className="px-8 py-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-light transition-colors"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-surface rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Para Talento</h3>
            <p className="text-text-muted">
              Crea tu perfil profesional y accede a las mejores oportunidades
            </p>
          </div>

          <div className="p-6 bg-surface rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Para Productoras</h3>
            <p className="text-text-muted">
              Publica castings y encuentra el talento perfecto para tus proyectos
            </p>
          </div>

          <div className="p-6 bg-surface rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Sin fricción</h3>
            <p className="text-text-muted">
              Proceso rápido y sencillo de principio a fin
            </p>
          </div>
        </div>
      </div>
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
