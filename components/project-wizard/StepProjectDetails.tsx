"use client";

import { useState } from "react";

interface ProjectData {
  title: string;
  type: string;
  description: string;
  unionStatus: string;
  datesAndLocations: string;
  hireFrom: string;
  hasSpecialInstructions: boolean;
  specialInstructions: string;
  materials: {
    media: string[];
    texts: string[];
  };
}

interface ProjectDetailsProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
}

const PROJECT_TYPES = [
  "Film",
  "TV Series",
  "Commercial",
  "Theater",
  "Music Video",
  "Web Series",
  "Documentary",
  "Short Film",
  "Student Film",
  "Other",
];

const LOCATION_TYPES = [
  "Local/Regional",
  "National",
  "International",
  "Remote/Online",
  "Multiple Locations",
];

export default function StepProjectDetails({
  data,
  onUpdate,
  onSave,
  onSaveAndContinue,
}: ProjectDetailsProps) {
  const [showSpecialInstructions, setShowSpecialInstructions] = useState(
    data.hasSpecialInstructions
  );

  const handleFieldChange = <K extends keyof ProjectData>(
    field: K,
    value: ProjectData[K]
  ) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tell us about your project…</h1>
        <p className="text-text-muted">
          Provide the essential details about your production
        </p>
      </div>

      {/* Basic Information */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="For example, 'Robin Hood'"
              maxLength={200}
            />
            <p className="text-xs text-text-muted mt-1">
              {data.title.length}/200 characters
            </p>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project type <span className="text-red-500">*</span>
            </label>
            <select
              value={data.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select project type</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project description
            </label>
            <p className="text-sm text-text-muted mb-2">
              Give some background about your project, but try to keep it short
              and sweet.
            </p>
            <textarea
              value={data.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe your project..."
            />
            <p className="text-xs text-text-muted mt-1">
              {data.description.length}/1000 characters
            </p>
          </div>
        </div>
      </section>

      {/* Union Status */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Union status</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              name="unionStatus"
              value="both"
              checked={data.unionStatus === "both"}
              onChange={(e) => handleFieldChange("unionStatus", e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <div>
              <p className="font-medium">Sindicatos y no sindicatos</p>
              <p className="text-sm text-text-muted">
                Abierto a todos los talentos
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              name="unionStatus"
              value="union"
              checked={data.unionStatus === "union"}
              onChange={(e) => handleFieldChange("unionStatus", e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <div>
              <p className="font-medium">Sindicado</p>
              <p className="text-sm text-text-muted">
                Solo miembros de sindicatos
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              name="unionStatus"
              value="non-union"
              checked={data.unionStatus === "non-union"}
              onChange={(e) => handleFieldChange("unionStatus", e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <div>
              <p className="font-medium">No Sindicado</p>
              <p className="text-sm text-text-muted">
                Solo talento no sindicalizado
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              name="unionStatus"
              value="na"
              checked={data.unionStatus === "na"}
              onChange={(e) => handleFieldChange("unionStatus", e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <div>
              <p className="font-medium">N/A</p>
              <p className="text-sm text-text-muted">No aplicable</p>
            </div>
          </label>
        </div>
      </section>

      {/* Project Dates & Locations */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          Project Dates & Locations
        </h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Key dates & Locations
          </label>
          <textarea
            value={data.datesAndLocations}
            onChange={(e) =>
              handleFieldChange("datesAndLocations", e.target.value)
            }
            rows={4}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Ensayos en Madrid del 1-15 de marzo. Rodaje en Barcelona del 20 de marzo al 10 de abril..."
          />
        </div>
      </section>

      {/* Where to hire talent from */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          Where do you want to hire talent from?
        </h2>

        <div>
          <select
            value={data.hireFrom}
            onChange={(e) => handleFieldChange("hireFrom", e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a location type</option>
            {LOCATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Special Submission Instructions */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          Special submission instructions
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Do you want to add special submission instructions?
          </p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="specialInstructions"
                checked={showSpecialInstructions}
                onChange={() => {
                  setShowSpecialInstructions(true);
                  handleFieldChange("hasSpecialInstructions", true);
                }}
                className="w-4 h-4 text-primary"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="specialInstructions"
                checked={!showSpecialInstructions}
                onChange={() => {
                  setShowSpecialInstructions(false);
                  handleFieldChange("hasSpecialInstructions", false);
                  handleFieldChange("specialInstructions", "");
                }}
                className="w-4 h-4 text-primary"
              />
              <span>No</span>
            </label>
          </div>

          {showSpecialInstructions && (
            <textarea
              value={data.specialInstructions}
              onChange={(e) =>
                handleFieldChange("specialInstructions", e.target.value)
              }
              rows={4}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Add any special instructions for submissions..."
            />
          )}
        </div>
      </section>

      {/* Additional Materials */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Additional Materials</h2>

        <p className="text-sm text-text-muted mb-4">
          You can add sides, logos, posters, or other materials to help
          candidates understand your project better.
        </p>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-border transition-colors flex items-center gap-2">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Add Media
          </button>
          <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-border transition-colors flex items-center gap-2">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Add Text
          </button>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-surface border border-border text-text rounded-lg hover:bg-border transition-all font-semibold"
        >
          Save Details
        </button>
        <button
          onClick={onSaveAndContinue}
          disabled={!data.title || !data.type}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Continue to Roles
        </button>
      </div>
    </div>
  );
}
