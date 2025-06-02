import { registerProvider } from '../core/registry';

export const paypalProvider = registerProvider({
  id: 'paypal',
  name: 'PayPal',
  description: 'Access and manage PayPal transactions, payments, and account information.',
  
  serverUrl: 'https://mcp.paypal.com/sse',
    
  // Marketing information
  bullets: [
    "Process payments and track transaction status in real-time",
    "Manage refunds and payment disputes directly from conversations",
    "Access account balances and financial summaries on demand"
  ],
  chat: [
    { role: 'user', content: "Can you check if we received the payment from Acme Corp?" },
    { role: 'agent', content: "I'll check your recent PayPal transactions. What's the expected amount or invoice number?" },
    { role: 'user', content: "It should be $1,250 for invoice #AC-2025-06" },
    { role: 'agent', content: "I found the payment from Acme Corp for $1,250 (invoice #AC-2025-06). It was received yesterday at 3:42 PM and has been cleared." }
  ],
  
  tools: []
});
