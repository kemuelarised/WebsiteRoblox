const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

function getAdminToken() {
  try {
    return localStorage.getItem("adminJwt") || "";
  } catch {
    return "";
  }
}

async function request(path, { method = "GET", body, headers, auth = false } = {}) {
  const finalHeaders = {
    "content-type": "application/json",
    ...(headers || {})
  };

  if (auth) {
    const token = getAdminToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body != null ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "error" in data ? data.error : `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  listGigs: () => request("/gigs"),
  getGig: (slugOrId) => request(`/gigs/${encodeURIComponent(slugOrId)}`),
  createGig: (gig) => request("/gigs", { method: "POST", body: gig, auth: true }),
  createInquiry: (inquiry) => request("/inquiries", { method: "POST", body: inquiry }),
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  listInquiries: () => request("/admin/inquiries", { auth: true }),
  getInquiry: (id) => request(`/admin/inquiries/${id}`, { auth: true }),
  updateInquiryStatus: (id, status) =>
    request(`/admin/inquiries/${id}`, { method: "PATCH", body: { status }, auth: true })
};

