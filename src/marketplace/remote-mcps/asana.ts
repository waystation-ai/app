import { registerProvider } from '../core/registry';

export const asanaOfficialProvider = registerProvider({
  id: 'asana-official',
  name: 'Asana',
  description: 'Access and manage your Asana workspaces, projects, and tasks seamlessly.',

  serverUrl: 'https://mcp.asana.com/sse',
    
  // Marketing information
  bullets: [
    "Track project progress and milestone completion automatically",
    "Convert conversations and emails into structured tasks",
    "Keep teams aligned with smart project updates and summaries"
  ],
  chat: [
    { role: 'user', content: "Can you create tasks for all the action items from today's meeting?" },
    { role: 'agent', content: "I'll review the meeting notes. Would you like these organized by project or deadline?" },
    { role: 'user', content: "Let's organize them by project" },
    { role: 'agent', content: "I've created 8 tasks across 3 projects, assigned them to the relevant team members, and added the context from our meeting notes." }
  ]
});
