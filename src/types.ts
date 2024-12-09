export interface Lead {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
}

export type LeadFormData = Omit<Lead, 'id' | 'createdAt'>;