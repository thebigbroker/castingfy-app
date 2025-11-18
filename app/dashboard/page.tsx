"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileHeader from "@/components/ProfileHeader";
import CreatePost from "@/components/CreatePost";
import PostsFeed from "@/components/PostsFeed";
import InstagramFeed from "@/components/InstagramFeed";
import type { User } from "@supabase/supabase-js";

interface UserData {
  id: string;
  email: string;
  role: string;
  status: string;
}

interface Profile {
  stage_name?: string;
  company_name?: string;
  headshot_url?: string;
  location?: string;
  bio?: string;
  instagram_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    // Get user data
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

      setProfile(talentProfile);
    } else if (dbUser?.role === "productor") {
      const { data: producerProfile } = await supabase
        .from("producer_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setProfile(producerProfile);
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
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
      {/* Header con botón de cerrar sesión */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎬</span>
            <h1 className="text-2xl font-bold">Castingfy</h1>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Profile Header */}
      {userData && (
        <ProfileHeader
          user={userData}
          profile={profile}
          isOwnProfile={true}
        />
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sobre mí */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Información</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-text-muted">{user.email}</span>
                </div>

                {profile?.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-text-muted">{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-text-muted capitalize">{userData?.role}</span>
                </div>
              </div>

              {!profile && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-primary font-medium mb-2">
                    Completa tu perfil
                  </p>
                  <p className="text-xs text-text-muted mb-3">
                    Añade más información para destacar
                  </p>
                  <a
                    href="/registro/completar-perfil"
                    className="block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-semibold"
                  >
                    Completar ahora
                  </a>
                </div>
              )}
            </div>

            {/* Instagram Feed */}
            {profile?.instagram_url && (
              <InstagramFeed instagramUrl={profile.instagram_url} />
            )}
          </div>

          {/* Columna central - Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Crear post */}
            {user && <CreatePost userId={user.id} onPostCreated={handlePostCreated} />}

            {/* Feed de posts */}
            {user && <PostsFeed userId={user.id} refreshTrigger={refreshTrigger} />}
          </div>
        </div>
      </div>
    </div>
  );
}
