import { registerProvider } from '../core/registry';
import { ProviderType } from '../core/types';

export const linearOfficialProvider = registerProvider({
  id: 'linear-official',
  name: 'Linear',
  description: 'Track issues, manage product development, and streamline software projects with Linear',
  type: ProviderType.Remote,
  
  serverUrl: 'https://mcp.linear.app/sse',
    
  // Marketing information
  bullets: [
    "Create and prioritize issues for software development",
    "Track progress with customizable workflows and cycles",
    "Manage roadmaps and coordinate releases across teams"
  ],
  chat: [
    { role: 'user', content: "Can you create issues in Linear for the bugs we found during testing?" },
    { role: 'agent', content: "I'll create issues for the bugs in Linear. Would you like me to prioritize them based on severity?" },
    { role: 'user', content: "Yes, and assign critical ones to the backend team" },
    { role: 'agent', content: "I've created all bug issues in Linear, prioritized by severity. Critical issues have been assigned to the backend team and added to the current cycle." }
  ]
});
