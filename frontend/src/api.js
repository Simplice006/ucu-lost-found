// One place that talks to the backend. Every page uses these helpers.
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const TOKEN_KEY = 'ucu_lf_token';

// Browser storage can throw (private mode, blocked cookies), so every access is guarded.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore: the user simply stays logged in for this page view only */
  }
}

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network failure or the free server is waking up.
    throw new ApiError(
      'Cannot reach the server. Check your internet connection. If it is working, the server may be starting up: wait a minute and try again.',
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* response without a JSON body */
  }

  if (!response.ok) {
    throw new ApiError(
      (data && data.error) || 'Something went wrong. Please try again.',
      response.status,
      data && data.fields
    );
  }
  return data;
}
