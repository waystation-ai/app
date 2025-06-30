import { registerProvider } from '../core/registry';
import { listDocs } from './list-docs';
import { readDoc } from './read-doc';

export const gdriveProvider = registerProvider({
  id: 'gdrive',
  name: 'Google Drive',
  description: 'Browse, search, and manage your selected Google Drive files.',
  type: 'native',
  
  auth: {
    type: 'oauth',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/drive.file'
    ]
  },
  group: 'google',
  
  // Marketing information
  bullets: [
    "Select specific documents to analyze with AI assistance",
    "Extract insights from spreadsheets and presentations securely",
    "Maintain full control over which files can be accessed"
  ],
  chat: [
    { role: 'user', content: "Can you find all product specs from Q1 and summarize the key features we planned?" },
    { role: 'agent', content: "Searching through the product specification documents you've shared. Would you like me to organize features by priority or timeline?" },
    { role: 'user', content: "Let's see them by priority" },
    { role: 'agent', content: "I've analyzed the spec documents you provided and created a summary of key features, sorted by priority. I can share this as a new document or update the existing product roadmap." }
  ],
  
  tools: [
    listDocs,
    readDoc
  ]
});
