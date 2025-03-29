import { ToolContext } from '../core/types';
import { queryMicrosoftGraphApi } from '../shared/microsoft-graph-api';

export async function queryTeamsApi<T>(
  context: ToolContext, 
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    params?: Record<string, string>,
    body?: Record<string, unknown>
  } = {}
): Promise<T> {
  return queryMicrosoftGraphApi<T>(context, endpoint, { 
    ...options,
  });
}
