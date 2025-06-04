import { createSubscriber } from '@/lib/services/mailerlite';
import  PostHogClient from '@/lib/utils/posthog-client';

export async function POST(req: Request) {
  const payload = await req.json();
  const data = payload.data;

  const posthog = PostHogClient();

  switch (payload.type) {
    case 'user.created':
      await createSubscriber(data.id, data.email_addresses[0].email_address, data.first_name, data.last_name, payload.event_attributes.http_request.client_ip);
      posthog.capture({
        distinctId: data.id,
        event: 'signUp'
      });

      console.log('User created:', data.id);
  } 

  await posthog.shutdown();

  return Response.json({ success: true });
}