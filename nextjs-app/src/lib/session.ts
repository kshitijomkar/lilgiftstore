/**
 * Session ID management utility - matches old project pattern exactly
 * Generates a unique session ID for shopping cart tracking
 * Note: This should only be called from client-side code
 */
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    try {
      localStorage.setItem('session_id', sessionId);
    } catch (e) {
      // localStorage might not be available in some environments
    }
  }
  return sessionId;
};
