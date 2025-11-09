export const getSessionId = () => {
  let sessionId = localStorage.getItem('shopping_session_id');
  
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('shopping_session_id', sessionId);
  }
  
  return sessionId;
};