"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Connection {
  id: string;
  status: string;
  createdAt: string;
  isIncoming: boolean;
  otherUser: {
    id: string;
    email: string;
    role: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
  };
}

export default function RedPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"accepted" | "pending">("accepted");

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    loadConnections();
  };

  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/connections?status=${tab}`);
      const data = await response.json();

      if (data.connections) {
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      const response = await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, status: "accepted" }),
      });

      if (response.ok) {
        loadConnections();
      }
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      const response = await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, status: "rejected" }),
      });

      if (response.ok) {
        loadConnections();
      }
    } catch (error) {
      console.error("Error rejecting connection:", error);
    }
  };

  const handleDelete = async (connectionId: string) => {
    if (!confirm("¿Eliminar esta conexión?")) return;

    try {
      const response = await fetch(
        `/api/connections?connectionId=${connectionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadConnections();
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
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
              <h1 className="text-2xl font-bold">Mi Red</h1>
            </div>

            <button
              onClick={() => router.push("/explorar")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explorar
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab("accepted")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tab === "accepted"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border"
              }`}
            >
              Mis Conexiones
            </button>
            <button
              onClick={() => setTab("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tab === "pending"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border"
              }`}
            >
              Solicitudes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
              </div>
            ))}
          </div>
        ) : connections.length === 0 ? (
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
              {tab === "accepted"
                ? "No tienes conexiones aún"
                : "No tienes solicitudes pendientes"}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {tab === "accepted"
                ? "Comienza a conectar con otros profesionales"
                : "Las solicitudes aparecerán aquí"}
            </p>
            {tab === "accepted" && (
              <button
                onClick={() => router.push("/explorar")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
              >
                Explorar talentos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-all"
              >
                {/* Avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 relative flex-shrink-0">
                    {connection.otherUser.avatarUrl ? (
                      <Image
                        src={connection.otherUser.avatarUrl}
                        alt={connection.otherUser.displayName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                        {connection.otherUser.displayName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {connection.otherUser.displayName}
                    </h3>
                    <p className="text-sm text-text-muted capitalize">
                      {connection.otherUser.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {connection.otherUser.bio && (
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">
                    {connection.otherUser.bio}
                  </p>
                )}

                {/* Location */}
                {connection.otherUser.location && (
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
                    {connection.otherUser.location}
                  </div>
                )}

                {/* Actions */}
                {tab === "pending" && connection.isIncoming ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(connection.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleReject(connection.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
                    >
                      Rechazar
                    </button>
                  </div>
                ) : tab === "pending" && !connection.isIncoming ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-surface text-text-muted rounded-lg cursor-not-allowed font-semibold"
                  >
                    Enviada
                  </button>
                ) : (
                  <button
                    onClick={() => handleDelete(connection.id)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold"
                  >
                    Eliminar conexión
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
