import  PostHogClient from '@/lib/utils/posthog-client';

export async function POST(req: Request) {
  const payload = await req.json();
  const data = payload.data;

  const posthog = PostHogClient();

  switch (payload.type) {
    case 'user.created':
      posthog.capture({
        distinctId: data.id,
        event: 'signUp'
      });
      console.log('User created:', data.id);
  } 

  await posthog.shutdown();

  return Response.json({ success: true });
}