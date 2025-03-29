import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

// Define interfaces for Jira API response structure
interface JiraUser {
  displayName: string;
  [key: string]: unknown;
}

interface JiraField {
  name: string;
  [key: string]: unknown;
}

interface JiraIssueFields {
  summary?: string;
  status?: JiraField;
  priority?: JiraField;
  assignee?: JiraUser;
  [key: string]: unknown;
}

interface JiraIssue {
  id: string | number;
  key: string | number;
  fields?: JiraIssueFields;
  [key: string]: unknown;
}

type IssueResponse = Array<{
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee?: string;
}>;

export const listJiraIssues = defineTool({
  id: 'listJiraIssues',
  summary: 'Get a list of Jira issues',
  description: 'Retrieves a list of issues from a Jira project or using a JQL query.',
  method: 'GET',
  path: '/tools/jira/list_issues',
  parameters: z.object({
    jql: z.string().describe('JQL query string (e.g., "project = PROJ AND status = Open")'),
    maxResults: z.number().optional().describe('Maximum number of results to return (default: 50)')
  }),
  responses: {
    '200': {
      description: 'A JSON array of Jira issues',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the issue'),
        key: z.string().describe('Issue key (e.g., PROJ-123)'),
        summary: z.string().describe('Issue summary/title'),
        status: z.string().describe('Current status'),
        priority: z.string().describe('Issue priority'),
        assignee: z.string().optional().describe('Assigned user (if any)')
      }))
    }
  },
  handler: async ({ context, params }) => {
    // Make a direct API call to the Jira search endpoint
    const searchParams = {
      jql: params.jql,
      maxResults: params.maxResults || 50
    };
    
    const result = await queryJiraApi(
      context, 
      '/search',
      'POST',
      searchParams
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const searchResult = result.content as { issues: Array<JiraIssue> };
    return searchResult.issues.map(issue => ({
      id: String(issue.id),
      key: String(issue.key),
      summary: String(issue.fields?.summary || ''),
      status: String(issue.fields?.status?.name || 'Unknown'),
      priority: String(issue.fields?.priority?.name || 'Unknown'),
      assignee: issue.fields?.assignee?.displayName
    })) as IssueResponse;
  }
});
