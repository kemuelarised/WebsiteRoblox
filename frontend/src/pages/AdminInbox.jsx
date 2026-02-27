import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import { api } from "../lib/api.js";

export default function AdminInboxPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await api.listInquiries();
      setInquiries(data || []);
      if (data && data.length && !selected) {
        setSelected(data[0]);
      }
    } catch (e) {
      setError(e.message || "Failed to load inquiries");
      if (e.status === 401 || e.status === 403) {
        try {
          localStorage.removeItem("adminJwt");
        } catch {
          // ignore
        }
        window.location.href = "/admin";
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(id) {
    try {
      await api.updateInquiryStatus(id, "read");
      await load();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message || "Failed to update status");
    }
  }

  return (
    <Container className="py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-white">Admin Inbox</div>
          <div className="mt-1 text-sm text-slate-400">View and manage inquiries sent from gig pages.</div>
        </div>
        <Button variant="secondary" onClick={() => (window.location.href = "/admin")}>
          Back to admin
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading…</div>
      ) : error ? (
        <div className="card p-6 text-sm text-rose-200">{error}</div>
      ) : !inquiries.length ? (
        <div className="card p-6 text-sm text-slate-300">No inquiries yet.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="card max-h-[520px] overflow-auto p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Inquiries</div>
            <div className="space-y-2">
              {inquiries.map((inq) => (
                <button
                  key={inq.id}
                  type="button"
                  onClick={() => setSelected(inq)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selected?.id === inq.id
                      ? "border-brand-400 bg-brand-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 truncate font-semibold text-white">
                      {inq.name || "Unknown sender"}
                    </div>
                    <Badge className={inq.status === "new" ? "bg-brand-500/20 text-brand-200" : ""}>
                      {inq.status}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-400">
                    {inq.contact} • gig #{inq.gigId}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-slate-300">{inq.message}</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ""}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            {selected ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{selected.name}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Contact: <span className="text-slate-200">{selected.contact || "—"}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Gig ID: <span className="text-slate-300">{selected.gigId}</span>
                    </div>
                  </div>
                  <Badge className={selected.status === "new" ? "bg-brand-500/20 text-brand-200" : ""}>
                    {selected.status}
                  </Badge>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}
                </div>
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {selected.message}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {selected.status !== "read" ? (
                    <Button onClick={() => markRead(selected.id)}>Mark as read</Button>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-300">Select an inquiry from the list.</div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

