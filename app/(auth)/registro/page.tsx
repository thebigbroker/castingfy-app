"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: {
          role: data.role,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Create user record in database
    if (authData.user) {
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        role: data.role,
        status: "pendiente",
        country: data.country,
        postal_code: data.postalCode,
      });

      if (dbError) {
        setError("Error al crear el perfil. Por favor, contacta con soporte.");
        setIsLoading(false);
        return;
      }

      // Redirect to complete profile
      router.push(`/registro/completar-perfil?role=${data.role}`);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/registro/completar-perfil`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Únete a Castingfy</h1>
        <p className="text-text-muted">Crea tu cuenta y comienza a explorar oportunidades</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="tu@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Mínimo 8 caracteres"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirmar contraseña <span className="text-red-500">*</span>
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Info box about location */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-md">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-600 mb-1">¿Por qué necesitamos tu ubicación?</p>
              <p className="text-text-muted">Usamos tu país y código postal para mostrarte castings más relevantes y cercanos a tu zona.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              País <span className="text-red-500">*</span>
            </label>
            <select
              {...register("country")}
              id="country"
              className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={isLoading}
            >
              <option value="">Selecciona tu país</option>
              <option value="ES">España</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="CO">Colombia</option>
              <option value="CL">Chile</option>
              <option value="PE">Perú</option>
              <option value="VE">Venezuela</option>
              <option value="EC">Ecuador</option>
              <option value="GT">Guatemala</option>
              <option value="CU">Cuba</option>
              <option value="BO">Bolivia</option>
              <option value="DO">República Dominicana</option>
              <option value="HN">Honduras</option>
              <option value="PY">Paraguay</option>
              <option value="SV">El Salvador</option>
              <option value="NI">Nicaragua</option>
              <option value="CR">Costa Rica</option>
              <option value="PA">Panamá</option>
              <option value="UY">Uruguay</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
              Código postal <span className="text-red-500">*</span>
            </label>
            <input
              {...register("postalCode")}
              type="text"
              id="postalCode"
              className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="28001"
              disabled={isLoading}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">
            ¿Qué eres? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                {...register("role")}
                type="radio"
                value="talento"
                className="mt-1"
                disabled={isLoading}
              />
              <div>
                <div className="font-medium">Talento</div>
                <div className="text-sm text-text-muted">Actor, Modelo, Creador de contenido</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                {...register("role")}
                type="radio"
                value="productor"
                className="mt-1"
                disabled={isLoading}
              />
              <div>
                <div className="font-medium">Productor</div>
                <div className="text-sm text-text-muted">Productor, Agencia, Director de Casting</div>
              </div>
            </label>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creando cuenta..." : "Crear mi cuenta"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-sm text-text-muted">o</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={isLoading}
        className="w-full py-3 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>

      <p className="mt-8 text-center text-sm text-text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
