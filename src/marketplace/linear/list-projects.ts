import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
type ProjectsResponse = Array<{
  id: string;
  name: string;
  description: string | null;
  state: string;
}>;

export const listLinearProjects = defineTool({
  id: 'listLinearProjects',
  summary: 'Get a list of projects from Linear',
  description: 'Retrieves a list of projects from Linear.',
  method: 'GET',
  path: '/tools/linear/list_projects',
  parameters: z.object({}),
  responses: {
    '200': {
      description: 'A JSON array of projects',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the project'),
        name: z.string().describe('Name of the project'),
        description: z.string().nullable().describe('Description of the project'),
        state: z.string().describe('Current state of the project (e.g., planned, started, completed)')
      }))
    }
  },
  handler: async ({ context }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get projects using the SDK
      const projects = await linearClient.projects();
      
      if (!projects) {
        return [] as ProjectsResponse;
      }
      
      // Map the projects to the expected format
      return projects.nodes.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        state: project.state
      })) as ProjectsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list projects: ${error.message}`);
      }
      throw new Error('Failed to list projects: Unknown error');
    }
  }
});
