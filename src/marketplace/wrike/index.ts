import { registerProvider } from '../core/registry';

export const wrikeProvider = registerProvider({
  id: 'wrike',
  name: 'Wrike',
  description: 'Manage projects, tasks, and workflows with Wrike project management.',
  
  // Marketing information
  bullets: [
    "Track project progress and manage tasks across your organization",
    "Automate workflow processes and task assignments",
    "Generate reports and insights on project status and team performance"
  ],
  chat: [
    { role: 'user', content: "Can you create tasks in Wrike for our website redesign project?" },
    { role: 'agent', content: "I'll set up the website redesign project in Wrike. Would you like me to use our standard design workflow template?" },
    { role: 'user', content: "Yes, and add John and Sarah as collaborators" },
    { role: 'agent', content: "I've created the website redesign project with all tasks following our standard workflow. John and Sarah have been added as collaborators, and I've set up the initial milestones." }
  ],
  
  // Empty tools array
  tools: []
});
