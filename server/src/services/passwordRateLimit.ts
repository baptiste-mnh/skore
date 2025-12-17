import Keyv from "keyv";

/**
 * Password Rate Limiting Service
 *
 * Prevents brute force password attacks by limiting failed password attempts.
 * Uses Keyv for storage (in-memory dev, Redis prod) with automatic expiration.
 *
 * Rate limit: 5 failed attempts per room per IP = 15-minute lockout
 */

// Separate store for rate limiting (ephemeral, short TTL)
const rateLimitStore = new Keyv({ namespace: "pwd_rate_limit" });

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

/**
 * Generate rate limit key for IP + room combination
 */
function getRateLimitKey(ip: string, roomId: string): string {
  return `${ip}:${roomId}`;
}

/**
 * Check if an IP is rate limited for password attempts on a room
 *
 * @param ip - Client IP address
 * @param roomId - Room ID being accessed
 * @returns True if rate limited (locked out), false otherwise
 */
export async function isPasswordAttemptRateLimited(
  ip: string,
  roomId: string
): Promise<boolean> {
  const key = getRateLimitKey(ip, roomId);
  const record: RateLimitRecord | undefined = await rateLimitStore.get(key);

  if (!record) {
    return false;
  }

  // Check if locked
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return true;
  }

  // Reset if lockout expired
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    await rateLimitStore.delete(key);
    return false;
  }

  return false;
}

/**
 * Record a failed password attempt
 *
 * If max attempts exceeded, lock the IP for the room for 15 minutes
 *
 * @param ip - Client IP address
 * @param roomId - Room ID being accessed
 */
export async function recordFailedPasswordAttempt(
  ip: string,
  roomId: string
): Promise<void> {
  const key = getRateLimitKey(ip, roomId);
  const record: RateLimitRecord | undefined = await rateLimitStore.get(key);

  const now = Date.now();

  if (!record) {
    // First failed attempt
    const newRecord: RateLimitRecord = {
      attempts: 1,
      firstAttemptTime: now,
    };
    await rateLimitStore.set(key, newRecord, LOCKOUT_DURATION_MS);
    return;
  }

  const updatedRecord: RateLimitRecord = {
    ...record,
    attempts: record.attempts + 1,
  };

  // Lock if max attempts exceeded
  if (updatedRecord.attempts >= MAX_ATTEMPTS) {
    updatedRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
    console.warn(
      `🔒 Password attempts locked for IP ${ip} on room ${roomId} (${updatedRecord.attempts} attempts)`
    );
  }

  // Store with extended TTL to ensure lockout persists
  await rateLimitStore.set(key, updatedRecord, LOCKOUT_DURATION_MS * 2);
}

/**
 * Clear password attempts for an IP on a room (after successful login)
 *
 * @param ip - Client IP address
 * @param roomId - Room ID being accessed
 */
export async function clearPasswordAttempts(
  ip: string,
  roomId: string
): Promise<void> {
  const key = getRateLimitKey(ip, roomId);
  await rateLimitStore.delete(key);
}
