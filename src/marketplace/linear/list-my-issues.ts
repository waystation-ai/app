import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
type MyIssuesResponse = Array<{
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  state: string;
  priority: number;
  url: string;
}>;

export const listMyLinearIssues = defineTool({
  id: 'listMyLinearIssues',
  summary: 'Get a list of issues assigned to me in Linear',
  description: 'Retrieves a list of issues assigned to the authenticated user in Linear.',
  method: 'GET',
  path: '/tools/linear/list_my_issues',
  parameters: z.object({
    limit: z.number().optional().default(50).describe('Maximum number of issues to return (default: 50)')
  }),
  responses: {
    '200': {
      description: 'A JSON array of issues assigned to the authenticated user',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the issue'),
        identifier: z.string().describe('Human-readable identifier (e.g., ENG-123)'),
        title: z.string().describe('Title of the issue'),
        description: z.string().nullable().describe('Description of the issue'),
        state: z.string().describe('Current state of the issue'),
        priority: z.number().describe('Priority of the issue (1-4, where 1 is highest)'),
        url: z.string().describe('URL to access the issue in Linear')
      }))
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get the current user
      const viewer = await linearClient.viewer;
      
      // Get issues assigned to the current user using the SDK
      const assignedIssues = await viewer.assignedIssues({ first: params.limit });
      
      if (!assignedIssues || !assignedIssues.nodes) {
        return [] as MyIssuesResponse;
      }
      
      // Map the issues to the expected format
      return Promise.all(assignedIssues.nodes.map(async issue => {
        const state = await issue.state;
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          description: issue.description,
          state: state ? state.name : 'Unknown',
          priority: issue.priority,
          url: issue.url
        };
      })) as Promise<MyIssuesResponse>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list my issues: ${error.message}`);
      }
      throw new Error('Failed to list my issues: Unknown error');
    }
  }
});
