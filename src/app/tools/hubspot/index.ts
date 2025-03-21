import { registerProvider } from '../core/registry';

export const hubspotProvider = registerProvider({
  id: 'hubspot',
  name: 'HubSpot',
  description: 'Manage contacts, deals, and marketing campaigns in your HubSpot account.',
  
  // Marketing information
  bullets: [
    "Track and nurture leads through automated workflows",
    "Generate personalized content for marketing campaigns",
    "Analyze customer interactions and engagement patterns"
  ],
  chat: [
    { role: 'user', content: "Can you identify leads that haven't been contacted in the last month?" },
    { role: 'agent', content: "I'll search through our contacts. Would you like to filter by lead score or industry?" },
    { role: 'user', content: "Filter by lead score, focus on high-value prospects" },
    { role: 'agent', content: "I found 12 high-scoring leads needing follow-up. I've created a smart list and drafted personalized email templates based on their recent interactions." }
  ],
  
  // Empty tools array for now
  tools: []
});
