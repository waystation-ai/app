import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
interface CreateTaskResponse {
  id: string;
  name: string;
  permalink_url: string;
}

export const createAsanaTask = defineTool({
  id: 'createAsanaTask',
  summary: 'Create a new task in an Asana project',
  description: 'Creates a new task in the specified Asana project with optional details like description, due date, assignee, and custom fields.',
  method: 'POST',
  path: '/tools/asana/create_task',
  parameters: z.object({
    projectId: z.string().describe('The unique identifier of the Asana project'),
    name: z.string().describe('Name of the new task to create'),
    notes: z.string().optional().describe('Description or notes for the task'),
    due_on: z.string().optional().describe('Due date for the task in YYYY-MM-DD format'),
    assignee: z.string().optional().describe('User ID of the assignee. Use "me" for the current user.'),
    custom_fields: z.object({}).catchall(z.unknown()).describe('Custom fields to update. Format: { "custom_field_gid": value }. Values depend on field type (text, number, enum option GID, etc.)')
  }),
  responses: {
    '200': {
      description: 'Successfully created task',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created task'),
        name: z.string().describe('Name of the created task'),
        permalink_url: z.string().describe('URL to access the task in Asana')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare the task data
    const taskData: Record<string, unknown> = {
      name: params.name,
      projects: [params.projectId]
    };
    
    // Add optional fields if provided
    if (params.notes) {
      taskData.notes = params.notes;
    }
    
    if (params.due_on) {
      taskData.due_on = params.due_on;
    }
    
    if (params.assignee) {
      taskData.assignee = params.assignee;
    }
    
    if (params.custom_fields) {
      taskData.custom_fields = params.custom_fields;
    }
    
    const result = await queryAsanaApi(
      context.userId,
      '/tasks',
      'POST',
      taskData
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the created task from the response
    const task = result.content as Record<string, unknown>;
    
    return {
      id: task.gid as string,
      name: task.name as string,
      permalink_url: task.permalink_url as string
    } as CreateTaskResponse;
  }
});
