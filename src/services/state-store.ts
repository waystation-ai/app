// In-memory state store for OAuth flows
// In production, use Redis or similar for cross-request state
export const stateStore = new Map<string, { state: string; provider: string }>();

export function cleanupOldStates() {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  stateStore.forEach((value, key) => {
    if (parseInt(key.split('_')[1]) < fiveMinutesAgo) {
      stateStore.delete(key);
    }
  });
}
