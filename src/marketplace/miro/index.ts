import { registerProvider } from '../core/registry';
import { listMiroBoards } from './list-boards';
import { getMiroBoard } from './get-board';
import { postMiroNote } from './post-note';

export const miroProvider = registerProvider({
  id: 'miro',
  name: 'Miro',
  description: 'Collaborate on visual boards with your team using Miro integration.',

  auth: {
    type: 'oauth',
    clientId: process.env.MIRO_CLIENT_ID || '',
    clientSecret: process.env.MIRO_CLIENT_SECRET || '',
    authorizationUrl: 'https://miro.com/oauth/authorize',
    tokenUrl: 'https://api.miro.com/v1/oauth/token',
    scopes: [
      'boards:read',
      'boards:write',
    ]
  },
  
  // Marketing information
  bullets: [
    "Create and manage visual boards for brainstorming and planning",
    "Collaborate with team members on diagrams, wireframes, and mind maps",
    "Organize and structure ideas visually for better team alignment"
  ],
  chat: [
    { role: 'user', content: "Can you create a product roadmap board in Miro based on our Q2 planning?" },
    { role: 'agent', content: "I'll create a visual roadmap in Miro. Would you like it organized by quarter or by feature area?" },
    { role: 'user', content: "Let's organize it by feature area" },
    { role: 'agent', content: "I've created a Miro board with your product roadmap organized by feature areas. Each section includes timelines, dependencies, and key milestones." }
  ],
  
  // Tools
  tools: [
    listMiroBoards,
    getMiroBoard,
    postMiroNote
  ]
});
