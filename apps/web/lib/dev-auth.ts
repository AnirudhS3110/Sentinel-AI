/** Minimal JWT-shaped token for API dev auth when Firebase is not configured. */
export function getDevBearerToken(): string {
  const json = JSON.stringify({ sub: 'dev-user', user_id: 'dev-user', email: 'dev@sentinel.local' });
  const payload = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `dev.${payload}.local`;
}
