import { ToolContext } from '../core/types';
import { queryMicrosoftGraphApi } from '../shared/microsoft-graph-api';

// For backward compatibility, maintain the same function signature
export async function queryOffice365Api<T>(
  context: ToolContext, 
  endpoint: string, 
  params?: Record<string, string>, 
  format?: string
): Promise<T> {
  return queryMicrosoftGraphApi<T>(context, endpoint, { 
    params, 
    format,
  });
}
