"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface InstagramFeedProps {
  instagramUrl: string | null;
}

interface InstagramPhoto {
  id: string;
  thumbnail: string;
  url: string;
}

export default function InstagramFeed({ instagramUrl }: InstagramFeedProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [photos, setPhotos] = useState<InstagramPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (instagramUrl) {
      // Extraer username de la URL de Instagram
      const match = instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
      if (match) {
        const extractedUsername = match[1];
        setUsername(extractedUsername);
        fetchInstagramPhotos(extractedUsername);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [instagramUrl]);

  const fetchInstagramPhotos = async (user: string) => {
    try {
      setIsLoading(true);
      setError(false);

      console.log(`[InstagramFeed] Fetching photos for: ${user}`);
      const response = await fetch(`/api/instagram/feed?username=${user}`);
      const data = await response.json();

      console.log(`[InstagramFeed] Response:`, data);

      if (data.success && data.photos.length > 0) {
        console.log(`[InstagramFeed] Successfully loaded ${data.photos.length} photos`);
        setPhotos(data.photos);
      } else {
        console.warn(`[InstagramFeed] No photos found or error occurred`);
        setError(true);
      }
    } catch (err) {
      console.error("[InstagramFeed] Error fetching Instagram photos:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!instagramUrl || !username) {
    return null;
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </h3>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          @{username}
        </a>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-surface rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Photos grid */}
      {!isLoading && !error && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <a
              key={photo.id}
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-surface rounded-lg overflow-hidden hover:opacity-80 transition-opacity relative"
            >
              <Image
                src={photo.thumbnail}
                alt="Instagram photo"
                fill
                className="object-cover"
                unoptimized
              />
            </a>
          ))}
        </div>
      )}

      {/* Error/Fallback state - placeholders */}
      {!isLoading && (error || photos.length === 0) && (
        <div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center"
              >
                <p className="text-xs text-text-muted text-center px-2">
                  Foto {i}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-muted text-center">
            {error
              ? "⚠️ No se pudieron cargar las fotos. El perfil debe ser público."
              : "💡 Las fotos se mostrarán automáticamente si el perfil es público"
            }
          </p>
        </div>
      )}

      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Ver perfil completo en Instagram →
      </a>
    </div>
  );
}
