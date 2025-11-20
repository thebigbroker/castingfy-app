"use client";

import { useState } from "react";

export interface Role {
  id: string;
  name: string;
  category: string;
  gender: string;
  ageRange: string;
}

export interface Production {
  id: string;
  title: string;
  category: string;
  mainRole: string;
  roleType: string;
  pay: string;
  estimatedHours: string;
  location: string;
  postedDate: string;
  ageRange: string;
  union: string;
  description?: string;
  datesLocations?: string;
  featured?: boolean;
  roles: Role[];
  badges?: string[];
}

interface ProductionCardProps {
  production: Production;
  showRolesPanel?: boolean;
  onViewDetails: (id: string) => void;
  onApply: (id: string, roleId?: string) => void;
}

export default function ProductionCard({
  production,
  showRolesPanel = false,
  onViewDetails,
  onApply,
}: ProductionCardProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Featured Badge */}
      {production.featured && (
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
      )}

      <div className={`p-6 ${showRolesPanel ? 'lg:flex lg:gap-6' : ''}`}>
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4">
            {production.featured && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </div>
            )}
            <p className="text-sm text-gray-600 mb-1">{production.category}</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{production.title}</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{production.mainRole}:</span> {production.roleType}
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 mb-4">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Share">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Save">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Pay and Location */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">{production.pay}</p>
                <p className="text-sm text-gray-600">(est. {production.estimatedHours})</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-700">{production.location}</p>
            </div>
            <p className="text-sm text-gray-600">Posted: {production.postedDate}</p>
          </div>

          {/* Description (if in Productions mode) */}
          {production.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                {showMore ? production.description : `${production.description.slice(0, 150)}...`}
                {production.description.length > 150 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {showMore ? 'view less' : 'view more'}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Dates & Locations */}
          {production.datesLocations && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-semibold text-gray-900 mb-1">Dates & Locations:</p>
              <p className="text-sm text-gray-700">{production.datesLocations}</p>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {production.ageRange}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {production.union}
            </span>
            {production.badges?.map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {badge}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          {!showRolesPanel && (
            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(production.id)}
                className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                View Details
              </button>
              <button
                onClick={() => onApply(production.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Roles Panel (when showRolesPanel is true) */}
        {showRolesPanel && production.roles && production.roles.length > 0 && (
          <div className="lg:w-80 mt-6 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">Roles for this production:</h4>
              {production.roles.map((role) => (
                <div key={role.id} className="bg-white p-3 rounded-md">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{role.name}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {role.category}, {role.gender}, {role.ageRange}
                  </p>
                  <button
                    onClick={() => onApply(production.id, role.id)}
                    className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
