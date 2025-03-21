import { ToolContext, ToolResult } from '../core/types';

export async function queryAsanaApi(
  context: ToolContext, 
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const accessToken = await context.getAccessToken();

    console.log(`Endpoint: ${endpoint}`);
    console.log(`Method: ${method}`);
    if (data) {
      console.log(`Data: ${JSON.stringify(data)}`);
    }
      
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify({ data });
    }
    
    const response = await fetch(`https://app.asana.com/api/1.0${endpoint}`, options);
    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      return { error: true, content: error };
    }
    
    const responseData = await response.json();
    console.log(responseData);
    
    return { error: false, content: responseData.data };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return { error: true, content: error.message };
    }

    console.log(error);
    return { error: true, content: error };
  }
}
