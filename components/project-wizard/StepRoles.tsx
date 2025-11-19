"use client";

import { useState } from "react";
import RoleForm from "./RoleForm";
import { ProjectData, Role } from "./types";

interface StepRolesProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
  onSave: () => void;
}

const ROLE_CATEGORIES = [
  {
    id: "actors",
    title: "Actors & Performers",
    subtitle: "Find talent for stage, screen, and live performance",
    icon: "🎭",
  },
  {
    id: "voiceover",
    title: "Voiceover",
    subtitle: "Discover voices for narration, dubbing, and more",
    icon: "🎙️",
  },
  {
    id: "staff",
    title: "Staff & Crew",
    subtitle: "Hire production staff and technical crew",
    icon: "🎬",
  },
  {
    id: "content_creators",
    title: "Content Creators",
    subtitle: "Discover personalities and on-brand creators for UGC-style work",
    icon: "📱",
  },
  {
    id: "models",
    title: "Models",
    subtitle: "Find models for fashion, commercial, and promotional work",
    icon: "👗",
  },
  {
    id: "real_people",
    title: "Real People",
    subtitle: "Cast authentic individuals for documentary and testimonial content",
    icon: "👥",
  },
  {
    id: "other",
    title: "Other",
    subtitle: "Other types of talent and creative professionals",
    icon: "✨",
  },
];

export default function StepRoles({ data, onUpdate, onSave }: StepRolesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setEditingRole(null);
    setShowForm(true);
  };

  const handleSaveRole = (role: Role) => {
    const updatedRoles = editingRole
      ? data.roles.map((r: Role) => (r.id === editingRole.id ? role : r))
      : [...data.roles, { ...role, id: Date.now().toString() }];

    onUpdate({ roles: updatedRoles });
    setShowForm(false);
    setSelectedCategory(null);
    setEditingRole(null);
    onSave();
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setSelectedCategory(role.category);
    setShowForm(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("¿Eliminar este rol?")) {
      const updatedRoles = data.roles.filter((r: Role) => r.id !== roleId);
      onUpdate({ roles: updatedRoles });
      onSave();
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedCategory(null);
    setEditingRole(null);
  };

  if (showForm && selectedCategory) {
    return (
      <RoleForm
        category={selectedCategory}
        initialData={editingRole}
        onSave={handleSaveRole}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Add a Role</h1>
        <p className="text-text-muted">
          Select the type of talent you&apos;re looking for
        </p>
      </div>

      {/* Existing Roles */}
      {data.roles.length > 0 && (
        <section className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Roles</h2>
            <span className="text-sm text-text-muted">
              {data.roles.length} role{data.roles.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {data.roles.map((role: Role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-border transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{role.name}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-text-muted">
                    <span className="capitalize">{role.category.replace("_", " ")}</span>
                    <span>
                      Age: {role.ageMin}-{role.ageMax}
                    </span>
                    {role.isRemote && <span>• Remote</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="px-3 py-2 text-sm bg-white border border-border rounded-lg hover:bg-surface transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="px-3 py-2 text-sm text-red-600 bg-white border border-border rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Role Categories Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Select Role Type</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="p-6 bg-white border-2 border-border rounded-lg hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-text-muted">{category.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Info Message */}
      {data.roles.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Add at least one role to continue to Compensation and Pre-Screens
          </p>
        </div>
      )}
    </div>
  );
}
