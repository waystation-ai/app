import { registerProvider } from '../core/registry';

export const trelloProvider = registerProvider({
  id: 'trello',
  name: 'Trello',
  description: 'Organize projects and track tasks with Trello boards and cards.',
  
  // Marketing information
  bullets: [
    "Create and organize cards from team discussions",
    "Track deadlines and progress across multiple boards",
    "Automate task assignments and status updates"
  ],
  chat: [
    { role: 'user', content: "Can you organize our product backlog and prioritize this month's features?" },
    { role: 'agent', content: "I'll review the backlog. Should I prioritize based on customer impact or development effort?" },
    { role: 'user', content: "Let's prioritize by customer impact" },
    { role: 'agent', content: "I've reorganized the backlog, tagged high-impact features, and created a new board for this month's sprint with estimated story points." }
  ],

});
