import { registerProvider } from '../core/registry';
import { listSlackChannels } from './list-channels';
import { postSlackMessage } from './post-message';
import { readSlackChannel } from './read-channel';

export const slackProvider = registerProvider({
  name: 'slack',
  description: 'Access and interact with Slack channels and messages in your workspace.',
  tools: [
    listSlackChannels,
    postSlackMessage,
    readSlackChannel
  ]
});

// Re-export tools for direct imports if needed
export {
  listSlackChannels,
  postSlackMessage,
  readSlackChannel
};
