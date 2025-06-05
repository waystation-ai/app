import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
type TaskResponse = Record<string, unknown>;

export const readAsanaTask = defineTool({
  id: 'readAsanaTask',
  summary: 'Get details of a specific Asana task',
  description: 'Retrieves detailed information about a specific Asana task by its ID.',
  method: 'GET',
  path: '/tools/asana/read_task',
  parameters: z.object({
    taskId: z.string().describe('The unique identifier of the Asana task.')
  }),
  responses: {
    '200': {
      description: 'A JSON object representing the task details.',
      schema: z.record(z.unknown()).describe('Arbitrary JSON object representing a task.')
    }
  },
  handler: async ({ context, params }) => {
    // Asana API requires opt_fields to get detailed task information
    const result = await queryAsanaApi(
      context, 
      `/tasks/${params.taskId}?opt_fields=name,notes,assignee,due_on,completed,tags,custom_fields,projects,created_at,modified_at,permalink_url`
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the task from the response
    const task = result.content as Record<string, unknown>;
    
    // Return the task with transformed fields to match expected format
    return {
      id: task.gid,
      name: task.name,
      notes: task.notes,
      assignee: task.assignee,
      due_on: task.due_on,
      completed: task.completed,
      tags: task.tags,
      custom_fields: task.custom_fields,
      projects: task.projects,
      created_at: task.created_at,
      modified_at: task.modified_at,
      permalink_url: task.permalink_url
    } as TaskResponse;
  }
});
