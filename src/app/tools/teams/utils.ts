import { queryMicrosoftGraphApi } from '../shared/microsoft-graph-api';

export async function queryTeamsApi<T>(
  userId: string, 
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    params?: Record<string, string>,
    body?: Record<string, unknown>
  } = {}
): Promise<T> {
  return queryMicrosoftGraphApi<T>(userId, endpoint, { 
    ...options,
    providerName: 'teams'
  });
}
