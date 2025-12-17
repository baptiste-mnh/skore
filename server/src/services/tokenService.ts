import crypto from "crypto";

/**
 * Token Service for Password-Protected Rooms
 *
 * Uses HMAC-SHA256 for stateless access token generation.
 * Tokens are ephemeral and aligned with room TTL (1 hour).
 */

const TOKEN_SECRET: string = (() => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("FATAL: TOKEN_SECRET environment variable must be set");
  }
  return secret;
})();

/**
 * Generate an access token for a player in a room
 *
 * Token format: base64url(roomId|playerId|timestamp|hmac)
 * HMAC = HMAC-SHA256(secret, roomId + playerId + timestamp)
 *
 * @param roomId - The room ID
 * @param playerId - The player's socket ID
 * @returns Base64url-encoded access token
 */
export function generateAccessToken(roomId: string, playerId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${roomId}|${playerId}|${timestamp}`;

  const hmac = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("base64url");

  const token = Buffer.from(`${payload}|${hmac}`).toString("base64url");
  return token;
}

/**
 * Validate an access token and extract the player ID
 *
 * @param token - The access token to validate
 * @param roomId - The expected room ID
 * @returns The player ID if valid, null otherwise
 */
export function validateAccessToken(
  token: string,
  roomId: string
): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");

    if (parts.length !== 4) {
      return null;
    }

    const [tokenRoomId, playerId, timestamp, hmac] = parts;

    // Verify room match
    if (tokenRoomId !== roomId) {
      return null;
    }

    // Verify HMAC
    const payload = `${tokenRoomId}|${playerId}|${timestamp}`;
    const expectedHmac = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payload)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }

    // Token is valid, return player ID
    return playerId;
  } catch (error) {
    // Invalid base64 or parsing error
    return null;
  }
}
