import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';
import { AsanaTask } from './types';

// Define the response type
type TasksResponse = Array<AsanaTask>;

export const searchAsanaTasks = defineTool({
  id: 'searchAsanaTasks',
  summary: 'Search for tasks in Asana',
  description: 'Searches for tasks in Asana that match the search term, with optional filtering by workspace, project, and completion status.',
  method: 'GET',
  path: '/tools/asana/search_tasks',
  parameters: z.object({
    workspaceId: z.string().describe('The workspace ID to search within'),
    query: z.string().describe('The query text to search for in task names and descriptions'),
    projectId: z.string().optional().describe('Filter tasks to a specific project ID')
  }),
  responses: {
    '200': {
      description: 'A JSON array of matching tasks.',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the task'),
        name: z.string().describe('Name of the task'),
        url: z.string().describe('URL of the task'),
        completed: z.boolean().describe('Whether the task is completed'),
        due_on: z.string().optional().describe('Due date of the task'),
        assignee: z.record(z.unknown()).optional().describe('Assignee information')
      }))
    }
  },
  handler: async ({ context, params }) => {
    // Build the query parameters
    const queryParams = new URLSearchParams();
    
    // Add opt_fields for detailed task information
    queryParams.append('opt_fields', 'gid,name,completed,due_on,assignee,permalink_url');
    
    // Add the search term
    queryParams.append('text', params.query);
    
    // Add project filter if provided
    if (params.projectId) {
      queryParams.append('project', params.projectId);
    }
    
    const result = await queryAsanaApi(
      context, 
      `/workspaces/${params.workspaceId}/tasks/search?${queryParams.toString()}`
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the tasks from the response
    const tasks = result.content as Array<Record<string, unknown>>;
    
    return tasks.map(task => ({
      id: task.gid as string,
      name: task.name as string,
      completed: task.completed as boolean,
      due_on: task.due_on as string | undefined,
      assignee: task.assignee as Record<string, unknown> | undefined,
      url: task.permalink_url as string
    })) as TasksResponse;
  }
});
