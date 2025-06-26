import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { promises as fs } from 'fs';
import path from 'path';

async function getSystemPrompt() {
  try {
    const filePath = path.join(process.cwd(), 'src/app/api/context42/system.MD');
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading instructions file:', error);
    return ''; // Return empty string if file cannot be read
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { messages/*, id */} = data;
  
  // Get the current user
  const session = await auth();
  const userId = session.userId;

  if (!userId)
    return new Response('Unauthorized', { status: 401 });
  
  const result = streamText({
    model: openai.responses('gpt-4.1'),
    system: await getSystemPrompt(),
    messages,
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: 'high',
      }),
    },
    onError({ error }) {
      console.error(error); 
    },
    /*
    async onFinish({ response }) {
      if (id) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      }
    },
    */
  });

  // Consume stream to ensure it runs to completion even if client disconnects
  result.consumeStream();

  const response = result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error('Error in streamText:', error);
      return "error";
    },
    sendReasoning: true,
    sendUsage: false,
  });

  result.usage.then((usage) => {
    console.log('Usage:', usage);
  });

  return response;
}
