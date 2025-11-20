"use client";

import { useState, useEffect } from "react";
import StepProjectDetails from "./StepProjectDetails";
import StepRoles from "./StepRoles";
import StepCompensation from "./StepCompensation";
import StepPrescreens from "./StepPrescreens";
import { ProjectData } from "./types";

interface ProjectWizardProps {
  projectId?: string;
  onClose: () => void;
  onSave: (data: ProjectData) => void;
}

const STEPS = [
  { id: 1, name: "Project Details", key: "details" },
  { id: 2, name: "Roles", key: "roles" },
  { id: 3, name: "Compensation", key: "compensation" },
  { id: 4, name: "Pre-Screens & Auditions", key: "prescreens" },
];

export default function ProjectWizard({
  projectId,
  onClose,
  onSave,
}: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: "",
    type: "",
    description: "",
    unionStatus: "",
    datesAndLocations: "",
    hireFrom: "",
    hasSpecialInstructions: false,
    specialInstructions: "",
    materials: {
      media: [],
      texts: [],
    },
    roles: [],
    compensation: {
      byRole: {},
    },
    prescreens: {
      questions: [],
      mediaRequirements: [],
      auditionInstructions: "",
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSavedBy: "",
    },
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (data.project) {
        setProjectData(data.project);
      }
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  const handleSave = async (goToNextStep = false) => {
    try {
      const method = projectData.id ? "PATCH" : "POST";
      const response = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectData,
          projectId: projectData.id,
        }),
      });

      const data = await response.json();
      if (data.project) {
        // Only update ID from server, keep all other data from current state
        setProjectData((prev) => ({
          ...prev,
          id: data.project.id,
          meta: {
            ...prev.meta,
            ...data.project.meta,
          },
        }));
        setLastSaved(new Date());
        onSave(data.project);

        if (goToNextStep && currentStep < 4) {
          setCurrentStep(currentStep + 1);
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const updateProjectData = (updates: Partial<ProjectData>, callback?: () => void) => {
    setProjectData((prev) => ({
      ...prev,
      ...updates,
      meta: {
        ...prev.meta,
        updatedAt: new Date().toISOString(),
      },
    }));

    // Execute callback after state update (in next tick)
    if (callback) {
      // Use a microtask to ensure state update has been processed
      Promise.resolve().then(callback);
    }
  };

  const canProceedToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!projectData.title;
    if (step === 3) return projectData.roles.length > 0;
    if (step === 4) return projectData.roles.length > 0;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-black">CASTINGFY</h2>
          <p className="text-sm text-gray-600">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden bg-gray-50 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const canAccess = canProceedToStep(step.id);

            return (
              <button
                key={step.id}
                onClick={() => canAccess && setCurrentStep(step.id)}
                disabled={!canAccess}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : isCompleted
                    ? "bg-green-100 text-green-700"
                    : canAccess
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCompleted ? "✓" : step.id}. {step.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 bg-gray-50 border-r border-gray-200 flex-col">
        {/* Company Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            COMPANY DETAILS
          </h3>
          <div className="space-y-2">
            <p className="font-medium text-black">Mi Compañía</p>
            <p className="text-sm text-gray-600">Privacy Settings</p>
            <button className="text-sm text-black hover:underline">
              Edit
            </button>
          </div>
          {lastSaved && (
            <p className="text-xs text-gray-500 mt-4">
              Last saved on {lastSaved.toLocaleString()}
            </p>
          )}
        </div>

        {/* Navigation Steps */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const canAccess = canProceedToStep(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => canAccess && setCurrentStep(step.id)}
                  disabled={!canAccess}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-black text-white"
                      : isCompleted
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : canAccess
                      ? "hover:bg-gray-200"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-white text-black"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : step.id}
                  </span>
                  <span className="font-medium">{step.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Close Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
          >
            Save & Exit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          {currentStep === 1 && (
            <StepProjectDetails
              data={projectData}
              onUpdate={updateProjectData}
              onSave={() => handleSave(false)}
              onSaveAndContinue={() => handleSave(true)}
            />
          )}
          {currentStep === 2 && (
            <StepRoles
              data={projectData}
              onUpdate={updateProjectData}
              onSave={() => handleSave(false)}
              onNext={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <StepCompensation
              data={projectData}
              onUpdate={updateProjectData}
              onSave={() => handleSave(false)}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}
          {currentStep === 4 && (
            <StepPrescreens
              data={projectData}
              onUpdate={updateProjectData}
              onSave={() => handleSave(false)}
              onFinish={() => {
                handleSave(false);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
