"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  talentProfileSchema,
  producerProfileSchema,
  type TalentProfileFormData,
  type ProducerProfileFormData,
} from "@/lib/validations/auth";
import UploadcareUploader from "@/components/UploadcareUploader";

function CompletarPerfilForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [role, setRole] = useState<"talento" | "productor" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get user role from database
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userData?.role) {
        setRole(userData.role as "talento" | "productor");
      } else if (roleParam) {
        setRole(roleParam as "talento" | "productor");
      }
    }

    checkAuth();
  }, [router, roleParam]);

  const talentForm = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileSchema),
    defaultValues: {
      stageName: "",
      location: "",
      headshotUrl: "",
      reelUrl: "",
      bio: "",
    },
  });

  const producerForm = useForm<ProducerProfileFormData>({
    resolver: zodResolver(producerProfileSchema),
    defaultValues: {
      companyName: "",
      website: "",
      credits: "",
    },
  });

  const onSubmitTalent = async (data: TalentProfileFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No hay usuario autenticado");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("talent_profiles").insert({
      user_id: user.id,
      stage_name: data.stageName,
      location: data.location,
      age: data.age,
      gender: data.gender,
      height: data.height,
      bio: data.bio,
      headshot_url: data.headshotUrl,
      reel_url: data.reelUrl || null,
      languages: data.languages || null,
      skills: data.skills || null,
    });

    if (profileError) {
      console.error("Error creating talent profile:", profileError);
      setError(`Error al crear el perfil: ${profileError.message}`);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const onSubmitProducer = async (data: ProducerProfileFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No hay usuario autenticado");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("producer_profiles").insert({
      user_id: user.id,
      company_name: data.companyName,
      project_types: data.projectTypes,
      website: data.website,
      credits: data.credits,
    });

    if (profileError) {
      setError(profileError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Completa tu perfil</h1>
        <p className="text-text-muted">
          {role === "talento"
            ? "Cuéntanos sobre tu experiencia como talento"
            : "Cuéntanos sobre tu empresa o productora"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Paso {currentStep} de {role === "talento" ? 3 : 2}
          </span>
          <span className="text-sm text-text-muted">
            {Math.round((currentStep / (role === "talento" ? 3 : 2)) * 100)}%
          </span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(currentStep / (role === "talento" ? 3 : 2)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}

      {role === "talento" ? (
        <form onSubmit={talentForm.handleSubmit(onSubmitTalent)} className="space-y-6">
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Información básica</h2>

              <div>
                <label htmlFor="stageName" className="block text-sm font-medium mb-2">
                  Nombre artístico <span className="text-red-500">*</span>
                </label>
                <input
                  {...talentForm.register("stageName")}
                  type="text"
                  id="stageName"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Ana García"
                />
                {talentForm.formState.errors.stageName && (
                  <p className="mt-1 text-sm text-red-500">
                    {talentForm.formState.errors.stageName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  {...talentForm.register("location")}
                  type="text"
                  id="location"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Madrid, España"
                />
                {talentForm.formState.errors.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {talentForm.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium mb-2">
                    Edad
                  </label>
                  <input
                    {...talentForm.register("age", { valueAsNumber: true })}
                    type="number"
                    id="age"
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="25"
                  />
                  {talentForm.formState.errors.age && (
                    <p className="mt-1 text-sm text-red-500">
                      {talentForm.formState.errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium mb-2">
                    Género
                  </label>
                  <select
                    {...talentForm.register("gender")}
                    id="gender"
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Selecciona...</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="no-binario">No binario</option>
                    <option value="prefiero-no-decir">Prefiero no decir</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium mb-2">
                    Altura (cm)
                  </label>
                  <input
                    {...talentForm.register("height", { valueAsNumber: true })}
                    type="number"
                    id="height"
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="170"
                  />
                  {talentForm.formState.errors.height && (
                    <p className="mt-1 text-sm text-red-500">
                      {talentForm.formState.errors.height.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  // Validate only current step fields
                  const isValid = await talentForm.trigger(["stageName", "location"]);
                  if (isValid) {
                    setCurrentStep(2);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Siguiente
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Fotos y videos</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Headshot <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                  <UploadcareUploader
                    onFileUpload={(cdnUrl) => {
                      talentForm.setValue("headshotUrl", cdnUrl);
                    }}
                    imgOnly={true}
                    value={talentForm.watch("headshotUrl")}
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Sube tu mejor foto headshot. Puedes recortar la imagen después de subirla.
                </p>
                {talentForm.formState.errors.headshotUrl && (
                  <p className="mt-1 text-sm text-red-500">
                    {talentForm.formState.errors.headshotUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Video Reel (opcional)
                </label>
                <div className="mb-2">
                  <UploadcareUploader
                    onFileUpload={(cdnUrl) => {
                      talentForm.setValue("reelUrl", cdnUrl);
                    }}
                    accept="video/*"
                    value={talentForm.watch("reelUrl")}
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Sube tu video reel o demo. También puedes pegar una URL de YouTube o Vimeo.
                </p>
                {talentForm.formState.errors.reelUrl && (
                  <p className="mt-1 text-sm text-red-500">
                    {talentForm.formState.errors.reelUrl.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // Validate only step 2 field
                    const isValid = await talentForm.trigger(["headshotUrl"]);
                    if (isValid) {
                      setCurrentStep(3);
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Experiencia y habilidades</h2>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Sobre ti
                </label>
                <textarea
                  {...talentForm.register("bio")}
                  id="bio"
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-vertical"
                  placeholder="Cuéntanos sobre tu experiencia, formación y qué tipo de proyectos buscas..."
                />
                <p className="mt-1 text-xs text-text-muted">Máximo 500 caracteres</p>
                {talentForm.formState.errors.bio && (
                  <p className="mt-1 text-sm text-red-500">
                    {talentForm.formState.errors.bio.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
                  disabled={isLoading}
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creando perfil..." : "Completar registro"}
                </button>
              </div>
            </>
          )}
        </form>
      ) : (
        <form onSubmit={producerForm.handleSubmit(onSubmitProducer)} className="space-y-6">
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Información de la empresa</h2>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  Nombre de la empresa <span className="text-red-500">*</span>
                </label>
                <input
                  {...producerForm.register("companyName")}
                  type="text"
                  id="companyName"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Producciones Ejemplo S.L."
                />
                {producerForm.formState.errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">
                    {producerForm.formState.errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Website (opcional)
                </label>
                <input
                  {...producerForm.register("website")}
                  type="url"
                  id="website"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="https://tuproducciones.com"
                />
                {producerForm.formState.errors.website && (
                  <p className="mt-1 text-sm text-red-500">
                    {producerForm.formState.errors.website.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={async () => {
                  // Validate only current step fields
                  const isValid = await producerForm.trigger(["companyName"]);
                  if (isValid) {
                    setCurrentStep(2);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Siguiente
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Portafolio</h2>

              <div>
                <label htmlFor="credits" className="block text-sm font-medium mb-2">
                  Créditos anteriores
                </label>
                <textarea
                  {...producerForm.register("credits")}
                  id="credits"
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-vertical"
                  placeholder="Proyectos destacados en los que has trabajado..."
                />
                <p className="mt-1 text-xs text-text-muted">Máximo 1000 caracteres</p>
                {producerForm.formState.errors.credits && (
                  <p className="mt-1 text-sm text-red-500">
                    {producerForm.formState.errors.credits.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
                  disabled={isLoading}
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-light text-background font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creando perfil..." : "Completar registro"}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default function CompletarPerfilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Cargando...</p>
          </div>
        </div>
      }
    >
      <CompletarPerfilForm />
    </Suspense>
  );
}
