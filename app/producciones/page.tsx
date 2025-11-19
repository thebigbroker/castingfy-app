"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  project_type: string;
  status: string;
  budget_range: string;
  start_date: string;
  end_date: string;
  location: string;
  created_at: string;
}

export default function ProduccionesPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectType: "",
    budgetRange: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    loadProjects();
  };

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          projectType: "",
          budgetRange: "",
          startDate: "",
          endDate: "",
          location: "",
        });
        loadProjects();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    try {
      const response = await fetch(`/api/projects?projectId=${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      active: "bg-green-100 text-green-700",
      casting: "bg-blue-100 text-blue-700",
      production: "bg-purple-100 text-purple-700",
      completed: "bg-teal-100 text-teal-700",
      archived: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Borrador",
      active: "Activo",
      casting: "En Casting",
      production: "En Producción",
      completed: "Completado",
      archived: "Archivado",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold">Mis Producciones</h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Proyecto
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
                <div className="h-6 bg-surface rounded w-3/4 mb-4" />
                <div className="h-4 bg-surface rounded w-full mb-2" />
                <div className="h-4 bg-surface rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
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
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-text-muted mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Crea tu primer proyecto de casting
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
            >
              Crear Proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-all"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-text-muted line-clamp-3 mb-3">
                    {project.description}
                  </p>
                )}

                {/* Project type */}
                {project.project_type && (
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
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
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                    <span className="capitalize">{project.project_type}</span>
                  </div>
                )}

                {/* Location */}
                {project.location && (
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
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
                    {project.location}
                  </div>
                )}

                {/* Date */}
                {project.start_date && (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(project.start_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Nuevo Proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nuevo Proyecto</h2>
                <button
                  onClick={() => setShowModal(false)}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Tipo de Proyecto */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Proyecto
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="film">Película</option>
                    <option value="series">Serie</option>
                    <option value="commercial">Comercial</option>
                    <option value="theater">Teatro</option>
                    <option value="music_video">Video Musical</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Presupuesto */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rango de Presupuesto
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetRange: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar rango</option>
                    <option value="low">Bajo (&lt; $10k)</option>
                    <option value="medium">Medio ($10k - $100k)</option>
                    <option value="high">Alto (&gt; $100k)</option>
                  </select>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ciudad, País"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-surface text-text rounded-lg hover:bg-border transition-all font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
                  >
                    Crear Proyecto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
