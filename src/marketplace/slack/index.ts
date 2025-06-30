import { registerProvider } from '../core/registry';
import { listSlackChannels } from './list-channels';
import { postSlackMessage } from './post-message';
import { readSlackChannel } from './read-channel';

export const slackProvider = registerProvider({
  id: 'slack',
  name: 'Slack',
  description: 'Send messages, access channels, and manage files in your Slack workspace.',
  
  auth: {
    type: 'oauth',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: [
      'channels:read',
      'channels:history',
      'groups:read',
      'groups:history',
      'chat:write',
      'files:read',
      'users:read'
    ]
  },
  
  // Marketing information
  bullets: [
    "Share updates and insights across your team channels automatically",
    "Coordinate responses to messages and threads intelligently",
    "Keep teams in sync with smart notifications and summaries"
  ],
  chat: [
    { role: 'user', content: "Can you summarize today's #product-team discussions and share the key points with #engineering?" },
    { role: 'agent', content: "I'll analyze the product team channel and create a summary. Would you like me to focus on technical requirements?" },
    { role: 'user', content: "Yes, and highlight any upcoming deadlines" },
    { role: 'agent', content: "I've posted a summary to #engineering highlighting the technical requirements and deadlines. I've also added reminders for the critical milestones." }
  ],
  
  tools: [
    listSlackChannels,
    postSlackMessage,
    readSlackChannel
  ]
});
