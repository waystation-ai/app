import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

// Define interfaces for the request body structure
interface JiraCommentBody {
  body: {
    type: string;
    version: number;
    content: Array<{
      type: string;
      content: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

export const addJiraComment = defineTool({
  id: 'addJiraComment',
  summary: 'Add a comment to a Jira issue',
  description: 'Adds a new comment to an existing Jira issue.',
  method: 'POST',
  path: '/tools/jira/add_comment',
  parameters: z.object({
    issueKey: z.string().describe('The issue key to comment on (e.g., "PROJ-123")'),
    comment: z.string().describe('The comment text to add')
  }),
  responses: {
    '200': {
      description: 'Comment added successfully',
      schema: z.object({
        id: z.string().describe('Unique identifier for the created comment'),
        self: z.string().describe('URL to the created comment')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare the request body for Jira API
    const requestBody: JiraCommentBody = {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: params.comment
              }
            ]
          }
        ]
      }
    };

    // Make the API call to add the comment
    const result = await queryJiraApi(
      context,
      `/issue/${params.issueKey}/comment`,
      'POST',
      requestBody as unknown as Record<string, unknown>
    );

    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }

    const response = result.content as {
      id: string;
      self: string;
    };

    return {
      id: response.id,
      self: response.self
    };
  }
});
