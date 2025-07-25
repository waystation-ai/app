import { registerProvider } from '../core/registry';
import { listGmailThreads } from './list-threads';
import { readGmailThread } from './read-thread';
import { saveGmailDraft } from './save-draft';
import { sendGmailEmail } from './send-email';

export const gmailProvider = registerProvider({
  id: 'gmail',
  name: 'Gmail',
  description: 'Read emails, send messages, and manage labels in your Gmail account.',
  
  auth: {
    type: 'oauth',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.labels'
    ]
  },
  group: 'google',
  
  // Marketing information
  bullets: [
    "Process and organize emails intelligently with smart filters and labels",
    "Draft and send personalized responses automatically",
    "Extract insights and action items from your email communications"
  ],
  chat: [
    { role: 'user', content: "Can you check my emails from last week and identify any urgent client requests?" },
    { role: 'agent', content: "I'll scan your recent emails. Would you like me to categorize them by priority or response time needed?" },
    { role: 'user', content: "Priority please, and flag any that need immediate response" },
    { role: 'agent', content: "I've analyzed your emails and found 3 high-priority client requests. I've labeled them and drafted response templates for your review." }
  ],
  
  tools: [
    listGmailThreads,
    readGmailThread,
    saveGmailDraft,
    sendGmailEmail
  ]
});
