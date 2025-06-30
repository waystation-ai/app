import { registerProvider } from '../core/registry';
import { listMondayBoards } from './list-boards';
import { readMondayBoard } from './read-board';
import { createMondayItem } from './create-item';
import { updateMondayItem } from './update-item';
import { createMondayUpdate } from './create-update';

export const mondayProvider = registerProvider({
  id: 'monday',
  name: 'Monday',
  description: 'Access and manage your Monday.com boards, items, and updates seamlessly.',
  type: 'native',
  
  auth: {
    type: 'oauth',
    clientId: process.env.MONDAY_CLIENT_ID || '',
    clientSecret: process.env.MONDAY_CLIENT_SECRET || '',
    authorizationUrl: 'https://auth.monday.com/oauth2/authorize',
    tokenUrl: 'https://auth.monday.com/oauth2/token',
    scopes: [
      'me:read',
      'boards:read',
      'boards:write',
      'workspaces:read',
      'updates:read',
      'updates:write'
    ]
  },
  
  // Marketing information
  bullets: [
    "Automate routine tasks and updates across your Monday boards",
    "Transform requests and feedback into organized board items",
    "Generate progress reports and insights from your Monday data"
  ],
  chat: [
    { role: 'user', content: "Can you process all the customer feedback from last week and organize it in Monday?" },
    { role: 'agent', content: "I'll analyze the feedback and update our Customer Feedback board. Would you like me to categorize by priority or feature type?" },
    { role: 'user', content: "Let's categorize by feature type" },
    { role: 'agent', content: "Processing feedback and creating categorized items in Monday. I'll also prepare a summary of key trends for our next team meeting." }
  ],
  
  // Tools
  tools: [
    listMondayBoards,
    readMondayBoard,
    createMondayItem,
    updateMondayItem,
    createMondayUpdate,
  ]
});
