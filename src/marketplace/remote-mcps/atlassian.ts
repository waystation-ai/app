import { registerProvider } from '../core/registry';
import { ProviderType } from '../core/types';


export const jiraProvider = registerProvider({
  id: 'atlassian',
  name: 'Atlassian',
  description: 'Track issues, manage projects, and streamline workflows in Jira.',
  type: ProviderType.Remote,
  serverUrl: 'https://mcp.atlassian.com/v1/sse',
  
  // Marketing information
  bullets: [
    "Create and update issues based on team communications",
    "Track sprint progress and generate status reports",
    "Automate workflow transitions and notifications"
  ],
  chat: [
    { role: 'user', content: "Can you check our current sprint and highlight any blockers?" },
    { role: 'agent', content: "I'll analyze the sprint board. Would you like to focus on high-priority items or all blocked tasks?" },
    { role: 'user', content: "Show me high-priority blockers first" },
    { role: 'agent', content: "I found 3 high-priority blocked issues. I've tagged the relevant team leads and created a summary for our daily standup." }
  ]
});
