import { registerProvider } from '../core/registry';
import { listAsanaWorkspaces } from './list-workspaces';
import { listAsanaProjects } from './list-projects';
import { readAsanaProject } from './read-project';
import { readAsanaTask } from './read-task';
import { listAsanaTasks } from './list-tasks';
import { createAsanaTask } from './create-task';
import { updateAsanaTask } from './update-task';
import { createAsanaComment } from './create-comment';
import { searchAsanaTasks } from './search-tasks';
import { getAsanaFavorites } from './get-favorites';
import { ToolContext } from '../core/types';

export const asanaProvider = registerProvider({
  id: 'asana',
  name: 'Asana',
  description: 'Access and manage your Asana workspaces, projects, and tasks seamlessly.',
  auth: {
    type: 'oauth',
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
    ]
  },
  
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
    readAsanaTask,
    listAsanaTasks,
    createAsanaTask,
    updateAsanaTask,
    createAsanaComment,
    searchAsanaTasks,
    getAsanaFavorites
  ],

  getResources: async (context) => {
    const favorites = await getAsanaFavorites.handler({ context, params: {} });
    return favorites;
  },

  getResourceContent: async (context, resource) => {
    const url = new URL(resource.url);
    const resourceId = url.pathname.split('/').pop();

    if (!resourceId) {
      throw new Error('Invalid resource URL');
    }

    // Check if this is a task resource by looking for "task" in the URL
    if (url.pathname.includes('task')) {
      const result = await readAsanaTask.handler({ context, params: { taskId: resource.id } });
      return {
        text: JSON.stringify(result),
        mimeType: 'application/json'
      };
    } else {
      // Default to project resource
      const result = await readAsanaProject.handler({ context, params: { projectId: resourceId } });
      return {
        text: JSON.stringify(result),
        mimeType: 'application/json'
      };
    }
  },

  search: async (context: ToolContext, query: string) => {
    // Get all workspaces first
    const workspaces = await listAsanaWorkspaces.handler({ context, params: {} });
    
    // Search across all workspaces in parallel
    const searchPromises = workspaces.map(workspace => 
      searchAsanaTasks.handler({ 
        context, 
        params: { 
          workspaceId: workspace.id, 
          query 
        } 
      }).catch(() => []) // Return empty array if search fails for a workspace
    );
    
    const searchResults = await Promise.all(searchPromises);
    
    // Flatten and deduplicate results
    const allTasks = searchResults.flat();

    return allTasks;
  }
});
