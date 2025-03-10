import { registerProvider } from '../core/registry';
import { listTeamsChannels } from './list-channels';
import { postTeamsMessage } from './post-message';
// import { readTeamsChannel } from './read-channel';

export const teamsProvider = registerProvider({
  name: 'teams',
  description: 'Access and interact with Microsoft Teams channels and messages in your workspace.',
  tools: [
    listTeamsChannels,
    postTeamsMessage,
//    readTeamsChannel
  ]
});

// Re-export tools for direct imports if needed
export {
  listTeamsChannels,
  postTeamsMessage,
//  readTeamsChannel
};
