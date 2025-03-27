import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
type TeamsResponse = Array<{
  id: string;
  name: string;
  key: string;
}>;

export const listLinearTeams = defineTool({
  id: 'listLinearTeams',
  summary: 'Get a list of teams from Linear',
  description: 'Retrieves a list of teams associated with the authenticated user from Linear.',
  method: 'GET',
  path: '/tools/linear/list_teams',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of teams',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the team'),
        name: z.string().describe('Name of the team'),
        key: z.string().describe('Key prefix used for issues in this team')
      }))
    }
  },
  handler: async ({ context }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get teams using the SDK
      const teams = await linearClient.teams();
      
      if (!teams) {
        return [] as TeamsResponse;
      }
      
      // Map the teams to the expected format
      return teams.nodes.map(team => ({
        id: team.id,
        name: team.name,
        key: team.key
      })) as TeamsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list teams: ${error.message}`);
      }
      throw new Error('Failed to list teams: Unknown error');
    }
  }
});
