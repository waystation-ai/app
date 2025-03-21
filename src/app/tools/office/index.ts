import { registerProvider } from '../core/registry';
import { listDocs } from './list-docs';
import { readDoc } from './read-doc';
import { searchDocs } from './search-docs';
import { recentDocs } from './recent-docs';

export const officeProvider = registerProvider({
  id: 'office',
  name: 'Office 365',
  description: 'Create, edit, and collaborate on Office documents and spreadsheets.',
  
  // OAuth settings
  clientId: process.env.OFFICE_CLIENT_ID || '',
  clientSecret: process.env.OFFICE_CLIENT_SECRET || '',
  authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  scopes: [
    'Files.Read.All',
    'offline_access'
  ],
  group: 'microsoft',
  
  // Marketing information
  bullets: [
    "Extract insights and data from documents automatically",
    "Generate reports and presentations from your data",
    "Keep documents and spreadsheets synchronized"
  ],
  chat: [
    { role: 'user', content: "Can you analyze our Q4 sales spreadsheets and create a presentation for the board?" },
    { role: 'agent', content: "I'll examine the sales data. Would you like to emphasize growth trends or regional performance?" },
    { role: 'user', content: "Focus on growth trends" },
    { role: 'agent', content: "I've created a presentation highlighting key growth metrics, with charts showing trend lines and projections. I've also added notes identifying the main drivers of growth." }
  ],
  
  tools: [
    listDocs,
    readDoc,
    searchDocs,
    recentDocs
  ]
});

// Re-export tools for direct imports if needed
export {
  listDocs,
  readDoc,
  searchDocs,
  recentDocs
};
