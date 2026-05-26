/** Next.js dev server (web UI) */
export const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';

/**
 * API base URL. Use http://localhost:3000/backend so requests hit the Next proxy → Nest on :3001.
 * Direct: http://localhost:3001
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/backend';

/** Socket.IO lives on the Nest server (not proxied through Next) */
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001';

/** True when the web app targets a remote API (e.g. Vercel → Railway). */
export const isRemoteApi =
  !API_URL.includes('localhost') && !API_URL.includes('127.0.0.1');

/** Firebase web API keys are ~39 chars and start with AIza */
export function isValidFirebaseApiKey(key: string): boolean {
  return /^AIza[0-9A-Za-z_-]{30,}$/.test(key.trim());
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? '',
};

export const firebaseConfigured =
  Boolean(
    firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      isValidFirebaseApiKey(firebaseConfig.apiKey),
  );
