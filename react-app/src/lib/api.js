const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

let cachedUtm = null;

function getUtmParams() {
  if (cachedUtm) return cachedUtm;
  const params = new URLSearchParams(window.location.search);
  cachedUtm = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) cachedUtm[key] = val;
  }
  return cachedUtm;
}

function getTrackingMeta() {
  return {
    pagePath: window.location.pathname,
    ...getUtmParams(),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
}

async function post(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ...getTrackingMeta() }),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export function postLead(data) {
  return post('/lead', data);
}

export function postSubscribe(data) {
  return post('/subscribe', data);
}
