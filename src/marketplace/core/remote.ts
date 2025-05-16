import { RemoteProvider, Tool } from "./types";

export class RemoteProviderImpl implements RemoteProvider {
  serverUrl: string;
  id: string;
  name: string;
  description: string;
  bullets?: string[] | undefined;
  chat?: { role: "user" | "agent"; content: string; }[] | undefined;
  #tools: Tool[] | undefined;

  constructor(provider: RemoteProvider) {
    this.serverUrl = provider.serverUrl;
    this.id = provider.id;
    this.name = provider.name;
    this.description = provider.description;
    this.bullets = provider.bullets;
    this.chat = provider.chat;
  }

  get tools(): Tool[] {

    return this.#tools || [];
  }

}