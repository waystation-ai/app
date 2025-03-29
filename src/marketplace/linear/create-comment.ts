import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
interface CreateCommentResponse {
  id: string;
  body: string;
  issueId: string;
  url: string;
}

export const createLinearComment = defineTool({
  id: 'createLinearComment',
  summary: 'Add a comment to an issue in Linear',
  description: 'Creates a new comment on an existing issue in Linear.',
  method: 'POST',
  path: '/tools/linear/create_comment',
  parameters: z.object({
    issueId: z.string().describe('ID of the issue to comment on'),
    body: z.string().describe('Content of the comment (markdown supported)')
  }),
  responses: {
    '200': {
      description: 'Successfully created comment',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created comment'),
        body: z.string().describe('Content of the comment'),
        issueId: z.string().describe('ID of the issue the comment was added to'),
        url: z.string().describe('URL to access the comment in Linear')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Prepare the comment creation variables
      const commentCreateInput = {
        issueId: params.issueId,
        body: params.body
      };
      
      // Create the comment using the SDK
      const commentPayload = await linearClient.createComment(commentCreateInput);
      
      // The SDK returns a CommentPayload object with the comment data
      if (!commentPayload || !commentPayload.success) {
        throw new Error('Failed to create comment: Operation was not successful');
      }
      
      const comment = await commentPayload.comment;
      if (!comment) {
        throw new Error('Failed to create comment: No comment data returned');
      }
      
      // Get the issue data
      const issue = await comment.issue;
      if (!issue) {
        throw new Error('Failed to create comment: No issue data returned');
      }
      
      // Return the comment data in the expected format
      return {
        id: comment.id,
        body: comment.body,
        issueId: issue.id,
        url: comment.url
      } as CreateCommentResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create comment: ${error.message}`);
      }
      throw new Error('Failed to create comment: Unknown error');
    }
  }
});
