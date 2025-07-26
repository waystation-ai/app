import { registerProvider } from '../core/registry';

export const zoomProvider = registerProvider({
  id: 'zoom',
  name: 'Zoom',
  description: 'Schedule, manage, and enhance your Zoom meetings and webinars.',
  
  // Marketing information
  bullets: [
    "Schedule and organize meetings with smart participant coordination",
    "Generate meeting summaries and action items automatically",
    "Track attendance and engagement across your meetings"
  ],
  chat: [
    { role: 'user', content: "Can you schedule our quarterly review and invite the whole team?" },
    { role: 'agent', content: "I'll help set that up. Would you like me to find the best time based on everyone's calendar?" },
    { role: 'user', content: "Yes, and make it a 2-hour slot" },
    { role: 'agent', content: "I've scheduled the quarterly review for next Tuesday at 10 AM, sent calendar invites, and included the Q3 report in the meeting details." }
  ],

});
