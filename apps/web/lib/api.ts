'use client';

import { API_URL } from './config';
import { ApiError, formatApiError } from './api-error';
import type { Incident, IncidentReport, PaginatedIncidents, WorkflowExecution } from './types';

async function getToken(): Promise<string | null> {
  const { getFirebaseAuth } = await import('./firebase');
  const { firebaseConfigured } = await import('./config');
  if (!firebaseConfigured) {
    const { getDevBearerToken } = await import('./dev-auth');
    return getDevBearerToken();
  }
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) return null;
  return auth.currentUser.getIdToken();
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(formatApiError(text, res.status), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchIncidents(page = 1, limit = 20) {
  return apiFetch<PaginatedIncidents>(`/incidents?page=${page}&limit=${limit}`);
}

export function fetchIncident(id: string) {
  return apiFetch<Incident>(`/incidents/${id}`);
}

export function createIncident(body: { title: string; description?: string; rawLogs: string }) {
  return apiFetch<{ incident: Incident; workflow: WorkflowExecution }>('/incidents', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchWorkflows(incidentId: string) {
  return apiFetch<WorkflowExecution[]>(`/incidents/${incidentId}/workflows`);
}

export function fetchTimeline(incidentId: string) {
  return apiFetch<{ incidentId: string; timeline: unknown[] }>(`/incidents/${incidentId}/workflows/timeline`);
}

export async function fetchLatestReport(incidentId: string): Promise<IncidentReport | null> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/incidents/${incidentId}/reports/latest`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(formatApiError(text, res.status), res.status);
  }
  return res.json() as Promise<IncidentReport>;
}
