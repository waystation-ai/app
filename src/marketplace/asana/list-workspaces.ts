import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type to match the schema
type WorkspacesResponse = Array<{
  id: string;
  name: string;
}>;

export const listAsanaWorkspaces = defineTool({
  id: 'listAsanaWorkspaces',
  summary: 'Get a list of user\'s workspaces from Asana',
  description: 'Retrieves a list of workspaces associated with the authenticated user from Asana.',
  method: 'GET',
  path: '/tools/asana/list_workspaces',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of user workspaces',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the workspace'),
        name: z.string().describe('Name of the workspace')
      }))
    }
  },
  handler: async ({ context }) => {
    const result = await queryAsanaApi(context, '/workspaces');
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the workspaces from the response and map to the expected format
    const workspaces = result.content as Array<Record<string, unknown>>;
    return workspaces.map((workspace) => ({
      id: workspace.gid as string,
      name: workspace.name as string
    })) as WorkspacesResponse;
  }
});
