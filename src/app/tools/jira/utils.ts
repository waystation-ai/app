import { ToolContext, ToolResult } from '../core/types';

// Cache the cloud ID to avoid repeated calls
let cachedCloudId = '';

/**
 * Gets the Jira Cloud ID for the authenticated user
 * This is required for making API calls to Jira Cloud
 */
export async function getJiraCloudId(context: ToolContext): Promise<string> {
  if (cachedCloudId) return cachedCloudId;
  
  try {
    const accessToken = await context.getAccessToken();
    const response = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Jira Cloud ID');
    }
    
    const sites = await response.json();
    if (!sites || sites.length === 0) {
      throw new Error('No accessible Jira sites found');
    }
    
    // Use the first site's ID
    cachedCloudId = sites[0].id;
    return cachedCloudId;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting Jira Cloud ID: ${error.message}`);
    }
    throw new Error('Unknown error getting Jira Cloud ID');
  }
}

/**
 * Makes a request to the Jira API
 */
export async function queryJiraApi(
  context: ToolContext,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const accessToken = await context.getAccessToken();
    const cloudId = await getJiraCloudId(context);
    
    // Jira Cloud API base URL with cloud ID
    const baseUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
    }
    
    console.log(`Making ${method} request to ${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('Jira API error:', errorData);
        return { error: true, content: errorData };
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        return { error: true, content: `HTTP error ${response.status}: ${response.statusText}` };
      }
    }
    
    // For 204 No Content responses, return success with empty content
    if (response.status === 204) {
      return { error: false, content: {} };
    }
    
    // For other successful responses, try to parse JSON
    try {
      const data = await response.json();
      return { error: false, content: data };
    } catch (parseError) {
      console.error('Error parsing success response:', parseError);
      return { error: false, content: {} };
    }
  } catch (error) {
    console.error('Error in queryJiraApi:', error);
    if (error instanceof Error) {
      return { error: true, content: error.message };
    }
    return { error: true, content: error };
  }
}
