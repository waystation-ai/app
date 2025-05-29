import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
type IssueDetailsResponse = {
  issue: {
    id: string;
    identifier: string;
    title: string;
    description: string | null;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    estimate: number | null;
    state: {
      id: string;
      name: string;
      type: string;
      color: string;
    } | null;
    assignee: {
      id: string;
      name: string;
      email: string;
      displayName: string;
    } | null;
    creator: {
      id: string;
      name: string;
      email: string;
      displayName: string;
    } | null;
    team: {
      id: string;
      name: string;
      key: string;
    } | null;
    project: {
      id: string;
      name: string;
      description: string | null;
    } | null;
    labels: Array<{
      id: string;
      name: string;
      color: string;
    }>;
    subscribers: Array<{
      id: string;
      name: string;
      email: string;
    }>;
  };
  comments: Array<{
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      displayName: string;
    } | null;
  }>;
};

export const readLinearIssue = defineTool({
  id: 'readLinearIssue',
  summary: 'Get detailed metadata about a specific Linear issue',
  description: 'Retrieves comprehensive issue details including assignee, state, labels, comments, and related data from the specified Linear issue.',
  method: 'GET',
  path: '/tools/linear/read_issue',
  parameters: z.object({
    issueId: z.string().describe('The unique identifier of the Linear issue.')
  }),
  responses: {
    '200': {
      description: 'Issue metadata and related data.',
      schema: z.object({
        issue: z.object({
          id: z.string().describe('Unique identifier of the issue'),
          identifier: z.string().describe('Human-readable identifier (e.g., ENG-123)'),
          title: z.string().describe('Title of the issue'),
          description: z.string().nullable().describe('Description of the issue'),
          url: z.string().describe('URL of the issue'),
          createdAt: z.date().describe('Creation date of the issue'),
          updatedAt: z.date().describe('Last update date of the issue'),
          priority: z.number().describe('Priority of the issue (1-4, where 1 is highest)'),
          estimate: z.number().nullable().describe('Estimate points for the issue'),
          state: z.object({
            id: z.string().describe('Unique identifier of the state'),
            name: z.string().describe('Name of the state'),
            type: z.string().describe('Type of the state'),
            color: z.string().describe('Color of the state')
          }).nullable().describe('Current state of the issue'),
          assignee: z.object({
            id: z.string().describe('Unique identifier of the assignee'),
            name: z.string().describe('Name of the assignee'),
            email: z.string().describe('Email of the assignee'),
            displayName: z.string().describe('Display name of the assignee')
          }).nullable().describe('User assigned to the issue'),
          creator: z.object({
            id: z.string().describe('Unique identifier of the creator'),
            name: z.string().describe('Name of the creator'),
            email: z.string().describe('Email of the creator'),
            displayName: z.string().describe('Display name of the creator')
          }).nullable().describe('User who created the issue'),
          team: z.object({
            id: z.string().describe('Unique identifier of the team'),
            name: z.string().describe('Name of the team'),
            key: z.string().describe('Key of the team')
          }).nullable().describe('Team the issue belongs to'),
          project: z.object({
            id: z.string().describe('Unique identifier of the project'),
            name: z.string().describe('Name of the project'),
            description: z.string().nullable().describe('Description of the project')
          }).nullable().describe('Project the issue belongs to'),
          labels: z.array(z.object({
            id: z.string().describe('Unique identifier of the label'),
            name: z.string().describe('Name of the label'),
            color: z.string().describe('Color of the label')
          })).describe('Labels attached to the issue'),
          subscribers: z.array(z.object({
            id: z.string().describe('Unique identifier of the subscriber'),
            name: z.string().describe('Name of the subscriber'),
            email: z.string().describe('Email of the subscriber')
          })).describe('Users subscribed to the issue')
        }),
        comments: z.array(z.object({
          id: z.string().describe('Unique identifier of the comment'),
          body: z.string().describe('Content of the comment'),
          createdAt: z.date().describe('Creation date of the comment'),
          updatedAt: z.date().describe('Last update date of the comment'),
          user: z.object({
            id: z.string().describe('Unique identifier of the comment author'),
            name: z.string().describe('Name of the comment author'),
            displayName: z.string().describe('Display name of the comment author')
          }).nullable().describe('User who created the comment')
        })).describe('Comments on the issue')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get the issue first to validate it exists
      const issue = await linearClient.issue(params.issueId);
      
      if (!issue) {
        throw new Error(`Issue with ID ${params.issueId} not found`);
      }
      
      // Resolve all promise-based properties
      const [state, assignee, creator, team, project, labels, subscribers] = await Promise.all([
        issue.state,
        issue.assignee,
        issue.creator,
        issue.team,
        issue.project,
        issue.labels(),
        issue.subscribers()
      ]);
      
      // Extract issue metadata
      const issueMetadata = {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description,
        url: issue.url,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        priority: issue.priority,
        estimate: issue.estimate,
        state: state ? {
          id: state.id,
          name: state.name,
          type: state.type,
          color: state.color
        } : null,
        assignee: assignee ? {
          id: assignee.id,
          name: assignee.name,
          email: assignee.email,
          displayName: assignee.displayName
        } : null,
        creator: creator ? {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          displayName: creator.displayName
        } : null,
        team: team ? {
          id: team.id,
          name: team.name,
          key: team.key
        } : null,
        project: project ? {
          id: project.id,
          name: project.name,
          description: project.description
        } : null,
        labels: labels && labels.nodes ? labels.nodes.map(label => ({
          id: label.id,
          name: label.name,
          color: label.color
        })) : [],
        subscribers: subscribers && subscribers.nodes ? subscribers.nodes.map(subscriber => ({
          id: subscriber.id,
          name: subscriber.name,
          email: subscriber.email
        })) : []
      };
      
      // Get comments for the issue
      const comments = await issue.comments();
      
      let resolvedComments: Array<{
        id: string;
        body: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
          id: string;
          name: string;
          displayName: string;
        } | null;
      }> = [];
      
      if (comments && comments.nodes) {
        // Resolve promises for comment users
        resolvedComments = await Promise.all(comments.nodes.map(async comment => {
          const user = await comment.user;
          return {
            id: comment.id,
            body: comment.body,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            user: user ? {
              id: user.id,
              name: user.name,
              displayName: user.displayName
            } : null
          };
        }));
      }
      
      return {
        issue: issueMetadata,
        comments: resolvedComments
      } as IssueDetailsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read issue: ${error.message}`);
      }
      throw new Error('Failed to read issue: Unknown error');
    }
  }
});
