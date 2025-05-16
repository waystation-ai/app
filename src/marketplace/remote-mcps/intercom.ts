import { registerProvider } from '../core/registry';

export const intercomProvider = registerProvider({
  id: 'intercom',
  name: 'Intercom',
  description: 'Manage customer relationships with Intercom\'s powerful CRM for tracking people, companies, and conversations',
  
  serverUrl: 'https://mcp.intercom.com/sse',
    
  // Marketing information
  bullets: [
    "Retrieve and update customer profiles and company information",
    "Access conversation history and send messages to customers",
    "Create segments and filter contacts based on attributes and behaviors"
  ],
  chat: [
    { role: 'user', content: "Can you find all enterprise customers in Intercom who haven't been contacted in the last 30 days?" },
    { role: 'agent', content: "I'll search for enterprise customers with no recent contact. Would you like me to include their company information as well?" },
    { role: 'user', content: "Yes, and also show me their last conversation topic" },
    { role: 'agent', content: "I've found 12 enterprise customers with no contact in the last 30 days. I've compiled their profiles, company details, and the topics of their last conversations in a list for your review." }
  ],
  
  tools: []
});
