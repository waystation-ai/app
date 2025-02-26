import { registerProvider } from '../core/registry';
import { listBases } from './list-bases';
import { listTables } from './list-tables';
import { listRecords } from './list-records';
import { createRecord } from './create-record';
import { updateRecord } from './update-record';

export const airtableProvider = registerProvider({
  name: 'airtable',
  description: 'Airtable integration for managing bases, tables, and records',
  tools: [
    listBases,
    listTables,
    listRecords,
    createRecord,
    updateRecord
  ]
});

// Re-export tools
export {
  listBases,
  listTables,
  listRecords,
  createRecord,
  updateRecord
};
