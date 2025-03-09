import { registerProvider } from '../core/registry';
import { listDocs } from './list-docs';
import { readDoc } from './read-doc';
import { searchDocs } from './search-docs';
import { recentDocs } from './recent-docs';

export const officeProvider = registerProvider({
  name: 'office',
  description: 'Access and manage your Office 365 documents seamlessly.',
  tools: [
    listDocs,
    readDoc,
    searchDocs,
    recentDocs
  ]
});

// Re-export tools for direct imports if needed
export {
  listDocs,
  readDoc,
  searchDocs,
  recentDocs
};
