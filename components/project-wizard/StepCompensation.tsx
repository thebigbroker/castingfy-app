"use client";

import { useState, useEffect } from "react";

interface CompensationData {
  rateType: string;
  amount: number | null;
  currency: string;
  notes: string;
}

interface Role {
  id: string;
  name: string;
  category: string;
}

interface ProjectData {
  roles: Role[];
  compensation?: {
    byRole: Record<string, CompensationData>;
  };
}

interface StepCompensationProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
  onSave: () => void;
  onBack: () => void;
}

const RATE_TYPES = [
  { value: "per_day", label: "Per Day" },
  { value: "per_project", label: "Per Project" },
  { value: "per_hour", label: "Per Hour" },
  { value: "flat_fee", label: "Flat Fee" },
];

const CURRENCIES = ["EUR", "USD", "GBP"];

export default function StepCompensation({
  data,
  onUpdate,
  onSave,
  onBack,
}: StepCompensationProps) {
  const [compensationData, setCompensationData] = useState<
    Record<string, CompensationData>
  >(data.compensation?.byRole || {});

  useEffect(() => {
    // Initialize compensation for each role
    const initialData: Record<string, CompensationData> = {};
    data.roles.forEach((role: Role) => {
      if (!compensationData[role.id]) {
        initialData[role.id] = {
          rateType: "",
          amount: null,
          currency: "EUR",
          notes: "",
        };
      }
    });

    if (Object.keys(initialData).length > 0) {
      setCompensationData((prev) => ({ ...prev, ...initialData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.roles]);

  const handleCompensationChange = (
    roleId: string,
    field: keyof CompensationData,
    value: string | number | null
  ) => {
    const updated = {
      ...compensationData,
      [roleId]: {
        ...compensationData[roleId],
        [field]: value,
      },
    };
    setCompensationData(updated);
    onUpdate({
      compensation: {
        byRole: updated,
      },
    });
  };

  const handleSaveAndContinue = () => {
    onSave();
  };

  if (data.roles.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compensation</h1>
          <p className="text-text-muted">
            Set payment details for each role in your project
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
          <p className="text-text-muted mb-6">
            Please fill out the Project Details and Roles first in order to
            continue.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
          >
            Go to Roles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Compensation</h1>
        <p className="text-text-muted">
          Define payment details for each role in your project
        </p>
      </div>

      {/* Compensation for each role */}
      <div className="space-y-6">
        {data.roles.map((role: Role) => (
          <section
            key={role.id}
            className="bg-white border border-border rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-6">
              {role.name}
              <span className="ml-2 text-sm font-normal text-text-muted capitalize">
                ({role.category.replace("_", " ")})
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rate Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Type
                </label>
                <select
                  value={compensationData[role.id]?.rateType || ""}
                  onChange={(e) =>
                    handleCompensationChange(role.id, "rateType", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select payment type</option>
                  {RATE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={compensationData[role.id]?.amount || ""}
                    onChange={(e) =>
                      handleCompensationChange(
                        role.id,
                        "amount",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Currency
                  </label>
                  <select
                    value={compensationData[role.id]?.currency || "EUR"}
                    onChange={(e) =>
                      handleCompensationChange(
                        role.id,
                        "currency",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={compensationData[role.id]?.notes || ""}
                  onChange={(e) =>
                    handleCompensationChange(role.id, "notes", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Add any additional payment details or conditions..."
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-surface border border-border text-text rounded-lg hover:bg-border transition-all font-semibold"
        >
          Back to Roles
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold"
        >
          Save & Continue to Pre-Screens
        </button>
      </div>
    </div>
  );
}
