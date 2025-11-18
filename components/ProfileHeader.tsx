"use client";

import { useState } from "react";

interface ProfileHeaderProps {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
  profile: {
    stage_name?: string;
    company_name?: string;
    headshot_url?: string;
    location?: string;
    bio?: string;
    instagram_url?: string;
  } | null;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ user, profile, isOwnProfile }: ProfileHeaderProps) {
  const [showChatModal, setShowChatModal] = useState(false);

  const displayName = profile?.stage_name || profile?.company_name || user.email.split('@')[0];
  const avatarUrl = profile?.headshot_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200&background=6dcff6&color=fff`;

  return (
    <div>
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 h-48 relative">
        {/* Gradient cover */}
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Avatar y nombre */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left mb-4">
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <p className="text-text-muted">
                {user.role === "talento" ? "Talento" : "Productor"}
                {profile?.location && ` · ${profile.location}`}
              </p>
              {profile?.bio && (
                <p className="text-sm text-text-muted mt-2 max-w-2xl">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-center md:justify-end">
            {!isOwnProfile && (
              <button
                onClick={() => setShowChatModal(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chatear
              </button>
            )}

            {isOwnProfile && (
              <a
                href="/dashboard/editar-perfil"
                className="px-6 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* Links sociales */}
        {profile?.instagram_url && (
          <div className="mt-4 flex gap-3">
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          </div>
        )}
      </div>

      {/* Modal Chat Próximamente */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Chat - Próximamente</h3>
              <p className="text-text-muted mb-6">
                Estamos trabajando en el sistema de mensajería para que puedas chatear directamente con otros usuarios.
              </p>
              <button
                onClick={() => setShowChatModal(false)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold w-full"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
