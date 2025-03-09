import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
type TasksResponse = Array<{
  id: string;
  name: string;
  completed: boolean;
  due_on?: string;
  assignee?: Record<string, unknown>;
}>;

export const listAsanaTasks = defineTool({
  id: 'listAsanaTasks',
  summary: 'Get a filtered list of tasks from Asana',
  description: 'Retrieves tasks from Asana filtered by project, assignee, and completion status.',
  method: 'GET',
  path: '/tools/asana/list_tasks',
  parameters: z.object({
    workspaceId: z.string().describe('Filter tasks to a specific workspace ID'),
    projectId: z.string().optional().describe('Filter tasks to a specific project ID'),
    assigneeId: z.string().optional().describe('Filter tasks to a specific assignee ID. Use "me" for the current user.'),
    completed: z.boolean().optional().describe('Filter tasks by completion status')
  }),
  responses: {
    '200': {
      description: 'A JSON array of project tasks.',
      schema: z.array(z.record(z.unknown()).describe('Arbitrary JSON object representing a project task.'))
    }
  },
  handler: async ({ context, params }) => {
    // Build the query parameters
    const queryParams = new URLSearchParams();
    
    // Add opt_fields for detailed task information
    queryParams.append('opt_fields', 'name,completed,due_on,assignee');
    
    // Add filters if provided
    if (params.workspaceId) {
      queryParams.append('workspace', params.workspaceId);
    }

    if (params.projectId) {
      queryParams.append('project', params.projectId);
    }
    
    queryParams.append('assignee', params.assigneeId || 'me');
    
    if (params.completed !== undefined) {
      queryParams.append('completed', params.completed.toString());
    }
    
    const result = await queryAsanaApi(
      context.userId, 
      `/tasks?${queryParams.toString()}`
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
      assignee: task.assignee as Record<string, unknown> | undefined
    })) as TasksResponse;
  }
});
