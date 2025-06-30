import { registerProvider } from '../core/registry';
import { listBases } from './list-bases';
import { listTables } from './list-tables';
import { listRecords } from './list-records';
import { createRecord } from './create-record';
import { updateRecord } from './update-record';

export const airtableProvider = registerProvider({
  id: 'airtable',
  name: 'Airtable',
  description: 'Access and manage your Airtable bases, tables, and records seamlessly.',
  auth: {
    type: 'oauth',
    clientId: process.env.AIRTABLE_CLIENT_ID || '',
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    scopes: [
      'data.records:read',
      'data.records:write',
      'schema.bases:read'
    ]
  },
  
  // Marketing information
  bullets: [
    "Sync and update records automatically across your bases",
    "Transform data into structured insights and reports",
    "Automate workflows between Airtable and other tools"
  ],
  chat: [
    { role: 'user', content: "Can you analyze our sales data from Q4 and create a summary report?" },
    { role: 'agent', content: "I'll examine the sales base. Would you like to focus on revenue trends or customer segments?" },
    { role: 'user', content: "Let's look at customer segments first" },
    { role: 'agent', content: "I've analyzed the data and created a new view showing key customer segments, their growth rates, and potential opportunities. I've also added charts to visualize the trends." }
  ],
  
  tools: [
    listBases,
    listTables,
    listRecords,
    createRecord,
    updateRecord
  ]
});
