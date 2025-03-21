import { registerProvider } from '../core/registry';

export const chromeProvider = registerProvider({
  id: 'chrome',
  name: 'Chrome',
  description: 'Automate and enhance your browser workflows with Chrome integration.',
  
  // Marketing information
  bullets: [
    "Automate repetitive browser tasks and workflows",
    "Extract and analyze data from web applications",
    "Synchronize information across browser sessions"
  ],
  chat: [
    { role: 'user', content: "Can you collect pricing data from our competitor's websites?" },
    { role: 'agent', content: "I'll scan their product pages. Would you like to focus on specific product categories?" },
    { role: 'user', content: "Yes, just the enterprise plans" },
    { role: 'agent', content: "I've gathered pricing data for enterprise plans from 5 competitors, created a comparison spreadsheet, and highlighted key differentiators in our offering." }
  ],
  
  // Empty tools array for now
  tools: []
});
