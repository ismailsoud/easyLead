import { getJson } from 'serpapi';

export default async function handler(req, res) {
  const { keyword, location } = req.query;
  
  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await getJson({
      engine: 'google_maps',
      q: `${keyword} in ${location}`,
      api_key: process.env.SERPAPI_KEY,
      type: 'search',
    });

    const leads = response.local_results?.map(result => ({
      businessName: result.title,
      contactPerson: '',
      phone: result.phone || '',
      email: '',
      website: result.website || '',
      address: result.address || '',
      notes: `Rating: ${result.rating || 'N/A'}, Reviews: ${result.reviews || '0'}`,
      status: 'new',
    })) || [];

    res.status(200).json(leads);
  } catch (error) {
    console.error('SerpAPI error:', error);
    res.status(500).json({ error: 'Failed to fetch business data' });
  }
}