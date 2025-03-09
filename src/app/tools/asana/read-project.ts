import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryAsanaApi } from './utils';

// Define the response type
type ProjectTasksResponse = Array<Record<string, unknown>>;

export const readAsanaProject = defineTool({
  id: 'readAsanaProject',
  summary: 'Get tasks from a specific Asana project',
  description: 'Retrieves all tasks from the specified Asana project. The tasks can be arbitrary JSON objects.',
  method: 'GET',
  path: '/tools/asana/read_project',
  parameters: z.object({
    projectId: z.string().describe('The unique identifier of the Asana project.')
  }),
  responses: {
    '200': {
      description: 'A JSON array of project tasks.',
      schema: z.array(z.record(z.unknown()).describe('Arbitrary JSON object representing a project task.'))
    }
  },
  handler: async ({ context, params }) => {
    // Asana API requires opt_fields to get detailed task information
    const result = await queryAsanaApi(
      context.userId, 
      `/projects/${params.projectId}/tasks?opt_fields=name,notes,assignee,due_on,completed,tags,custom_fields`
    );
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the tasks from the response
    const tasks = result.content as Array<Record<string, unknown>>;
    
    // Return the tasks with transformed fields to match expected format
    return tasks.map(task => ({
      id: task.gid,
      name: task.name,
      notes: task.notes,
      assignee: task.assignee,
      due_on: task.due_on,
      completed: task.completed,
      tags: task.tags,
      custom_fields: task.custom_fields
    })) as ProjectTasksResponse;
  }
});
