import React from 'react';
import type { Lead } from '../types';

interface TableRowProps {
  lead: Lead;
  onStatusChange: (id: string, status: Lead['status']) => void;
}

export default function TableRow({ lead, onStatusChange }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{lead.businessName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.contactPerson}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
          className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(lead.createdAt).toLocaleDateString()}
        </div>
      </td>
    </tr>
  );
}