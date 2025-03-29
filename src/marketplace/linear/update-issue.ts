import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
interface UpdateIssueResponse {
  id: string;
  identifier: string;
  title: string;
  url: string;
}

export const updateLinearIssue = defineTool({
  id: 'updateLinearIssue',
  summary: 'Update an existing issue in Linear',
  description: 'Updates an existing issue in Linear with the specified changes.',
  method: 'PUT',
  path: '/tools/linear/update_issue',
  parameters: z.object({
    issueId: z.string().describe('ID of the issue to update'),
    title: z.string().optional().describe('New title for the issue'),
    description: z.string().optional().describe('New description for the issue (markdown supported)'),
    priority: z.number().optional().describe('New priority for the issue (1-4, where 1 is highest)'),
    projectId: z.string().optional().describe('New project ID to associate the issue with'),
    assigneeId: z.string().optional().describe('New user ID to assign the issue to'),
    stateId: z.string().optional().describe('New state ID to set for the issue')
  }),
  responses: {
    '200': {
      description: 'Successfully updated issue',
      schema: z.object({
        id: z.string().describe('Unique identifier of the updated issue'),
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
      
      // Prepare the issue update variables
      const issueUpdateInput: Record<string, unknown> = {};
      
      if (params.title !== undefined) issueUpdateInput.title = params.title;
      if (params.description !== undefined) issueUpdateInput.description = params.description;
      if (params.priority !== undefined) issueUpdateInput.priority = params.priority;
      if (params.projectId !== undefined) issueUpdateInput.projectId = params.projectId;
      if (params.assigneeId !== undefined) issueUpdateInput.assigneeId = params.assigneeId;
      if (params.stateId !== undefined) issueUpdateInput.stateId = params.stateId;
      
      // Check if there are any update fields
      const hasUpdateFields = Object.keys(issueUpdateInput).length > 0;
      
      if (!hasUpdateFields) {
        throw new Error('No update fields provided');
      }
      
      // Update the issue using the SDK
      const issuePayload = await linearClient.updateIssue(params.issueId, issueUpdateInput);
      
      // The SDK returns an IssuePayload object with the issue data
      if (!issuePayload || !issuePayload.success) {
        throw new Error('Failed to update issue: Operation was not successful');
      }
      
      const issue = await issuePayload.issue;
      if (!issue) {
        throw new Error('Failed to update issue: No issue data returned');
      }
      
      // Return the issue data in the expected format
      return {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url
      } as UpdateIssueResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update issue: ${error.message}`);
      }
      throw new Error('Failed to update issue: Unknown error');
    }
  }
});
