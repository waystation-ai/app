import { queryMicrosoftGraphApi } from '../shared/microsoft-graph-api';

// For backward compatibility, maintain the same function signature
export async function queryOffice365Api<T>(
  userId: string, 
  endpoint: string, 
  params?: Record<string, string>, 
  format?: string
): Promise<T> {
  return queryMicrosoftGraphApi<T>(userId, endpoint, { 
    params, 
    format,
    providerName: 'office'
  });
}
