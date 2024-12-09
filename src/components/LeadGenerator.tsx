import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import type { LeadFormData } from '../types';
import { searchBusinesses } from '../api/search';

interface LeadGeneratorProps {
  onLeadsGenerated: (leads: LeadFormData[]) => void;
}

export default function LeadGenerator({ onLeadsGenerated }: LeadGeneratorProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword || !location) {
      setError('Please enter both keyword and location');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const leads = await searchBusinesses(keyword, location);
      onLeadsGenerated(leads);
      setKeyword('');
      setLocation('');
    } catch (err) {
      setError('Failed to generate leads. Please try again.');
      console.error('Lead generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
            Business Type or Keyword *
          </label>
          <input
            required
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., plumbers, restaurants, dentists"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            required
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, NY"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Generate Leads
            </>
          )}
        </button>
      </div>
    </form>
  );
}