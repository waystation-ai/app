import { registerProvider } from '../core/registry';
import { listDocs } from './list-docs';
import { readDoc } from './read-doc';

export const gdriveProvider = registerProvider({
  name: 'gdrive',
  description: 'Access and manage your Google Drive documents seamlessly.',
  tools: [
    listDocs,
    readDoc
  ]
});

// Re-export tools for direct imports if needed
export {
  listDocs,
  readDoc
};
