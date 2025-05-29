import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';
import { AsanaResource } from './types';

export const getAsanaFavorites = defineTool({
  id: 'listAsanaFavorites',
  summary: 'Get a list of user\'s favorite projects and tasks from Asana',
  description: 'Retrieves a list of favorite projects and tasks from all workspaces associated with the authenticated user from Asana.',
  method: 'GET',
  path: '/tools/asana/get_favorites',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of user favorites including projects and tasks',
      schema: z.array(z.union([
        z.object({
          id: z.string().describe('Unique identifier for the project'),
          name: z.string().describe('Name of the project'),
          url: z.string().describe('URL of the project'),
          resource_type: z.literal('project').describe('Resource type')
        }),
        z.object({
          id: z.string().describe('Unique identifier for the task'),
          name: z.string().describe('Name of the task'),
          url: z.string().describe('URL of the task'),
          completed: z.boolean().describe('Completion status of the task'),
          due_on: z.string().optional().describe('Due date of the task'),
          assignee: z.record(z.unknown()).optional().describe('Task assignee information'),
          resource_type: z.literal('task').describe('Resource type')
        })
      ]))
    }
  },
  handler: async ({ context }) => {
    // First, get all workspaces
    const workspacesResult = await queryAsanaApi(context, '/workspaces');
    
    if (workspacesResult.error) {
      throw new Error(JSON.stringify(workspacesResult.content));
    }
    
    const workspaces = workspacesResult.content as Array<Record<string, unknown>>;
    
    // Create all API calls for parallel execution
    const apiCalls = workspaces.flatMap((workspace) => {
      const workspaceId = workspace.gid as string;
      return [
        {
          type: 'project' as const,
          workspaceId,
          promise: queryAsanaApi(context, `/users/me/favorites?workspace=${workspaceId}&resource_type=project&opt_pretty=false&opt_fields=id,name,permalink_url`)
        },
        /*{
          type: 'portfolio' as const,
          workspaceId,
          promise: queryAsanaApi(context, `/users/me/favorites?workspace=${workspaceId}&resource_type=portfolio&opt_pretty=false&opt_fields=id,name,permalink_url`)
        }*/
      ];
    });
    
    // Execute all API calls in parallel
    const results = await Promise.all(apiCalls.map(call => call.promise));
    
    // Process results and build favorites array
    const allFavorites: AsanaResource[] = [];
    
    results.forEach((result, index) => {
      const callInfo = apiCalls[index];
      
      if (!result.error) {
        const items = result.content as Array<Record<string, unknown>>;
        
        items.forEach((item) => {
          if (callInfo.type === 'project') {
            allFavorites.push({
              id: item.gid as string,
              name: item.name as string,
              url: item.permalink_url as string,
              resource_type: 'project' as const
            });
          } else {
            allFavorites.push({
              id: item.gid as string,
              name: item.name as string,
              url: item.permalink_url as string,
              completed: item.completed as boolean,
              due_on: item.due_on as string | undefined,
              assignee: item.assignee as Record<string, unknown> | undefined,
              resource_type: 'task' as const
            });
          }
        });
      }
    });
    
    return allFavorites;
  }
});
