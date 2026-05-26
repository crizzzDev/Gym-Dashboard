// ── API CLIENT ────────────────────────────────────────────────
// Thin wrapper around fetch for the GymPro backend.
const API_BASE = "/api";

async function _request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.detail) detail = body.detail;
    } catch (_) { /* ignore */ }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

window.api = {
  members: {
    list:   (q = "") => _request(`/members${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    create: (data)  => _request(`/members`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => _request(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id)    => _request(`/members/${id}`, { method: "DELETE" }),
  },
  programs: {
    list:   ()      => _request(`/programs`),
    create: (data)  => _request(`/programs`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => _request(`/programs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id)    => _request(`/programs/${id}`, { method: "DELETE" }),
  },
  stats: {
    get: () => _request(`/stats`),
  },
};
