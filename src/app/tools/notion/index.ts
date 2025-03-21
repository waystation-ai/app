import { registerProvider } from '../core/registry';
import { listNotionDatabases } from './list-databases';
import { queryNotionDatabase } from './query-database';
import { listNotionPages } from './list-pages';
import { readNotionPage } from './read-page';
import { createNotionPage } from './create-page';
import { createNotionComment } from './create-comment';
import { searchNotion } from './search';

/*
import { createNotionDatabaseItem } from './create-database-item';
import { updateNotionDatabaseItem } from './update-database-item';
*/

export const notionProvider = registerProvider({
  id: 'notion',
  name: 'Notion',
  description: 'Access and manage your Notion databases, pages, and content.',
  
  // OAuth settings
  clientId: process.env.NOTION_CLIENT_ID || '',
  clientSecret: process.env.NOTION_CLIENT_SECRET || '',
  authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
  tokenUrl: 'https://api.notion.com/v1/oauth/token',
  scopes: [
    'read_user',
    'read_databases',
    'write_databases',
    'read_pages',
    'write_pages',
    'read_blocks',
    'write_blocks'
  ],
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`,
  
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
  
  tools: [
    listNotionDatabases,
    queryNotionDatabase,
/*
    createNotionDatabaseItem,
    updateNotionDatabaseItem,
*/
    listNotionPages,
    readNotionPage,
    createNotionPage,
    createNotionComment,
    searchNotion
  ]
});

// Re-export tools for direct imports if needed
export {
  listNotionDatabases,
  queryNotionDatabase,
/*
  createNotionDatabaseItem,
  updateNotionDatabaseItem,
*/
  listNotionPages,
  readNotionPage,
  createNotionPage,
  createNotionComment,
  searchNotion
};
