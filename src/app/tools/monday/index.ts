import { registerProvider } from '../core/registry';
import { listMondayBoards } from './list-boards';
import { readMondayBoard } from './read-board';
import { createMondayItem } from './create-item';
import { updateMondayItem } from './update-item';
import { createMondayUpdate } from './create-update';

export const mondayProvider = registerProvider({
  name: 'monday',
  description: 'Access and manage your Monday.com boards, items, and updates seamlessly.',
  tools: [
    listMondayBoards,
    readMondayBoard,
    createMondayItem,
    updateMondayItem,
    createMondayUpdate
  ]
});

// Re-export tools for direct imports if needed
export {
  listMondayBoards,
  readMondayBoard,
  createMondayItem,
  updateMondayItem,
  createMondayUpdate
};
