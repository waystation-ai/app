import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi } from './utils';

export const listGmailThreads = defineTool({
  id: 'listGmailThreads',
  summary: 'List email threads from Gmail',
  description: 'Retrieves a list of email threads/conversations from the user\'s Gmail account with optional filtering.',
  method: 'GET',
  path: '/tools/gmail/list_threads',
  parameters: z.object({
    query: z.string().optional().describe('Search query to filter threads (e.g., "from:example@gmail.com", "subject:meeting")'),
    maxResults: z.number().min(1).max(100).default(10).describe('Maximum number of threads to return (1-100, default 10)'),
    labelIds: z.array(z.string()).optional().describe('Array of label IDs to filter threads by'),
    includeSpamTrash: z.boolean().default(false).describe('Include threads from spam and trash folders')
  }),
  responses: {
    '200': {
      description: 'Success response with list of email threads',
      schema: z.object({
        threads: z.array(z.object({
          id: z.string().describe('The unique identifier for the thread'),
          snippet: z.string().describe('A short snippet of the thread content'),
          historyId: z.string().describe('The history ID of the thread'),
          messageCount: z.number().describe('Number of messages in the thread')
        })),
        nextPageToken: z.string().optional().describe('Token for retrieving the next page of results'),
        resultSizeEstimate: z.number().describe('Estimated total number of threads matching the query')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) {
        queryParams.append('q', params.query);
      }
      
      queryParams.append('maxResults', (params.maxResults || 10).toString());
      
      if (params.labelIds && params.labelIds.length > 0) {
        params.labelIds.forEach(labelId => {
          queryParams.append('labelIds', labelId);
        });
      }
      
      if (params.includeSpamTrash) {
        queryParams.append('includeSpamTrash', 'true');
      }

      const endpoint = `users/me/threads?${queryParams.toString()}`;
      const result = await queryGmailApi(context, endpoint);

      // Get detailed info for each thread to include message count
      const threadsWithDetails = await Promise.all(
        (result.threads || []).map(async (thread: { id: string; snippet?: string; historyId: string }) => {
          try {
            const threadDetail = await queryGmailApi(context, `users/me/threads/${thread.id}?format=minimal`);
            return {
              id: thread.id,
              snippet: thread.snippet || '',
              historyId: thread.historyId,
              messageCount: threadDetail.messages?.length || 0
            };
          } catch {
            // If we can't get thread details, return basic info
            return {
              id: thread.id,
              snippet: thread.snippet || '',
              historyId: thread.historyId,
              messageCount: 0
            };
          }
        })
      );

      return {
        threads: threadsWithDetails,
        nextPageToken: result.nextPageToken,
        resultSizeEstimate: result.resultSizeEstimate || 0
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to list Gmail threads: ${JSON.stringify(error)}`);
    }
  }
});
