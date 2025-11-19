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
        // Merge server response with current state to preserve all data
        setProjectData((prev) => ({
          ...prev,
          ...data.project,
          id: data.project.id,
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

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData({
      ...projectData,
      ...updates,
      meta: {
        ...projectData.meta,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const canProceedToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!projectData.title;
    if (step === 3) return projectData.roles.length > 0;
    if (step === 4) return projectData.roles.length > 0;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border flex flex-col">
        {/* Company Details */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-text-muted mb-2">
            COMPANY DETAILS
          </h3>
          <div className="space-y-2">
            <p className="font-medium">Mi Compañía</p>
            <p className="text-sm text-text-muted">Privacy Settings</p>
            <button className="text-sm text-primary hover:underline">
              Edit
            </button>
          </div>
          {lastSaved && (
            <p className="text-xs text-text-muted mt-4">
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
                      ? "bg-primary text-white"
                      : isCompleted
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : canAccess
                      ? "hover:bg-border"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-white text-primary"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-border text-text-muted"
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
        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-surface text-text border border-border rounded-lg hover:bg-border transition-all"
          >
            Save & Exit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
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
            />
          )}
          {currentStep === 3 && (
            <StepCompensation
              data={projectData}
              onUpdate={updateProjectData}
              onSave={() => handleSave(false)}
              onBack={() => setCurrentStep(2)}
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
