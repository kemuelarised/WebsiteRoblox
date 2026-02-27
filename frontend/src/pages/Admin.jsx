import React, { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import { api } from "../lib/api.js";

function parseTags(s) {
  return (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function useAdminSession() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("adminJwt") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem("adminJwt", token);
      } else {
        localStorage.removeItem("adminJwt");
      }
    } catch {
      // ignore
    }
  }, [token]);

  return [token, setToken];
}

export default function AdminPage() {
  const [token, setToken] = useAdminSession();
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    priceFrom: "",
    deliveryDays: "7",
    thumbnailUrl: "",
    tags: ""
  });

  const payload = useMemo(() => {
    const price = form.priceFrom.trim() === "" ? null : Number(form.priceFrom);
    const days = form.deliveryDays.trim() === "" ? 7 : Number(form.deliveryDays);
    return {
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      priceFrom: price,
      deliveryDays: days,
      thumbnailUrl: form.thumbnailUrl.trim() === "" ? null : form.thumbnailUrl.trim(),
      galleryUrls: [],
      tags: parseTags(form.tags),
      isActive: true
    };
  }, [form]);

  async function createGig() {
    setStatus("");
    setCreating(true);
    try {
      await api.createGig(payload);
      setStatus("Created! Go to Browse to see it.");
      setForm({
        title: "",
        shortDescription: "",
        description: "",
        priceFrom: "",
        deliveryDays: "7",
        thumbnailUrl: "",
        tags: ""
      });
    } catch (e) {
      setStatus(e.message || "Failed to create gig");
    } finally {
      setCreating(false);
    }
  }

  async function login() {
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await api.login({
        username: loginForm.username,
        password: loginForm.password
      });
      if (!res?.token) {
        throw new Error("Missing token");
      }
      setToken(res.token);
      setLoginForm({ username: "", password: "" });
    } catch (e) {
      setLoginError(e.message || "Login failed");
      setToken("");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    setToken("");
  }

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white">Admin</div>
              <div className="mt-1 text-sm text-slate-400">
                Sign in with your admin credentials to manage gigs and view inquiries.
              </div>
            </div>
            {token ? (
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            ) : null}
          </div>

          {!token ? (
            <div className="mt-6 grid gap-4">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-200">Username</div>
                <input
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="admin"
                />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-200">Password</div>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="Your admin password"
                />
              </div>
              <Button className="w-full" onClick={login} disabled={loggingIn}>
                {loggingIn ? "Signing in…" : "Sign in"}
              </Button>
              {loginError ? <div className="text-sm text-rose-200">{loginError}</div> : null}
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-200">Title</div>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                placeholder="e.g. Modern City Map Build"
              />
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-200">Short description</div>
              <input
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                placeholder="One line summary like Fiverr cards"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-200">Starting price (USD)</div>
                <input
                  value={form.priceFrom}
                  onChange={(e) => setForm((p) => ({ ...p, priceFrom: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-200">Delivery days</div>
                <input
                  value={form.deliveryDays}
                  onChange={(e) => setForm((p) => ({ ...p, deliveryDays: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="e.g. 7"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-200">Thumbnail URL (optional)</div>
              <input
                value={form.thumbnailUrl}
                onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                placeholder="https://..."
              />
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-200">Tags (comma separated)</div>
              <input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                placeholder="city, map, modern"
              />
            </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-200">Full description</div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="min-h-[220px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                  placeholder="Write details, deliverables, what’s included, what you need from the buyer, etc."
                />
              </div>

              <Button className="w-full" onClick={createGig} disabled={creating}>
                {creating ? "Creating…" : "Create gig"}
              </Button>

              {status ? <div className="text-sm text-slate-300">{status}</div> : null}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <div className="text-sm font-semibold text-white">Do you need PHP?</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-300">
              No — MySQL works with Node (this API) just like it works with PHP.
              <div className="mt-3 text-slate-400">
                Choose PHP only if your hosting is “PHP-only” (typical cPanel shared hosting). If you use a VPS or a host
                that supports Node apps, this Express backend is perfect.
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold text-white">Inbox</div>
            <div className="mt-2 text-sm text-slate-400">
              Go to the Admin Inbox page to see and mark inquiries as read.
            </div>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => {
                window.location.href = "/admin/inbox";
              }}
            >
              Open inbox
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

