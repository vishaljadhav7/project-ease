'use client'

import React, { useState } from 'react';

const SearchUnderWork: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Under Work</h1>

        {/* Search Bar and Button */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search work items..."
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 text-gray-700"
          />
          <button
            disabled
            className="px-6 py-3 bg-teal-500 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            Search
          </button>
        </div>

        {/* Under Work Message */}
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Under Work</p>
        </div>
      </div>
    </div>
  );
};

export default SearchUnderWork;