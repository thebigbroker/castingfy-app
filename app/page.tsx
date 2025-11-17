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
          // Check if user exists in database
          const { data: userData } = await supabase
            .from("users")
            .select("id, role")
            .eq("id", data.user.id)
            .single();

          // If user doesn't exist, create it and redirect to complete profile
          if (!userData) {
            await supabase.from("users").insert({
              id: data.user.id,
              email: data.user.email!,
              role: "talento",
              status: "pendiente",
            });
            router.push("/registro/completar-perfil?role=talento");
          } else {
            // User exists, redirect to dashboard
            router.push("/dashboard");
          }
        } else {
          // Error handling
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
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
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
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity"
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
