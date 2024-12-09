import React from 'react';
import { Users } from 'lucide-react';
import LeadForm from './components/LeadForm';
import LeadGenerator from './components/LeadGenerator';
import LeadTable from './components/LeadTable';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Lead, LeadFormData } from './types';

function App() {
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);

  const handleAddLead = (data: LeadFormData) => {
    const newLead: Lead = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleLeadsGenerated = (generatedLeads: LeadFormData[]) => {
    const newLeads: Lead[] = generatedLeads.map((lead) => ({
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    setLeads((prev) => [...newLeads, ...prev]);
  };

  const handleStatusChange = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1>
          </div>
          <div className="text-sm text-gray-500">
            Total Leads: {leads.length}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Leads</h2>
            <LeadGenerator onLeadsGenerated={handleLeadsGenerated} />
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add Lead Manually</h2>
            <LeadForm onSubmit={handleAddLead} />
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Leads</h2>
            <LeadTable leads={leads} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;