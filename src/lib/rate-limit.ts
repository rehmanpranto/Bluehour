// Simple in-memory rate limiter for MVP
// Maps IP/key to array of timestamps
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];

  // Remove timestamps outside the window
  const recentTimestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(key, recentTimestamps);
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
