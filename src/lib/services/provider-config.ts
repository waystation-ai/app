import { registry } from '@/app/tools/core/registry';
import { Provider } from '@/app/tools/core/types';

import '@/app/tools/main';

/**
 * Get provider configuration from the registry
 * This function serves as a bridge between the old OAuth provider system and the new registry-based system
 */
export function getProviderConfig(providerId: string): Provider {
  const provider = registry.getProvider(providerId);
  
  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }
  
  return provider;
}
