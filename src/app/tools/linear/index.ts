import { registerProvider } from '../core/registry';
import { listLinearTeams } from './list-teams';
import { listLinearProjects } from './list-projects';
import { listLinearIssues } from './list-issues';
import { listMyLinearIssues } from './list-my-issues';
import { createLinearIssue } from './create-issue';
import { updateLinearIssue } from './update-issue';
import { createLinearComment } from './create-comment';

export const linearProvider = registerProvider({
  id: 'linear',
  name: 'Linear',
  description: 'Track issues, manage product development, and streamline software projects with Linear.',
  
  // OAuth settings
  clientId: process.env.LINEAR_CLIENT_ID || '',
  clientSecret: process.env.LINEAR_CLIENT_SECRET || '',
  authorizationUrl: 'https://linear.app/oauth/authorize',
  tokenUrl: 'https://api.linear.app/oauth/token',
  scopes: [
    'read',
    'write',
    'issues:create',
    'comments:create',
  ],
  
  // Marketing information
  bullets: [
    "Create and prioritize issues for software development",
    "Track progress with customizable workflows and cycles",
    "Manage roadmaps and coordinate releases across teams"
  ],
  chat: [
    { role: 'user', content: "Can you create issues in Linear for the bugs we found during testing?" },
    { role: 'agent', content: "I'll create issues for the bugs in Linear. Would you like me to prioritize them based on severity?" },
    { role: 'user', content: "Yes, and assign critical ones to the backend team" },
    { role: 'agent', content: "I've created all bug issues in Linear, prioritized by severity. Critical issues have been assigned to the backend team and added to the current cycle." }
  ],
  
  // Tools
  tools: [
    listLinearTeams,
    listLinearProjects,
    listLinearIssues,
    listMyLinearIssues,
    createLinearIssue,
    updateLinearIssue,
    createLinearComment
  ]
});

// Re-export tools
export {
  listLinearTeams,
  listLinearProjects,
  listLinearIssues,
  listMyLinearIssues,
  createLinearIssue,
  updateLinearIssue,
  createLinearComment
};
