import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define Linear resource types
export type LinearIssueResource = {
  id: string;
  name: string;
  url: string;
  identifier: string;
  state: string;
  priority: number;
  resource_type: 'issue';
};

export type LinearProjectResource = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  state: string;
  resource_type: 'project';
};

export type LinearResource = LinearIssueResource | LinearProjectResource;

export const getLinearFavorites = defineTool({
  id: 'getLinearFavorites',
  summary: 'Get a list of user\'s favorite projects and issues from Linear',
  description: 'Retrieves a list of favorite projects and issues from Linear for the authenticated user.',
  method: 'GET',
  path: '/tools/linear/get_favorites',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of user favorites including projects and issues',
      schema: z.array(z.union([
        z.object({
          id: z.string().describe('Linear identifier for the issue (e.g., ENG-123)'),
          name: z.string().describe('Title of the issue'),
          url: z.string().describe('URL of the issue'),
          identifier: z.string().describe('Human-readable identifier (e.g., ENG-123)'),
          state: z.string().describe('Current state of the issue'),
          priority: z.number().describe('Priority of the issue (1-4, where 1 is highest)'),
          resource_type: z.literal('issue').describe('Resource type')
        }),
        z.object({
          id: z.string().describe('Linear identifier for the project'),
          name: z.string().describe('Name of the project'),
          url: z.string().describe('URL of the project'),
          description: z.string().nullable().describe('Description of the project'),
          state: z.string().describe('Current state of the project'),
          resource_type: z.literal('project').describe('Resource type')
        })
      ]))
    }
  },
  handler: async ({ context }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get favorites using the SDK
      const favorites = await linearClient.favorites();
      
      if (!favorites || !favorites.nodes) {
        return [] as LinearResource[];
      }
      
      // Process favorites and build the response array
      const allFavorites: LinearResource[] = [];
      
      for (const favorite of favorites.nodes) {
        if (favorite.issue) {
          // Handle issue favorites
          const issue = await favorite.issue;
          const state = await issue.state;
          
          allFavorites.push({
            id: issue.identifier, // Use Linear identifier (ENG-123) as requested
            name: issue.title,
            url: issue.url,
            identifier: issue.identifier,
            state: state ? state.name : 'Unknown',
            priority: issue.priority,
            resource_type: 'issue'
          });
        } else if (favorite.project) {
          // Handle project favorites
          const project = await favorite.project;
          
          allFavorites.push({
            id: project.id, // Projects don't have identifiers like issues
            name: project.name,
            url: project.url,
            description: project.description,
            state: project.state,
            resource_type: 'project'
          });
        }
      }
      
      return allFavorites;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get favorites: ${error.message}`);
      }
      throw new Error('Failed to get favorites: Unknown error');
    }
  }
});
