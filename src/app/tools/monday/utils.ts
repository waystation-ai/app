import { oauthService } from '@/app/lib/services/oauth-service';
import { ToolResult } from '../core/types';

export async function queryMondayApi(userId: string, query: string, variables?: Record<string, unknown>): Promise<ToolResult> { 
  try {
    const accessToken = await oauthService.getValidAccessToken('monday', userId);

    console.log(`Access token: ${accessToken}`);
    console.log(`Query: ${query}`);
    if (variables) {
      console.log(`Variables: ${JSON.stringify(variables)}`);
    }
      
    const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
        },
        body: JSON.stringify({ 
          query,
          variables 
        })
    });
    console.log(response);

    if (!response.ok) {
        const {errors} = await response.json();
        return { error: true, content: errors };
    }

    const data = await response.json();
    console.log(data);

    return {error: false, content: data.data};
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return { error: true, content: error.message };
    }

    console.log(error);
    return { error: true, content: error };
  }
}
