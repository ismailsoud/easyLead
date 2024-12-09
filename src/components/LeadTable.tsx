import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { Lead } from '../types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: Lead['status']) => void;
}

const HEADERS = ['Business Name', 'Contact Person', 'Phone', 'Email', 'Status', 'Created At'];

const downloadCSV = (content: string, filename: string) => {
  try {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    alert('Failed to download CSV. Please try again.');
  }
};

export default function LeadTable({ leads, onStatusChange }: LeadTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter((lead) =>
      Object.values(lead).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

    return [...filtered].sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [leads, search, sortField, sortDirection]);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const headers = ['Business Name', 'Contact Person', 'Phone', 'Email', 'Website', 'Address', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedLeads.map((lead) =>
        [
          lead.businessName,
          lead.contactPerson,
          lead.phone,
          lead.email,
          lead.website,
          lead.address,
          lead.status,
          lead.createdAt,
        ]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    downloadCSV(csvContent, `leads_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableHeader
        searchValue={search}
        onSearch={setSearch}
        onExport={handleExport}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(header.toLowerCase().replace(' ', '') as keyof Lead)}
                >
                  <div className="flex items-center">
                    {header}
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredAndSortedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  lead={lead}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}