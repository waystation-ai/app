import { validate as isUuid } from 'uuid';


import { registerProvider } from '../core/registry';
import { listLinearTeams } from './list-teams';
import { listLinearProjects } from './list-projects';
import { readLinearProject } from './read-project';
import { listLinearIssues } from './list-issues';
import { listMyLinearIssues } from './list-my-issues';
import { readLinearIssue } from './read-issue';
import { createLinearIssue } from './create-issue';
import { updateLinearIssue } from './update-issue';
import { createLinearComment } from './create-comment';
import { getLinearFavorites } from './get-favorites';

export const linearProvider = registerProvider({
  id: 'linear',
  name: 'Linear',
  description: 'Track issues, manage product development, and streamline software projects with Linear.',

  auth: {
    type: 'oauth',
    clientId: process.env.LINEAR_CLIENT_ID || '',
    clientSecret: process.env.LINEAR_CLIENT_SECRET || '',
    authorizationUrl: 'https://linear.app/oauth/authorize',
    tokenUrl: 'https://api.linear.app/oauth/token',
    scopes: [
      'read',
      'write',
      'issues:create',
      'comments:create',
    ]
  },
  
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
    readLinearProject,
    listLinearIssues,
    listMyLinearIssues,
    readLinearIssue,
    createLinearIssue,
    updateLinearIssue,
    createLinearComment,
    getLinearFavorites
  ],

  getResources: async (context) => {
    const favorites = await getLinearFavorites.handler({ context, params: {} });
    return favorites;
  },

  getResourceContent: async (context, resource) => {
    // Check if the resource id is GUID and use it to read the project
    if (resource.id && isUuid(resource.id)) {
      return {
        text: JSON.stringify(await readLinearProject.handler({ context, params: { projectId: resource.id } })),
        mimeType: 'application/json'
      };
    }

    return {
        text: JSON.stringify(await readLinearIssue.handler({ context, params: { issueId: resource.id } })),
        mimeType: 'application/json'
      };
  }
});
