import { registerProvider } from '../core/registry';

export const smartsheetProvider = registerProvider({
  id: 'smartsheet',
  name: 'Smartsheet',
  description: 'Manage projects and automate workflows with Smartsheet.',
  
  // Marketing information
  bullets: [
    "Update project timelines and dependencies automatically",
    "Generate status reports and resource allocations",
    "Track milestones and deliverables across teams"
  ],
  chat: [
    { role: 'user', content: "Can you update our project timeline based on this week's progress?" },
    { role: 'agent', content: "I'll review the updates. Should I adjust resource allocations or just delivery dates?" },
    { role: 'user', content: "Let's look at both to optimize the schedule" },
    { role: 'agent', content: "I've updated the timeline, rebalanced team workloads, and flagged potential bottlenecks. I've also created a summary of changes for stakeholders." }
  ],
  
  // Empty tools array for now
  tools: []
});
