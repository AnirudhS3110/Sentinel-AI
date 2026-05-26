import { API_URL, WS_URL, WEB_URL, isRemoteApi } from './config';

export function formatApiError(raw: string, status?: number): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return status ? `Request failed (${status})` : 'Request failed';
  }
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.includes('</html>')) {
    if (trimmed.includes('could not be found') || status === 404) {
      return `Backend not reachable. Web UI is ${WEB_URL}; Nest API should run on port 3001 (npm run dev:api). Set NEXT_PUBLIC_API_URL=${WEB_URL}/backend and NEXT_PUBLIC_WS_URL=http://localhost:3001 in apps/web/.env, then restart dev:web.`;
    }
    return `Got HTML instead of JSON from ${API_URL}. Use ${WEB_URL}/backend (proxied to :3001), not the bare Next URL without /backend.`;
  }
  try {
    const json = JSON.parse(trimmed) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join(', ');
    if (typeof json.message === 'string') return json.message;
  } catch {
    /* plain text */
  }
  if (trimmed.length > 280) return `${trimmed.slice(0, 280)}…`;
  return trimmed;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function apiSetupHint(): string {
  if (isRemoteApi) {
    return `API ${API_URL} · WebSocket ${WS_URL}`;
  }
  return `API ${API_URL} → :3001 · WebSocket ${WS_URL}`;
}
