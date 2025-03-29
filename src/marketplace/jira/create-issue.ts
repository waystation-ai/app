import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

// Define interfaces for the request body structure
interface JiraIssueFields {
  project: { key: string };
  issuetype: { id: string };
  summary: string;
  description: {
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
}

interface JiraIssueRequest {
  fields: JiraIssueFields;
}

export const createJiraIssue = defineTool({
  id: 'createJiraIssue',
  summary: 'Create a new Jira issue',
  description: 'Creates a new issue in a specified Jira project with the provided details.',
  method: 'POST',
  path: '/tools/jira/create_issue',
  parameters: z.object({
    projectKey: z.string().describe('Project key where the issue will be created (e.g., "PROJ")'),
    issueTypeId: z.string().describe('ID of the issue type to create (e.g., "10001" for Bug)'),
    summary: z.string().describe('Issue title/summary'),
    description: z.string().describe('Detailed description of the issue'),
    priority: z.string().optional().describe('Issue priority (e.g., "High", "Medium", "Low")'),
    assignee: z.string().optional().describe('Username of the person to assign the issue to')
  }),
  responses: {
    '200': {
      description: 'Issue created successfully',
      schema: z.object({
        id: z.string().describe('Unique identifier for the created issue'),
        key: z.string().describe('Issue key (e.g., "PROJ-123")'),
        self: z.string().describe('URL to the created issue')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare the request body for Jira API
    const requestBody: JiraIssueRequest = {
      fields: {
        project: {
          key: params.projectKey
        },
        issuetype: {
          id: params.issueTypeId
        },
        summary: params.summary,
        description: {
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
        }
      }
    };

    // Add optional fields if provided
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

    // Make the API call to create the issue
    const result = await queryJiraApi(
      context,
      '/issue',
      'POST',
      requestBody as unknown as Record<string, unknown>
    );

    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }

    const response = result.content as {
      id: string;
      key: string;
      self: string;
    };

    return {
      id: response.id,
      key: response.key,
      self: response.self
    };
  }
});
