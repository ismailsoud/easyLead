import React from 'react';
import { Search, Download } from 'lucide-react';

interface TableHeaderProps {
  onSearch: (value: string) => void;
  onExport: () => void;
  searchValue: string;
}

export default function TableHeader({ onSearch, onExport, searchValue }: TableHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>
    </div>
  );
}