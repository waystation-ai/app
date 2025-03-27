import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
interface CreateIssueResponse {
  id: string;
  identifier: string;
  title: string;
  url: string;
}

export const createLinearIssue = defineTool({
  id: 'createLinearIssue',
  summary: 'Create a new issue in Linear',
  description: 'Creates a new issue in Linear with the specified details.',
  method: 'POST',
  path: '/tools/linear/create_issue',
  parameters: z.object({
    teamId: z.string().describe('ID of the team to create the issue in'),
    title: z.string().describe('Title of the issue'),
    description: z.string().optional().describe('Description of the issue (markdown supported)'),
    priority: z.number().optional().describe('Priority of the issue (1-4, where 1 is highest)'),
    projectId: z.string().optional().describe('Optional project ID to associate the issue with'),
    assigneeId: z.string().optional().describe('Optional user ID to assign the issue to'),
    stateId: z.string().optional().describe('Optional state ID to set for the issue')
  }),
  responses: {
    '200': {
      description: 'Successfully created issue',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created issue'),
        identifier: z.string().describe('Human-readable identifier (e.g., ENG-123)'),
        title: z.string().describe('Title of the issue'),
        url: z.string().describe('URL to access the issue in Linear')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Prepare the issue creation variables
      const issueCreateInput = {
        teamId: params.teamId,
        title: params.title,
        ...(params.description !== undefined && { description: params.description }),
        ...(params.priority !== undefined && { priority: params.priority }),
        ...(params.projectId !== undefined && { projectId: params.projectId }),
        ...(params.assigneeId !== undefined && { assigneeId: params.assigneeId }),
        ...(params.stateId !== undefined && { stateId: params.stateId })
      };
      
      // Create the issue using the SDK
      const issuePayload = await linearClient.createIssue(issueCreateInput);
      
      // The SDK returns an IssuePayload object with the issue data
      if (!issuePayload || !issuePayload.success) {
        throw new Error('Failed to create issue: Operation was not successful');
      }
      
      const issue = await issuePayload.issue;
      if (!issue) {
        throw new Error('Failed to create issue: No issue data returned');
      }
      
      // Return the issue data in the expected format
      return {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url
      } as CreateIssueResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create issue: ${error.message}`);
      }
      throw new Error('Failed to create issue: Unknown error');
    }
  }
});
