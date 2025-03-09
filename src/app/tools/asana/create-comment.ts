import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
interface CreateCommentResponse {
  id: string;
  text: string;
  created_at: string;
}

export const createAsanaComment = defineTool({
  id: 'createAsanaComment',
  summary: 'Create a new comment on an Asana task',
  description: 'Creates a new comment (story) on the specified Asana task.',
  method: 'POST',
  path: '/tools/asana/create_comment',
  parameters: z.object({
    taskId: z.string().describe('The unique identifier of the task to add the comment to'),
    text: z.string().describe('The text content of the comment')
  }),
  responses: {
    '200': {
      description: 'Successfully created comment',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created comment'),
        text: z.string().describe('Text content of the comment'),
        created_at: z.string().describe('Timestamp when the comment was created')
      })
    }
  },
  handler: async ({ context, params }) => {
    // In Asana, comments are called "stories" and are created on tasks
    const result = await queryAsanaApi(
      context.userId,
      `/tasks/${params.taskId}/stories`,
      'POST',
      {
        text: params.text
      }
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the created comment from the response
    const comment = result.content as Record<string, unknown>;
    
    return {
      id: comment.gid as string,
      text: comment.text as string,
      created_at: comment.created_at as string
    } as CreateCommentResponse;
  }
});
