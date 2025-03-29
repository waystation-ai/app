import { registerProvider } from '../core/registry';

export const clickupProvider = registerProvider({
  id: 'clickup',
  name: 'ClickUp',
  description: 'Organize tasks, manage projects, and collaborate with your team using ClickUp.',
  
  // Marketing information
  bullets: [
    "Create and organize tasks with custom statuses and fields",
    "Track time, set priorities, and manage dependencies",
    "Visualize work with multiple views including list, board, and Gantt"
  ],
  chat: [
    { role: 'user', content: "Can you set up our marketing campaign tasks in ClickUp?" },
    { role: 'agent', content: "I'll create a marketing campaign structure in ClickUp. Would you like to use our standard campaign template with social media, content, and PR tasks?" },
    { role: 'user', content: "Yes, and add a section for influencer outreach" },
    { role: 'agent', content: "I've set up the marketing campaign in ClickUp with all standard sections plus a new influencer outreach section. I've assigned initial due dates based on our typical campaign timeline." }
  ],
  
  // Empty tools array
  tools: []
});
