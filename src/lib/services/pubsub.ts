import { Client } from '@neondatabase/serverless';

// Type for message callback
export type MessageCallback = (message?: string) => void;

export class PubSubService {
  private client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL?.replace('-pooler', '')
    });
  }

  // Connect (call once when needed)
  async connect(): Promise<void> {
    await this.client.connect();
  }

  // Listen to a session
  async listen(channel: string, callback: MessageCallback): Promise<void> {
    await this.client.query(`LISTEN ${channel}`);
    
    this.client.on('notification', (msg) => {
      if (msg.channel === channel) {
        try {
          callback(msg.payload);
        } catch (error) {
          console.error('Callback execution failed:', error);
        }
      }
    });
  }

  // Publish to a session
  async notify(channel: string, message: string): Promise<void> {
    await this.client.query('SELECT pg_notify($1, $2)', [channel, message]);
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.client.end();
  }
}

// Factory function for easy instantiation
export async function createPubSub(): Promise<PubSubService> {
  const pubsub = new PubSubService();
  await pubsub.connect();
  return pubsub;
}

// Quick publish helper for serverless usage
export async function publishToSession(channel: string, message: string): Promise<void> {
  const pubsub = await createPubSub();
  try {
    await pubsub.notify(channel, message);
  } finally {
    await pubsub.disconnect();
  }
}
