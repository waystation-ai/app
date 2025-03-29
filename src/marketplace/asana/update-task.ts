import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
interface UpdateTaskResponse {
  id: string;
  name: string;
  permalink_url: string;
}

export const updateAsanaTask = defineTool({
  id: 'updateAsanaTask',
  summary: 'Update an existing task in Asana',
  description: 'Updates an existing Asana task with new values for name, notes, due date, assignee, completion status, or custom fields.',
  method: 'PUT',
  path: '/tools/asana/update_task',
  parameters: z.object({
    taskId: z.string().describe('The unique identifier of the task to update'),
    name: z.string().optional().describe('New name for the task'),
    notes: z.string().optional().describe('New description or notes for the task'),
    due_on: z.string().optional().describe('New due date for the task in YYYY-MM-DD format'),
    assignee: z.string().optional().describe('New assignee user ID. Use "me" for the current user or null to unassign.'),
    completed: z.boolean().optional().describe('New completion status for the task'),
    custom_fields: z.object({}).catchall(z.unknown()).describe('Custom fields to update. Format: { "custom_field_gid": value }. Values depend on field type (text, number, enum option GID, etc.)')
  }),
  responses: {
    '200': {
      description: 'Successfully updated task',
      schema: z.object({
        id: z.string().describe('Unique identifier of the updated task'),
        name: z.string().describe('Name of the updated task'),
        permalink_url: z.string().describe('URL to access the task in Asana')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare the task data with only the fields that need to be updated
    const taskData: Record<string, unknown> = {};
    
    if (params.name !== undefined) {
      taskData.name = params.name;
    }
    
    if (params.notes !== undefined) {
      taskData.notes = params.notes;
    }
    
    if (params.due_on !== undefined) {
      taskData.due_on = params.due_on;
    }
    
    if (params.assignee !== undefined) {
      taskData.assignee = params.assignee;
    }
    
    if (params.completed !== undefined) {
      taskData.completed = params.completed;
    }
    
    if (params.custom_fields) {
      taskData.custom_fields = params.custom_fields;
    }

    console.log('taskData', taskData);
    
    const result = await queryAsanaApi(
      context,
      `/tasks/${params.taskId}`,
      'PUT',
      taskData
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      console.error('result.error', result.content);
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the updated task from the response
    const task = result.content as Record<string, unknown>;
    
    return {
      id: task.gid as string,
      name: task.name as string,
      permalink_url: task.permalink_url as string
    } as UpdateTaskResponse;
  }
});
