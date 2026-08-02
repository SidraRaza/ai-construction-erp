/**
 * Session Security Helper for 1-Hour Automatic Expiration & Cookie Sync
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
 * Sync session state into browser cookies for Next.js Edge Middleware
 */
function syncSessionCookies(session: UserSessionData | null) {
  if (typeof document === "undefined") return;

  if (session && session.expiresAt && Date.now() < session.expiresAt) {
    const remainingSeconds = Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000));
    const companyId = session.user?.companyId || session.company?.id || "cl_default_company";
    const role = session.user?.role || "ADMIN";

    document.cookie = `erp_session=active; path=/; max-age=${remainingSeconds}; SameSite=Lax`;
    document.cookie = `x-company-id=${companyId}; path=/; max-age=${remainingSeconds}; SameSite=Lax`;
    document.cookie = `erp_role=${role}; path=/; max-age=${remainingSeconds}; SameSite=Lax`;
  } else {
    document.cookie = "erp_session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "x-company-id=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "erp_role=; path=/; max-age=0; SameSite=Lax";
  }
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
    syncSessionCookies(sessionWithExpiry);
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
    if (!saved) {
      syncSessionCookies(null);
      return null;
    }

    const parsed: UserSessionData = JSON.parse(saved);
    const now = Date.now();

    // Check 1-hour expiration condition
    if (parsed.expiresAt && now > parsed.expiresAt) {
      console.warn("Session expired after 1 hour. Clearing session.");
      clearSession();
      return null;
    }

    // Keep cookies fresh and in sync
    syncSessionCookies(parsed);
    return parsed;
  } catch (e) {
    clearSession();
    return null;
  }
}

/**
 * Clear current active session from localStorage & cookies.
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    syncSessionCookies(null);
  } catch (e) {}
}
