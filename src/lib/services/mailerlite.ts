// For ECMAScript (ESM)
import MailerLite, { CreateOrUpdateSubscriberParams } from '@mailerlite/mailerlite-nodejs';

const mlSend = new MailerLite({
  api_key: process.env.MLSEND_KEY || '',
});

export async function createSubscriber(userId: string, email: string, name: string, lastName: string, ip: string) {
  try {
    const params: CreateOrUpdateSubscriberParams = {
      email,
      fields: {
        name,
        last_name: lastName,
        user_id: userId,
      },
      groups: process.env.MLSEND_GROUP ? process.env.MLSEND_GROUP.split(',') : [],
      ip_address: ip,
      optin_ip: ip,
      opted_in_at: new Date().toISOString().replace("T"," ").substring(0, 19),
    }
    
    const result = await mlSend.subscribers.createOrUpdate(params);
    console.log('createSubscriber', result.data);
  } catch (error) {
    console.error('Error creating subscriber:', error);
  }
}