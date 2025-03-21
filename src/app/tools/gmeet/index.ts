import { registerProvider } from '../core/registry';

export const gmeetProvider = registerProvider({
  id: 'gmeet',
  name: 'Google Meet',
  description: 'Schedule and manage video meetings with Google Meet.',
  
  // Marketing information
  bullets: [
    "Schedule and coordinate video meetings efficiently",
    "Generate meeting summaries and action items",
    "Track attendance and participation analytics"
  ],
  chat: [
    { role: 'user', content: "Can you set up our weekly team syncs for next quarter?" },
    { role: 'agent', content: "I'll help schedule those. Would you like to keep the same time slots or find new ones based on team availability?" },
    { role: 'user', content: "Let's find new times that work better for our remote team" },
    { role: 'agent', content: "I've analyzed everyone's calendars and time zones, found optimal slots, and scheduled the meetings with rotating discussion topics and prep materials." }
  ],
  
  // Empty tools array for now
  tools: []
});
