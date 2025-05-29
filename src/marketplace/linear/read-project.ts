import { z } from 'zod';
import { defineTool } from '../core/types';
import { LinearClient } from '@linear/sdk';

// Define the response type
type ProjectWithIssuesResponse = {
  project: {
    id: string;
    name: string;
    description: string | null;
    state: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date | null;
    targetDate: Date | null;
    progress: number;
  };
  issues: Array<Record<string, unknown>>;
};

export const readLinearProject = defineTool({
  id: 'readLinearProject',
  summary: 'Get project details and issues from a specific Linear project',
  description: 'Retrieves project metadata and all issues from the specified Linear project.',
  method: 'GET',
  path: '/tools/linear/read_project',
  parameters: z.object({
    projectId: z.string().describe('The unique identifier of the Linear project.')
  }),
  responses: {
    '200': {
      description: 'Project metadata and issues.',
      schema: z.object({
        project: z.object({
          id: z.string().describe('Unique identifier of the project'),
          name: z.string().describe('Name of the project'),
          description: z.string().nullable().describe('Description of the project'),
          state: z.string().describe('Current state of the project'),
          url: z.string().describe('URL of the project'),
          createdAt: z.date().describe('Creation date of the project'),
          updatedAt: z.date().describe('Last update date of the project'),
          startDate: z.date().nullable().describe('Start date of the project'),
          targetDate: z.date().nullable().describe('Target completion date of the project'),
          progress: z.number().describe('Progress percentage of the project')
        }),
        issues: z.array(z.record(z.unknown()).describe('Arbitrary JSON object representing a project issue.'))
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Get the access token from context
      const accessToken = await context.getAccessToken();
      
      // Initialize the Linear client with the access token
      const linearClient = new LinearClient({ accessToken: accessToken });
      
      // Get the project first to validate it exists
      const project = await linearClient.project(params.projectId);
      
      if (!project) {
        throw new Error(`Project with ID ${params.projectId} not found`);
      }
      
      // Extract project metadata
      const projectMetadata = {
        id: project.id,
        name: project.name,
        description: project.description,
        state: project.state,
        url: project.url,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        startDate: project.startDate,
        targetDate: project.targetDate,
        progress: project.progress
      };
      
      // Get issues for the project
      const issues = await project.issues();
      
      let resolvedIssues: Array<Record<string, unknown>> = [];
      
      if (issues && issues.nodes) {
        // Resolve promises for related objects to ensure they're serializable
        resolvedIssues = await Promise.all(issues.nodes.map(async issue => {
          // Await promise-based properties to resolve them
          const resolvedIssue = {
            ...issue,
            state: await issue.state,
            assignee: await issue.assignee,
            team: await issue.team,
            labels: await issue.labels()
          };
          
          return resolvedIssue;
        }));
      }
      
      return {
        project: projectMetadata,
        issues: resolvedIssues
      } as ProjectWithIssuesResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read project: ${error.message}`);
      }
      throw new Error('Failed to read project: Unknown error');
    }
  }
});
