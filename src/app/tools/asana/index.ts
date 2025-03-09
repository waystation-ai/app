import { registerProvider } from '../core/registry';
import { listAsanaWorkspaces } from './list-workspaces';
import { listAsanaProjects } from './list-projects';
import { readAsanaProject } from './read-project';
import { listAsanaTasks } from './list-tasks';
import { createAsanaTask } from './create-task';
import { updateAsanaTask } from './update-task';
import { createAsanaComment } from './create-comment';
import { searchAsanaTasks } from './search-tasks';

export const asanaProvider = registerProvider({
  name: 'asana',
  description: 'Access and manage your Asana workspaces, projects, and tasks seamlessly.',
  tools: [
    listAsanaWorkspaces,
    listAsanaProjects,
    readAsanaProject,
    listAsanaTasks,
    createAsanaTask,
    updateAsanaTask,
    createAsanaComment,
    searchAsanaTasks
  ]
});

// Re-export tools for direct imports if needed
export {
  listAsanaWorkspaces,
  listAsanaProjects,
  readAsanaProject,
  listAsanaTasks,
  createAsanaTask,
  updateAsanaTask,
  createAsanaComment,
  searchAsanaTasks
};
