"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface User {
  id: string;
  email: string;
  role: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  connectionStatus: string;
}

export default function ExplorarPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(""); // "", "talento", "productor"

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    searchUsers();
  }, [roleFilter]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    searchUsers();
  };

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (roleFilter) params.append("role", roleFilter);

      const response = await fetch(`/api/users/search?${params.toString()}`);
      const data = await response.json();

      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers();
  };

  const handleConnect = async (userId: string) => {
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedUserId: userId }),
      });

      if (response.ok) {
        // Actualizar estado local
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, connectionStatus: "pending" } : u
          )
        );
      }
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-surface rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Explorar Talentos</h1>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, ubicación, bio..."
              className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
            >
              Buscar
            </button>
          </form>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setRoleFilter("")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                roleFilter === ""
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setRoleFilter("talento")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                roleFilter === "talento"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border"
              }`}
            >
              Talentos
            </button>
            <button
              onClick={() => setRoleFilter("productor")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                roleFilter === "productor"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border"
              }`}
            >
              Productores
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-lg p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-surface rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface rounded w-3/4 mb-2" />
                    <div className="h-3 bg-surface rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-surface rounded w-full mb-2" />
                <div className="h-3 bg-surface rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-text-muted mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-text-muted mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-sm text-text-muted">
              Prueba con otros términos de búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-all"
              >
                {/* Avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 relative flex-shrink-0">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.displayName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {user.displayName}
                    </h3>
                    <p className="text-sm text-text-muted capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">
                    {user.bio}
                  </p>
                )}

                {/* Location */}
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
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
                    {user.location}
                  </div>
                )}

                {/* Connect button */}
                {user.connectionStatus === "none" && (
                  <button
                    onClick={() => handleConnect(user.id)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
                  >
                    Conectar
                  </button>
                )}
                {user.connectionStatus === "pending" && (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-surface text-text-muted rounded-lg cursor-not-allowed font-semibold"
                  >
                    Solicitud enviada
                  </button>
                )}
                {user.connectionStatus === "accepted" && (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-not-allowed font-semibold"
                  >
                    ✓ Conectado
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
