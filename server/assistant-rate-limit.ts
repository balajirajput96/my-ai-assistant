type RateWindow = { startedAt: number; count: number };

const windows = new Map<string, RateWindow>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

/**
 * Lightweight process-level protection for the public MVP chat endpoint.
 * A future multi-instance release must replace this with shared durable rate limiting.
 */
export function consumeChatRequest(key: string, timestamp = Date.now()): boolean {
  const current = windows.get(key);
  if (!current || timestamp - current.startedAt >= WINDOW_MS) {
    windows.set(key, { startedAt: timestamp, count: 1 });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export function clearChatRateLimitsForTest() {
  windows.clear();
}
