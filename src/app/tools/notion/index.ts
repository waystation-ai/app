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
  name: 'notion',
  description: 'Access and manage your Notion databases, pages, and content.',
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
