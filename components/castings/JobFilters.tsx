"use client";

interface JobFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  onSaveSearch?: () => void;
}

export interface FilterValues {
  location: string;
  jobType: string;
  gender: string;
  age: string;
}

export default function JobFilters({ onFilterChange, onSaveSearch }: JobFiltersProps) {
  const handleChange = (key: keyof FilterValues, value: string) => {
    const filters: FilterValues = {
      location: (document.getElementById('location') as HTMLSelectElement)?.value || 'any',
      jobType: (document.getElementById('jobType') as HTMLSelectElement)?.value || 'any',
      gender: (document.getElementById('gender') as HTMLSelectElement)?.value || 'any',
      age: (document.getElementById('age') as HTMLSelectElement)?.value || 'any',
    };
    filters[key] = value;
    onFilterChange(filters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Filter Dropdowns */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Job location
            </label>
            <select
              id="location"
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="any">Any location</option>
              <option value="worldwide">Worldwide</option>
              <option value="remote">Remote</option>
              <option value="new-york">New York, NY</option>
              <option value="los-angeles">Los Angeles, CA</option>
              <option value="london">London, UK</option>
              <option value="madrid">Madrid, Spain</option>
              <option value="barcelona">Barcelona, Spain</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              id="jobType"
              onChange={(e) => handleChange('jobType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="any">Any type</option>
              <option value="film">Film</option>
              <option value="tv">TV Show</option>
              <option value="commercial">Commercial</option>
              <option value="theater">Theater</option>
              <option value="voiceover">Voiceover</option>
              <option value="ugc">UGC/Content</option>
              <option value="modeling">Modeling</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="any">Any gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="all">All genders</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <select
              id="age"
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="any">Any age</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56+">56+</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({
              location: 'any',
              jobType: 'any',
              gender: 'any',
              age: 'any'
            })}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Search
          </button>
          <button
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Advanced filters"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          {onSaveSearch && (
            <button
              onClick={onSaveSearch}
              className="px-5 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors font-medium text-sm"
            >
              Save Search
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
