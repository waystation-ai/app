import { registerProvider } from '../core/registry';

export const gsheetsProvider = registerProvider({
  id: 'gsheets',
  name: 'Google Sheets',
  description: 'Create, edit, and analyze spreadsheet data with Google Sheets integration.',
  
  // Marketing information
  bullets: [
    "Create and update spreadsheets with data from various sources",
    "Perform calculations and data analysis automatically",
    "Generate charts and visualizations from your spreadsheet data"
  ],
  chat: [
    { role: 'user', content: "Can you create a budget tracking spreadsheet in Google Sheets?" },
    { role: 'agent', content: "I'll create a budget tracking spreadsheet. Would you like categories for income, expenses, and savings with monthly tracking?" },
    { role: 'user', content: "Yes, and add a dashboard with charts" },
    { role: 'agent', content: "I've created your budget spreadsheet with income, expenses, and savings categories. The dashboard includes monthly comparison charts and a savings progress tracker." }
  ],
});
