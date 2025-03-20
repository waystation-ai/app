import { db } from '@/app/lib/db';
import { oauthStates } from '@/app/lib/db/schema';
import { eq, lt } from 'drizzle-orm';

interface StateData {
  state: string;
  provider: string;
  codeVerifier?: string;
  userId: string;
  redirectUri?: string;
}

export class StateStore {
  async saveState(stateData: StateData, expirationMinutes: number = 5): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
      
      await db.insert(oauthStates).values({
        state: stateData.state,
        provider: stateData.provider,
        codeVerifier: stateData.codeVerifier,
        userId: stateData.userId,
        redirectUri: stateData.redirectUri,
        expiresAt
      });
      
      console.log(`Successfully saved OAuth state: ${stateData.state} for provider: ${stateData.provider}`);
    } catch (error) {
      console.error(`Failed to save OAuth state ${stateData.state}:`, error);
      // We rethrow this error since failing to save the state would break the OAuth flow
      throw error;
    }
  }

  async getState(state: string): Promise<StateData | null> {
    try {
      const results = await db.select().from(oauthStates).where(eq(oauthStates.state, state));
      
      if (!results.length) {
        console.log(`No OAuth state found for: ${state}`);
        return null;
      }
      
      const stateRecord = results[0];
      console.log(`Retrieved OAuth state: ${state} for provider: ${stateRecord.provider}`);
      
      return {
        state: stateRecord.state,
        provider: stateRecord.provider,
        codeVerifier: stateRecord.codeVerifier || undefined,
        userId: stateRecord.userId,
        redirectUri: stateRecord.redirectUri || undefined
      };
    } catch (error) {
      console.error(`Failed to retrieve OAuth state ${state}:`, error);
      // We rethrow this error since failing to get the state would break the OAuth flow
      throw error;
    }
  }

  async deleteState(state: string): Promise<void> {
    try {
      await db.delete(oauthStates).where(eq(oauthStates.state, state));
      console.log(`Successfully deleted OAuth state: ${state}`);
    } catch (error) {
      console.error(`Failed to delete OAuth state ${state}:`, error);
      // We don't rethrow the error to prevent disrupting the OAuth flow
      // but we log it for monitoring and debugging
    }
  }

  async cleanupExpiredStates(): Promise<void> {
    try {
      const now = new Date();
      await db.delete(oauthStates).where(lt(oauthStates.expiresAt, now));
      console.log(`Cleaned up expired OAuth states`);
    } catch (error) {
      console.error(`Failed to clean up expired OAuth states:`, error);
      // We don't rethrow the error to prevent disrupting the OAuth flow
      // but we log it for monitoring and debugging
    }
  }
}

// Export singleton instance
export const stateStore = new StateStore();
