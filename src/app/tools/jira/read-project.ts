import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryJiraApi } from './utils';

type ProjectResponse = {
  id: string;
  key: string;
  name: string;
  description?: string;
  issueTypes: Array<{
    id: string;
    name: string;
    description?: string;
    subtask: boolean;
  }>;
};

export const readJiraProject = defineTool({
  id: 'readJiraProject',
  summary: 'Get Jira project metadata including issue types',
  description: 'Retrieves detailed information about a Jira project, including all available issue types with their IDs.',
  method: 'GET',
  path: '/tools/jira/read_project',
  parameters: z.object({
    projectIdOrKey: z.string().describe('Project ID or key (e.g., "10000" or "PROJ")')
  }),
  responses: {
    '200': {
      description: 'Project metadata retrieved successfully',
      schema: z.object({
        id: z.string().describe('Project ID'),
        key: z.string().describe('Project key'),
        name: z.string().describe('Project name'),
        description: z.string().optional().describe('Project description'),
        issueTypes: z.array(z.object({
          id: z.string().describe('Issue type ID - use this for creating issues'),
          name: z.string().describe('Issue type name'),
          description: z.string().optional().describe('Issue type description'),
          subtask: z.boolean().describe('Whether this is a subtask issue type')
        })).describe('Available issue types for this project')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Make a direct API call to the Jira project endpoint with expand=issueTypes
    const result = await queryJiraApi(
      context,
      `/project/${params.projectIdOrKey}?expand=issueTypes`,
      'GET'
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const projectData = result.content as Record<string, unknown>;
    
    // Transform the response to our desired format
    const response: ProjectResponse = {
      id: String(projectData.id),
      key: String(projectData.key),
      name: String(projectData.name),
      description: typeof projectData.description === 'string' ? projectData.description : undefined,
      issueTypes: []
    };
    
    // Extract issue types if available
    if (projectData.issueTypes && Array.isArray(projectData.issueTypes)) {
      response.issueTypes = projectData.issueTypes.map((issueType: Record<string, unknown>) => ({
        id: String(issueType.id),
        name: String(issueType.name),
        description: typeof issueType.description === 'string' ? issueType.description as string : undefined,
        subtask: Boolean(issueType.subtask)
      }));
    }
    
    return response;
  }
});
