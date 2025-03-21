import { registerProvider } from '../core/registry';
import { listTeamsChannels } from './list-channels';
import { postTeamsMessage } from './post-message';
// import { readTeamsChannel } from './read-channel';

export const teamsProvider = registerProvider({
  id: 'teams',
  name: 'Microsoft Teams',
  description: 'Collaborate, chat, and manage meetings in Microsoft Teams.',
  
  // OAuth settings
  clientId: process.env.OFFICE_CLIENT_ID || '',
  clientSecret: process.env.OFFICE_CLIENT_SECRET || '',
  authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  scopes: [
    'User.Read',
    'Team.ReadBasic.All',
    'Channel.ReadBasic.All',
    'ChannelMessage.Send',
    'offline_access'
  ],
  group: 'microsoft',
  
  // Marketing information
  bullets: [
    "Coordinate team communications and meeting schedules intelligently",
    "Generate summaries from chats and channel discussions",
    "Automate updates and notifications across teams"
  ],
  chat: [
    { role: 'user', content: "Can you summarize the key decisions from our project channels this week?" },
    { role: 'agent', content: "I'll analyze the discussions. Would you like to focus on technical decisions or project timelines?" },
    { role: 'user', content: "Technical decisions please" },
    { role: 'agent', content: "I've compiled the technical decisions from 5 channels and created a summary document. I've also flagged items that need further discussion in our next architecture review." }
  ],
  
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
