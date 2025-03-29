import { registerProvider } from '../core/registry';

export const outlookProvider = registerProvider({
  id: 'outlook',
  name: 'Outlook',
  description: 'Manage emails, calendar events, and contacts in Outlook.',
  
  // Marketing information
  bullets: [
    "Organize and prioritize emails intelligently",
    "Schedule meetings with smart calendar management",
    "Generate response drafts and follow-ups automatically"
  ],
  chat: [
    { role: 'user', content: "Can you help schedule our team's 1:1 meetings for next month?" },
    { role: 'agent', content: "I'll check everyone's availability. Would you like 30-minute or 1-hour slots?" },
    { role: 'user', content: "30-minute slots, and try to group them on the same days" },
    { role: 'agent', content: "I've scheduled all 1:1s for Tuesdays and Thursdays, found optimal times for each team member, and sent calendar invites with prep agenda templates." }
  ],
  
  // Empty tools array for now
  tools: []
});
