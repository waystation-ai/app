import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

type ProjectsResponse = Array<{
  id: string;
  key: string;
  name: string;
}>;

export const listJiraProjects = defineTool({
  id: 'listJiraProjects',
  summary: 'Get a list of Jira projects',
  description: 'Retrieves a list of projects accessible to the authenticated user from Jira.',
  method: 'GET',
  path: '/tools/jira/list_projects',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of Jira projects',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the project'),
        key: z.string().describe('Project key (short code)'),
        name: z.string().describe('Name of the project')
      }))
    }
  },
  handler: async ({ context }) => {
    // Make a direct API call to the Jira projects endpoint
    const result = await queryJiraApi(context, '/project');
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const projects = result.content as Array<Record<string, unknown>>;
    return projects.map(project => ({
      id: String(project.id),
      key: String(project.key),
      name: String(project.name)
    })) as ProjectsResponse;
  }
});
