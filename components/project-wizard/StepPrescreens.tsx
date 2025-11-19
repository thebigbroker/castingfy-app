"use client";

import { useState } from "react";
import { ProjectData, PrescreenQuestion } from "./types";

interface StepPrescreensProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>, callback?: () => void) => void;
  onSave: () => void;
  onFinish: () => void;
}

const QUESTION_TYPES = [
  { value: "text", label: "Text Answer" },
  { value: "yes_no", label: "Yes/No" },
  { value: "number", label: "Numeric" },
  { value: "multiple_choice", label: "Multiple Choice" },
];

const MEDIA_REQUIREMENTS = [
  "Headshot",
  "Full Body Photo",
  "Self-Tape / Audition Video",
  "Acting Reel",
  "Voice Reel",
  "Resume/CV",
  "Other Media",
];

export default function StepPrescreens({
  data,
  onUpdate,
  onSave,
  onFinish,
}: StepPrescreensProps) {
  const [questions, setQuestions] = useState<PrescreenQuestion[]>(
    data.prescreens?.questions || []
  );
  const [mediaRequirements, setMediaRequirements] = useState<string[]>(
    data.prescreens?.mediaRequirements || []
  );
  const [auditionInstructions, setAuditionInstructions] = useState(
    data.prescreens?.auditionInstructions || ""
  );
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "text",
  });

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const updated = [
        ...questions,
        {
          id: Date.now().toString(),
          ...newQuestion,
        },
      ];
      setQuestions(updated);
      updatePrescreens(updated, mediaRequirements, auditionInstructions);
      setNewQuestion({ question: "", type: "text" });
    }
  };

  const handleRemoveQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    updatePrescreens(updated, mediaRequirements, auditionInstructions);
  };

  const toggleMediaRequirement = (media: string) => {
    const updated = mediaRequirements.includes(media)
      ? mediaRequirements.filter((m) => m !== media)
      : [...mediaRequirements, media];
    setMediaRequirements(updated);
    updatePrescreens(questions, updated, auditionInstructions);
  };

  const handleInstructionsChange = (value: string) => {
    setAuditionInstructions(value);
    updatePrescreens(questions, mediaRequirements, value);
  };

  const updatePrescreens = (
    q: PrescreenQuestion[],
    m: string[],
    instructions: string
  ) => {
    onUpdate({
      prescreens: {
        questions: q,
        mediaRequirements: m,
        auditionInstructions: instructions,
      },
    });
  };

  const handleFinish = () => {
    onSave();
    onFinish();
  };

  if (data.roles.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Pre-Screens & Auditions</h1>
          <p className="text-gray-600">
            Set up pre-screening questions and audition requirements
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-yellow-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No roles created yet</h3>
          <p className="text-gray-600 mb-6">
            Please fill out the Project Details and Roles first in order to
            continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Pre-Screens & Auditions</h1>
        <p className="text-gray-600">
          Add screening questions and audition requirements for your project
        </p>
      </div>

      {/* Pre-Screen Questions */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Pre-Screen Questions</h2>

        <p className="text-sm text-gray-600 mb-6">
          Ask specific questions to filter candidates before reviewing their full
          submissions.
        </p>

        {/* Existing Questions */}
        {questions.length > 0 && (
          <div className="space-y-3 mb-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    Type: {q.type.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Question */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">
              Question
            </label>
            <input
              type="text"
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Do you have experience with stage combat?"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Response Type
              </label>
              <select
                value={newQuestion.type}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, type: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.question.trim()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Requirements */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Media Requirements</h2>

        <p className="text-sm text-gray-600 mb-6">
          Select what materials you need from candidates when they submit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MEDIA_REQUIREMENTS.map((media) => (
            <label
              key={media}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={mediaRequirements.includes(media)}
                onChange={() => toggleMediaRequirement(media)}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="font-medium">{media}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Audition Instructions */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Audition Instructions</h2>

        <p className="text-sm text-gray-600 mb-4">
          Provide detailed instructions for how candidates should prepare and
          submit their auditions.
        </p>

        <textarea
          value={auditionInstructions}
          onChange={(e) => handleInstructionsChange(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Example:&#10;&#10;Please prepare a 1-2 minute self-tape performing the sides provided. &#10;&#10;Requirements:&#10;- Good lighting and clear audio&#10;- Neutral background&#10;- Introduce yourself at the start&#10;- Submit in MP4 format"
        />
      </section>

      {/* Summary */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Project Summary</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Project:</span> {data.title}
          </p>
          <p>
            <span className="font-medium">Roles:</span> {data.roles.length}{" "}
            role{data.roles.length !== 1 ? "s" : ""}
          </p>
          <p>
            <span className="font-medium">Pre-screen questions:</span>{" "}
            {questions.length}
          </p>
          <p>
            <span className="font-medium">Media requirements:</span>{" "}
            {mediaRequirements.length}
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gray-50 border border-gray-200 text-text rounded-lg hover:bg-border transition-all font-semibold"
        >
          Save as Draft
        </button>
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
        >
          Finish & Publish Project
        </button>
      </div>
    </div>
  );
}
