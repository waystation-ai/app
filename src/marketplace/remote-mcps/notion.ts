import { registerProvider } from '../core/registry';

export const notionProvider = registerProvider({
  id: 'notion-official',
  name: 'Notion',
  description: 'Access and manage your Notion databases, pages, and content.',
  
  serverUrl: 'https://mcp.notion.com/mcp',
  
  // Marketing information
  bullets: [
    "Access and manage your Notion databases and pages",
    "Create and update content in your Notion workspace",
    "Search across your Notion content and organize information"
  ],
  chat: [
    { role: 'user', content: "Can you summarize all our product specs in Notion and create a feature comparison table?" },
    { role: 'agent', content: "I'll analyze your Notion documents. Would you like to focus on current features or include the roadmap items too?" },
    { role: 'user', content: "Let's include roadmap items as well" },
    { role: 'agent', content: "I've created a comprehensive comparison table in Notion with current features and roadmap items, color-coded by development status and priority." }
  ],
  
});
