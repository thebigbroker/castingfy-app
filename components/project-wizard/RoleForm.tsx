"use client";

import { useState } from "react";

interface Role {
  id?: string;
  category: string;
  subtype: string;
  name: string;
  description: string;
  ageMin: number;
  ageMax: number;
  isRemote: boolean;
  requirements: {
    gender: string[];
    ethnicity: string[];
    skills: string[];
    media: string[];
    accent: string[];
    language: string[];
    voiceStyle: string[];
    softwareSkills: string[];
  };
  flags: {
    nudity: boolean;
    explicitContent: boolean;
  };
}

interface RoleFormProps {
  category: string;
  initialData?: Role;
  onSave: (role: Role) => void;
  onCancel: () => void;
}

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Any"];
const ETHNICITY_OPTIONS = [
  "Asian",
  "Black/African",
  "Hispanic/Latino",
  "Middle Eastern",
  "White/Caucasian",
  "Mixed",
  "Other",
  "Any",
];

const SKILLS_OPTIONS = [
  "Dancing",
  "Singing",
  "Martial Arts",
  "Horse Riding",
  "Swimming",
  "Driving",
  "Sports",
  "Accents",
  "Musical Instruments",
];

const VOICE_STYLES = [
  "Warm",
  "Authoritative",
  "Friendly",
  "Professional",
  "Energetic",
  "Calm",
  "Character",
];

const SOFTWARE_SKILLS = [
  "Adobe Premiere",
  "Final Cut Pro",
  "DaVinci Resolve",
  "After Effects",
  "Photoshop",
  "Avid",
  "Pro Tools",
];

export default function RoleForm({
  category,
  initialData,
  onSave,
  onCancel,
}: RoleFormProps) {
  const [formData, setFormData] = useState({
    category,
    name: initialData?.name || "",
    description: initialData?.description || "",
    subtype: initialData?.subtype || "",
    ageMin: initialData?.ageMin || 18,
    ageMax: initialData?.ageMax || 100,
    isRemote: initialData?.isRemote || false,
    requirements: {
      gender: initialData?.requirements?.gender || [],
      ethnicity: initialData?.requirements?.ethnicity || [],
      skills: initialData?.requirements?.skills || [],
      media: initialData?.requirements?.media || [],
      accent: initialData?.requirements?.accent || [],
      language: initialData?.requirements?.language || [],
      voiceStyle: initialData?.requirements?.voiceStyle || [],
      softwareSkills: initialData?.requirements?.softwareSkills || [],
    },
    flags: {
      nudity: initialData?.flags?.nudity || false,
      explicitContent: initialData?.flags?.explicitContent || false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];
  };

  const getCategoryTitle = () => {
    const titles: Record<string, string> = {
      actors: "Actors & Performers",
      voiceover: "Voiceover",
      staff: "Staff & Crew",
      content_creators: "Content Creators",
      models: "Models",
      real_people: "Real People",
      other: "Other",
    };
    return titles[category] || category;
  };

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      content_creators:
        "Discover personalities and on-brand creators for UGC-style work",
      voiceover: "Discover voices for narration, dubbing, and more",
      staff: "Hire production staff and technical crew",
    };
    return descriptions[category];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={onCancel}
          className="text-primary hover:underline mb-4 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to role selection
        </button>
        <h1 className="text-3xl font-bold mb-2">{getCategoryTitle()}</h1>
        {getCategoryDescription() && (
          <p className="text-text-muted">{getCategoryDescription()}</p>
        )}
      </div>

      {/* Remote Work (for applicable categories) */}
      {(category === "content_creators" || category === "voiceover") && (
        <section className="bg-white border border-border rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRemote}
              onChange={(e) =>
                setFormData({ ...formData, isRemote: e.target.checked })
              }
              className="w-5 h-5 text-primary rounded"
            />
            <span className="font-medium">
              {category === "voiceover"
                ? "Home studio recordings accepted"
                : "This is a Remote / Work-from-Home opportunity"}
            </span>
          </label>
        </section>
      )}

      {/* Basic Information */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Role Information</h2>

        <div className="space-y-6">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {category === "staff" ? "Job Title" : "Role name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                category === "staff"
                  ? "e.g., Camera Operator"
                  : "e.g., Lead Actor"
              }
            />
          </div>

          {/* Role Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {category === "staff" ? "Job" : "Role"} description{" "}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-text-muted mb-2">
              Late 20s to early 30s. Skilled archer and natural leader. Must be
              able to perform own stunts.
            </p>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              minLength={300}
              maxLength={1000}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe the role in detail..."
            />
            <p className="text-xs text-text-muted mt-1">
              {formData.description.length}/1000 characters (minimum 300)
            </p>
          </div>

          {/* Age Range (for applicable categories) */}
          {category !== "staff" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum age
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.ageMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageMin: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Maximum age
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.ageMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageMax: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Requirements & Details */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          Additional Details & Requirements
        </h2>

        <div className="space-y-6">
          {/* Gender (for actors, models, real people) */}
          {(category === "actors" ||
            category === "models" ||
            category === "real_people") && (
            <div>
              <label className="block text-sm font-medium mb-3">Gender</label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          gender: toggleArrayValue(
                            formData.requirements.gender,
                            gender
                          ),
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.requirements.gender.includes(gender)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:bg-surface"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ethnicity */}
          {(category === "actors" ||
            category === "models" ||
            category === "real_people") && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Ethnicity
              </label>
              <div className="flex flex-wrap gap-2">
                {ETHNICITY_OPTIONS.map((ethnicity) => (
                  <button
                    key={ethnicity}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          ethnicity: toggleArrayValue(
                            formData.requirements.ethnicity,
                            ethnicity
                          ),
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.requirements.ethnicity.includes(ethnicity)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:bg-surface"
                    }`}
                  >
                    {ethnicity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills (for actors) */}
          {category === "actors" && (
            <div>
              <label className="block text-sm font-medium mb-3">Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          skills: toggleArrayValue(
                            formData.requirements.skills,
                            skill
                          ),
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.requirements.skills.includes(skill)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:bg-surface"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Style (for voiceover) */}
          {category === "voiceover" && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Voice Style
              </label>
              <div className="flex flex-wrap gap-2">
                {VOICE_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          voiceStyle: toggleArrayValue(
                            formData.requirements.voiceStyle,
                            style
                          ),
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.requirements.voiceStyle.includes(style)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:bg-surface"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Software Skills (for staff) */}
          {category === "staff" && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Software & Program Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {SOFTWARE_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          softwareSkills: toggleArrayValue(
                            formData.requirements.softwareSkills,
                            skill
                          ),
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.requirements.softwareSkills.includes(skill)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:bg-surface"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Nudity / Explicit Content */}
      {(category === "actors" ||
        category === "models" ||
        category === "real_people") && (
        <section className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Content Rating</h2>

          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              Does this role require nudity?
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="nudity"
                  checked={formData.flags.nudity}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      flags: { ...formData.flags, nudity: true },
                    })
                  }
                  className="w-4 h-4 text-primary"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="nudity"
                  checked={!formData.flags.nudity}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      flags: { ...formData.flags, nudity: false },
                    })
                  }
                  className="w-4 h-4 text-primary"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </section>
      )}

      {(category === "voiceover" || category === "staff") && (
        <section className="bg-white border border-border rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.flags.explicitContent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  flags: {
                    ...formData.flags,
                    explicitContent: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-primary rounded"
            />
            <span className="font-medium">This role is for explicit content</span>
          </label>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-surface border border-border text-text rounded-lg hover:bg-border transition-all font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
        >
          Save Role
        </button>
      </div>
    </form>
  );
}
