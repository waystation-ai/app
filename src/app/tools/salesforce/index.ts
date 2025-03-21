import { registerProvider } from '../core/registry';

export const salesforceProvider = registerProvider({
  id: 'salesforce',
  name: 'Salesforce',
  description: 'Manage customer relationships and sales processes in Salesforce.',
  
  // Marketing information
  bullets: [
    "Update and enrich customer records automatically",
    "Track sales pipeline and generate forecasts",
    "Automate follow-ups and task assignments"
  ],
  chat: [
    { role: 'user', content: "Can you analyze our pipeline and highlight deals we might close this quarter?" },
    { role: 'agent', content: "I'll examine the opportunities. Would you like to focus on deal size or closing probability?" },
    { role: 'user', content: "Let's look at high-probability deals first" },
    { role: 'agent', content: "I've identified 8 high-probability opportunities worth $1.2M. I've created a detailed report and suggested next actions for each deal." }
  ],
  
  // Empty tools array for now
  tools: []
});
