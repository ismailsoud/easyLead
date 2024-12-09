import axios from 'axios';
import type { LeadFormData } from '../types';

const SERPAPI_KEY = '57c742b02ddef64f5ef15540d0e92cd75f46ca6abe36e1dc8a845bd712a794da';

export async function searchBusinesses(keyword: string, location: string): Promise<LeadFormData[]> {
  try {
    const params = new URLSearchParams({
      engine: 'google_maps',
      q: `${keyword} in ${location}`,
      api_key: SERPAPI_KEY,
      type: 'search'
    });

    // Use the proxied endpoint instead of calling serpapi.com directly
    const response = await axios.get(`/api/search.json?${params}`);
    const data = response.data;

    if (!data.local_results) {
      throw new Error('No results found');
    }

    return data.local_results.map((result: any) => ({
      businessName: result.title || '',
      contactPerson: '',
      phone: result.phone || '',
      email: '',
      website: result.website || '',
      address: result.address || '',
      notes: `Rating: ${result.rating || 'N/A'}, Reviews: ${result.reviews || '0'}`,
      status: 'new'
    }));
  } catch (error) {
    console.error('Error fetching data from SerpAPI:', error);
    throw new Error('Failed to fetch business data');
  }
}