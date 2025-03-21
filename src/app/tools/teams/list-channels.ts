import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryTeamsApi } from './utils';

interface Team {
  id: string;
  displayName: string;
  description?: string;
}

interface Channel {
  id: string;
  displayName: string;
  description?: string;
}

interface TeamsResponse {
  value: Team[];
}

interface ChannelsResponse {
  value: Channel[];
}

export const listTeamsChannels = defineTool({
  id: 'listTeamsChannels',
  summary: 'List Microsoft Teams channels',
  description: 'Retrieves a list of teams and channels from the authenticated user\'s Microsoft Teams workspace.',
  method: 'GET',
  path: '/tools/teams/list_channels',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of Teams channels',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the channel'),
        name: z.string().describe('Name of the channel'),
        teamId: z.string().describe('ID of the team this channel belongs to'),
        teamName: z.string().describe('Name of the team this channel belongs to'),
        description: z.string().optional().describe('Description of the channel')
      }))
    }
  },
  handler: async ({ context }) => {
    try {
      // First get all teams the user is a member of
      const teamsResult = await queryTeamsApi<TeamsResponse>(
        context, 
        'me/joinedTeams'
      );
      
      // For each team, get its channels
      const channelsPromises = teamsResult.value.map(async (team) => {
        const channelsResult = await queryTeamsApi<ChannelsResponse>(
          context, 
          `teams/${team.id}/channels`
        );
        
        // Map each channel to include both team and channel info
        return channelsResult.value.map((channel) => ({
          id: channel.id,
          name: channel.displayName,
          teamId: team.id,
          teamName: team.displayName,
          description: channel.description || undefined
        }));
      });
      
      // Flatten the array of arrays into a single array of channels
      const allChannels = (await Promise.all(channelsPromises)).flat();
      
      return allChannels;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to list Teams channels: ${JSON.stringify(error)}`);
    }
  }
});
