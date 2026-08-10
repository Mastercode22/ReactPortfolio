export const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? '/api'
  : '/backend/api';
export const API_BASE_URL = API_BASE;

export async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'API error');
    return data.data;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err);
    throw err;
  }
}

export async function adminFetch(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  return apiFetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}
