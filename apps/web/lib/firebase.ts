'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth } from 'firebase/auth';
import { firebaseConfig, firebaseConfigured } from './config';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseAuth() {
  if (!firebaseConfigured) return null;
  if (!app) {
    const { apiKey, authDomain, projectId, appId } = firebaseConfig;
    app = getApps()[0] ?? initializeApp({ apiKey, authDomain, projectId, ...(appId ? { appId } : {}) });
  }
  if (!auth) auth = getAuth(app);
  return auth;
}

export async function signInWithGoogle() {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.');
  return signInWithPopup(a, new GoogleAuthProvider());
}

export async function firebaseSignOut() {
  const a = getFirebaseAuth();
  if (a) await signOut(a);
}
