import { Provider, Tool } from './types';

export class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();
  
  registerProvider(provider: Provider): Provider {
    this.providers.set(provider.id, provider);
    return provider;
  }
  
  getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }
  
  getAllProviders(): Provider[] {
    return Array.from(this.providers.values());
  }
  
  getTool(toolId: string): Tool | undefined {
    for (const provider of this.providers.values()) {
      const tool = provider.tools.find(t => t.id === toolId);
      if (tool) return tool;
    }
    return undefined;
  }
  
  getAllTools(): Tool[] {
    return this.getAllProviders().flatMap(provider => provider.tools);
  }
}

export const registry = new ProviderRegistry();

export function registerProvider(provider: Provider): Provider {
  return registry.registerProvider(provider);
}
