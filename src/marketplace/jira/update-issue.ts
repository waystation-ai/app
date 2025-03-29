import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

// Define interfaces for the request body structure
interface JiraIssueFields {
  summary?: string;
  description?: {
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
  priority?: { name: string };
  assignee?: { name: string };
  status?: { name: string };
}

interface JiraIssueRequest {
  fields: JiraIssueFields;
}

export const updateJiraIssue = defineTool({
  id: 'updateJiraIssue',
  summary: 'Update an existing Jira issue',
  description: 'Updates an existing issue in Jira with the provided details.',
  method: 'PUT',
  path: '/tools/jira/update_issue',
  parameters: z.object({
    issueKey: z.string().describe('The issue key to update (e.g., "PROJ-123")'),
    summary: z.string().optional().describe('Updated issue title/summary'),
    description: z.string().optional().describe('Updated description of the issue'),
    status: z.string().optional().describe('New status for the issue'),
    priority: z.string().optional().describe('Updated priority (e.g., "High", "Medium", "Low")'),
    assignee: z.string().optional().describe('Username of the person to assign the issue to')
  }),
  responses: {
    '200': {
      description: 'Issue updated successfully',
      schema: z.object({
        success: z.boolean().describe('Whether the update was successful'),
        issueKey: z.string().describe('The key of the updated issue')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare the request body for Jira API
    const requestBody: JiraIssueRequest = {
      fields: {}
    };

    // Add fields that need to be updated
    if (params.summary) {
      requestBody.fields.summary = params.summary;
    }

    if (params.description) {
      requestBody.fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: params.description
              }
            ]
          }
        ]
      };
    }

    if (params.status) {
      requestBody.fields.status = {
        name: params.status
      };
    }

    if (params.priority) {
      requestBody.fields.priority = {
        name: params.priority
      };
    }

    if (params.assignee) {
      requestBody.fields.assignee = {
        name: params.assignee
      };
    }

    // Make the API call to update the issue
    const result = await queryJiraApi(
      context,
      `/issue/${params.issueKey}`,
      'PUT',
      requestBody as unknown as Record<string, unknown>
    );

    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }

    return {
      success: true,
      issueKey: params.issueKey
    };
  }
});
