import { registerProvider } from '../core/registry';
import { listAsanaWorkspaces } from './list-workspaces';
import { listAsanaProjects } from './list-projects';
import { readAsanaProject } from './read-project';
import { listAsanaTasks } from './list-tasks';
import { createAsanaTask } from './create-task';
import { updateAsanaTask } from './update-task';
import { createAsanaComment } from './create-comment';
import { searchAsanaTasks } from './search-tasks';

export const asanaProvider = registerProvider({
  id: 'asana',
  name: 'Asana',
  description: 'Access and manage your Asana workspaces, projects, and tasks seamlessly.',
  
  // OAuth settings
  clientId: process.env.ASANA_CLIENT_ID || '',
  clientSecret: process.env.ASANA_CLIENT_SECRET || '',
  authorizationUrl: 'https://app.asana.com/-/oauth_authorize',
  tokenUrl: 'https://app.asana.com/-/oauth_token',
  scopes: [
    'default',
    'projects:read',
    'projects:write',
    'tasks:read',
    'tasks:write',
    'workspaces:read'
  ],
  
  // Marketing information
  bullets: [
    "Track project progress and milestone completion automatically",
    "Convert conversations and emails into structured tasks",
    "Keep teams aligned with smart project updates and summaries"
  ],
  chat: [
    { role: 'user', content: "Can you create tasks for all the action items from today's meeting?" },
    { role: 'agent', content: "I'll review the meeting notes. Would you like these organized by project or deadline?" },
    { role: 'user', content: "Let's organize them by project" },
    { role: 'agent', content: "I've created 8 tasks across 3 projects, assigned them to the relevant team members, and added the context from our meeting notes." }
  ],
  
  tools: [
    listAsanaWorkspaces,
    listAsanaProjects,
    readAsanaProject,
    listAsanaTasks,
    createAsanaTask,
    updateAsanaTask,
    createAsanaComment,
    searchAsanaTasks
  ]
});