import { AuthType, ProviderType } from '../core/types';
import { registerProvider } from '../core/registry';
import { listJiraProjects } from './list-projects';
import { listJiraIssues } from './list-issues';
import { createJiraIssue } from './create-issue';
import { updateJiraIssue } from './update-issue';
import { addJiraComment } from './add-comment';
import { readJiraProject } from './read-project';

export const jiraProvider = registerProvider({
  id: 'jira',
  name: 'Jira',
  description: 'Track issues, manage projects, and streamline workflows in Jira.',
  type: ProviderType.Native,
  
  auth: {
    type: AuthType.OAuth,
    clientId: process.env.JIRA_CLIENT_ID || '',
    clientSecret: process.env.JIRA_CLIENT_SECRET || '',
    authorizationUrl: 'https://auth.atlassian.com/authorize',
    tokenUrl: 'https://auth.atlassian.com/oauth/token',
    scopes: [
      'read:jira-work',
      'write:jira-work',
      'read:jira-user',
      'offline_access'
    ]
  },
  
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
  ],
  
  // Tools
  tools: [
    listJiraProjects,
    listJiraIssues,
    readJiraProject,
    createJiraIssue,
    updateJiraIssue,
    addJiraComment
  ]
});
