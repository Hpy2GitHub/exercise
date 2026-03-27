// src/services/exerciseApi.ts
//
// Thin wrapper around the CGI backend (exercise.py).
//
// Supported actions and their HTTP methods:
//   GET  ?action=get              → { status, data: { exercises, lists } }
//   POST action=post              → { status, message }          (body: action + json_data)
//   GET  ?action=drive_load       → { status, data, metadata }
//   POST action=drive_save        → { status, drive_response }   (body: action + json_data + filename?)
//   GET  ?action=sync_from_drive  → { status, message, data }
//   GET  ?action=sync_to_drive    → { status, message, drive_response }
//   GET  ?action=debug            → { status, debug_info }
//
// All functions throw on network failure or when status !== "success".

import { Exercise, ExerciseList } from '../types';

const API_URL = '/cgi-bin/cd/sandbox/exercise/exercise.py';

// ─── shared types ────────────────────────────────────────────────────────────

export interface ApiData {
  exercises: Exercise[];
  lists:     ExerciseList[];
}

/** Shape of every response from exercise.py */
interface ApiResponse<T = unknown> {
  status:  'success' | 'error';
  // success payloads
  data?:           T;
  message?:        string;
  drive_response?: unknown;
  metadata?:       Record<string, unknown>;
  debug_info?:     Record<string, unknown>;
  // error payload — NOTE: the backend uses "error", NOT "message"
  error?: string;
}

// ─── internal helper ─────────────────────────────────────────────────────────

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(
      `Non-JSON response (HTTP ${res.status}): ${text.slice(0, 200)}`
    );
  }
}

/** Throws a readable error using the backend's "error" field. */
function assertSuccess<T>(json: ApiResponse<T>): void {
  if (json.status !== 'success') {
    throw new Error(json.error ?? 'API returned non-success status');
  }
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Load exercises + lists from the CGI server (local file).
 * GET ?action=get
 */
export async function apiLoad(): Promise<ApiData> {
  const res  = await fetch(`${API_URL}?action=get`);
  const json = await parseJson<ApiData>(res);
  assertSuccess(json);
  if (!json.data) throw new Error('API load succeeded but returned no data');
  return json.data;
}

/**
 * Save exercises + lists to the CGI server (local file).
 * POST — body: application/x-www-form-urlencoded with `action` + `json_data`
 */
export async function apiSave(
  exercises: Exercise[],
  lists:     ExerciseList[]
): Promise<void> {
  const payload: ApiData = { exercises, lists };
  const body = new URLSearchParams({
    action:    'post',
    json_data: JSON.stringify(payload),
  });

  const res  = await fetch(API_URL, {          // no ?action= in the URL
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await parseJson(res);
  assertSuccess(json);
}

/**
 * Load exercises + lists from Drive (server-side file path).
 * GET ?action=drive_load[&filename=...]
 */
export async function apiDriveLoad(
  filename = 'exercises_data.json'
): Promise<ApiData> {
  const url  = `${API_URL}?action=drive_load&filename=${encodeURIComponent(filename)}`;
  const res  = await fetch(url);
  const json = await parseJson<ApiData>(res);
  assertSuccess(json);
  if (!json.data) throw new Error('drive_load succeeded but returned no data');
  return json.data;
}

/**
 * Save exercises + lists to Drive.
 * POST — body: application/x-www-form-urlencoded with `action` + `json_data` + `filename`
 */
export async function apiDriveSave(
  exercises: Exercise[],
  lists:     ExerciseList[],
  filename = 'exercises_data.json'
): Promise<void> {
  const payload: ApiData = { exercises, lists };
  const body = new URLSearchParams({
    action:    'drive_save',
    json_data: JSON.stringify(payload),
    filename,
  });

  const res  = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await parseJson(res);
  assertSuccess(json);
}

/**
 * Sync Drive → local file on the server.
 * GET ?action=sync_from_drive
 */
export async function apiSyncFromDrive(): Promise<ApiData> {
  const res  = await fetch(`${API_URL}?action=sync_from_drive`);
  const json = await parseJson<ApiData>(res);
  assertSuccess(json);
  if (!json.data) throw new Error('sync_from_drive succeeded but returned no data');
  return json.data;
}

/**
 * Sync local file → Drive on the server.
 * GET ?action=sync_to_drive
 */
export async function apiSyncToDrive(): Promise<void> {
  const res  = await fetch(`${API_URL}?action=sync_to_drive`);
  const json = await parseJson(res);
  assertSuccess(json);
}

/**
 * Fetch server-side debug info (paths, file sizes, Python version, etc.).
 * GET ?action=debug
 */
export async function apiDebug(): Promise<Record<string, unknown>> {
  const res  = await fetch(`${API_URL}?action=debug`);
  const json = await parseJson<Record<string, unknown>>(res);
  assertSuccess(json);
  return json.debug_info ?? {};
}

