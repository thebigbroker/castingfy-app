"use client";

import { useState, useEffect } from "react";

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  gender: string;
  skills: string[];
  location: string;
}

const AVAILABLE_SKILLS = [
  "Actuar",
  "Canto",
  "Baile",
  "Acrobacias",
  "Artes Marciales",
  "Doblaje",
  "Improvisación",
  "Stand-up Comedy",
  "Instrumentos Musicales",
  "Teatro Musical",
  "Conducción de vehículos especiales",
  "Equitación",
];

const GENDER_OPTIONS = [
  { value: "", label: "Cualquiera" },
  { value: "Hombre", label: "Hombre" },
  { value: "Mujer", label: "Mujer" },
  { value: "No binario", label: "No binario" },
  { value: "Otro", label: "Otro" },
];

export default function FiltersPanel({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: FiltersPanelProps) {
  const [gender, setGender] = useState(initialFilters?.gender || "");
  const [skills, setSkills] = useState<string[]>(initialFilters?.skills || []);
  const [location, setLocation] = useState(initialFilters?.location || "");

  useEffect(() => {
    if (initialFilters) {
      setGender(initialFilters.gender || "");
      setSkills(initialFilters.skills || []);
      setLocation(initialFilters.location || "");
    }
  }, [initialFilters]);

  const handleSkillToggle = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleClear = () => {
    setGender("");
    setSkills([]);
    setLocation("");
  };

  const handleApply = () => {
    onApply({ gender, skills, location });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Filtros Avanzados</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Género Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Género</h3>
            <div className="space-y-2">
              {GENDER_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              Habilidades
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Selecciona una o más habilidades. Mostraremos solo talentos que
              tengan TODAS las habilidades seleccionadas.
            </p>
            <div className="space-y-2">
              {AVAILABLE_SKILLS.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm font-medium">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              Ubicación
            </h3>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Madrid, Barcelona, Valencia..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              Buscaremos talentos cuya ubicación incluya este texto
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all font-semibold"
          >
            Limpiar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-semibold"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </>
  );
}
