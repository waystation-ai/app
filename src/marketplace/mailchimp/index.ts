import { registerProvider } from '../core/registry';

export const mailchimpProvider = registerProvider({
  id: 'mailchimp',
  name: 'Mailchimp',
  description: 'Create and manage email marketing campaigns in Mailchimp.',
  
  // Marketing information
  bullets: [
    "Create and optimize email campaigns automatically",
    "Analyze subscriber engagement and behavior",
    "Generate personalized content for different segments"
  ],
  chat: [
    { role: 'user', content: "Can you analyze our last campaign's performance and prepare next month's newsletter?" },
    { role: 'agent', content: "I'll review the metrics. Should we focus on improving open rates or click-through rates?" },
    { role: 'user', content: "Let's improve click-through rates" },
    { role: 'agent', content: "I've analyzed the data and drafted a new newsletter with optimized CTAs, personalized content blocks, and A/B test variants based on successful patterns." }
  ],
  
  // Empty tools array for now
  tools: []
});
