/**
 * Session Security Helper for 1-Hour Automatic Expiration
 */

export const SESSION_KEY = "erp_user_session";
export const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds (3,600,000 ms)

export interface UserSessionData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    phone?: string;
  };
  company?: {
    id: string;
    name: string;
    country?: string;
    taxNumber?: string;
    address?: string;
  };
  loginTime?: number;
  expiresAt?: number;
}

/**
 * Save user/company session data with a 1-hour expiration timestamp.
 */
export function saveSession(data: UserSessionData): UserSessionData {
  const now = Date.now();
  const sessionWithExpiry: UserSessionData = {
    ...data,
    loginTime: now,
    expiresAt: now + ONE_HOUR_MS,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithExpiry));
  } catch (e) {
    console.error("Failed to save session to localStorage", e);
  }

  return sessionWithExpiry;
}

/**
 * Retrieve current active session. Automatically expires & clears if older than 1 hour.
 */
export function getValidSession(): UserSessionData | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;

    const parsed: UserSessionData = JSON.parse(saved);
    const now = Date.now();

    // Check 1-hour expiration condition
    if (parsed.expiresAt && now > parsed.expiresAt) {
      console.warn("Session expired after 1 hour. Clearing session.");
      clearSession();
      return null;
    }

    return parsed;
  } catch (e) {
    clearSession();
    return null;
  }
}

/**
 * Clear current active session from localStorage.
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}
