import { NextResponse } from 'next/server';
import { oauthService } from '@/app/lib/services/oauth-service';

export async function queryMondayApi(
  userId: string, 
  query: string, 
  variables?: Record<string, unknown> 
): Promise<NextResponse> { 
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
        return NextResponse.json(errors);
    }

    const data = await response.json();
    console.log(data);

    return NextResponse.json(data.data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return NextResponse.json(error.message);
    }

    console.log(error);
    return NextResponse.json(error);
  }
}
