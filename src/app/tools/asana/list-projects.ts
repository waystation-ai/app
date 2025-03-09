import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type to match the schema
type ProjectsResponse = Array<{
  id: string;
  name: string;
}>;

export const listAsanaProjects = defineTool({
  id: 'listAsanaProjects',
  summary: 'Get a list of projects from an Asana workspace',
  description: 'Retrieves a list of projects associated with the specified Asana workspace.',
  method: 'GET',
  path: '/tools/asana/list_projects',
  parameters: z.object({
    workspaceId: z.string().describe('The unique identifier of the Asana workspace.')
  }),
  responses: {
    '200': {
      description: 'A JSON array of workspace projects',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the project'),
        name: z.string().describe('Name of the project')
      }))
    }
  },
  handler: async ({ context, params }) => {
    // Build the query parameters
    const queryParams = new URLSearchParams();    
    
    // Add opt_fields for detailed task information
    queryParams.append('opt_fields', 'id,name,completed,due_on,custom_field_settings.custom_field');

    const result = await queryAsanaApi(
      context.userId, 
      `/workspaces/${params.workspaceId}/projects?${queryParams.toString()}`
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the projects from the response and map to the expected format
    const projects = result.content as Array<Record<string, unknown>>;
    return projects.map((project) => ({
      id: project.gid as string,
      name: project.name as string,
      due_on: project.due_on,
      completed: project.completed,
      custom_field_settings: project.custom_field_settings
    })) as ProjectsResponse;
  }
});
