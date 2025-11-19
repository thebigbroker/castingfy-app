"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import UploadcareUploader from "@/components/UploadcareUploader";

interface UserData {
  id: string;
  email: string;
  role: string;
  status: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    stageName: "",
    companyName: "",
    bio: "",
    location: "",
    instagramUrl: "",
    imdbUrl: "",
    headshotUrl: "",
  });

  const loadUserData = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.push("/login");
      return;
    }

    setUser(authUser);

    const { data: dbUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setUserData(dbUser);

    // Get profile based on role
    if (dbUser?.role === "talento") {
      const { data: talentProfile } = await supabase
        .from("talent_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setFormData({
        stageName: talentProfile?.stage_name || "",
        companyName: "",
        bio: talentProfile?.bio || "",
        location: talentProfile?.location || "",
        instagramUrl: talentProfile?.instagram_url || "",
        imdbUrl: talentProfile?.imdb_url || "",
        headshotUrl: talentProfile?.headshot_url || "",
      });
    } else if (dbUser?.role === "productor") {
      const { data: producerProfile } = await supabase
        .from("producer_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setFormData({
        stageName: "",
        companyName: producerProfile?.company_name || "",
        bio: producerProfile?.bio || "",
        location: producerProfile?.location || "",
        instagramUrl: producerProfile?.instagram_url || "",
        imdbUrl: producerProfile?.imdb_url || "",
        headshotUrl: "",
      });
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (userData?.role === "talento") {
        const { error: updateError } = await supabase
          .from("talent_profiles")
          .update({
            stage_name: formData.stageName,
            bio: formData.bio,
            location: formData.location,
            instagram_url: formData.instagramUrl,
            imdb_url: formData.imdbUrl,
            headshot_url: formData.headshotUrl,
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else if (userData?.role === "productor") {
        const { error: updateError } = await supabase
          .from("producer_profiles")
          .update({
            company_name: formData.companyName,
            bio: formData.bio,
            location: formData.location,
            instagram_url: formData.instagramUrl,
            imdb_url: formData.imdbUrl,
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Headshot for talent */}
            {userData?.role === "talento" && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Foto de perfil (Headshot)
                </label>
                {formData.headshotUrl && (
                  <div className="mb-4">
                    <img
                      src={formData.headshotUrl}
                      alt="Headshot actual"
                      className="w-32 h-32 rounded-full object-cover border-4 border-border"
                    />
                  </div>
                )}
                <UploadcareUploader
                  onFileUpload={(url) => setFormData({ ...formData, headshotUrl: url })}
                  accept="image/*"
                  imgOnly={true}
                  value={formData.headshotUrl}
                />
                <p className="text-xs text-text-muted mt-2">
                  📸 Tu foto de perfil profesional. Recomendado: foto de rostro clara y bien iluminada.
                </p>
              </div>
            )}

            {/* Name field based on role */}
            {userData?.role === "talento" ? (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nombre artístico
                </label>
                <input
                  type="text"
                  value={formData.stageName}
                  onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Tu nombre artístico"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Nombre de tu empresa"
                />
              </div>
            )}

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                rows={4}
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Ciudad, País"
              />
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="https://instagram.com/tu_usuario"
              />
              <p className="text-xs text-text-muted mt-2">
                📸 Tu portafolio de Instagram aparecerá en tu perfil
              </p>
            </div>

            {/* IMDB URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                IMDB
              </label>
              <input
                type="url"
                value={formData.imdbUrl}
                onChange={(e) => setFormData({ ...formData, imdbUrl: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="https://www.imdb.com/name/nmXXXXXXX/"
              />
              <p className="text-xs text-text-muted mt-2">
                🎬 Tu perfil profesional de IMDB aparecerá en tu dashboard
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  ✅ Perfil actualizado correctamente. Redirigiendo...
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
