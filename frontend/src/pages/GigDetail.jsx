import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock3, ArrowLeft } from "lucide-react";
import Container from "../components/Container.jsx";
import Badge from "../components/Badge.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { formatUsd } from "../lib/format.js";

export default function GigDetailPage() {
  const { slug } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getGig(slug);
        if (mounted) setGig(data);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load gig");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const heroImg = useMemo(() => {
    return (
      gig?.thumbnailUrl ||
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1400&q=80"
    );
  }, [gig]);

  async function submitInquiry(e) {
    e?.preventDefault();
    if (!gig) return;
    setFormError("");
    setSending(true);
    setSent(false);
    try {
      await api.createInquiry({
        gigId: gig.id,
        name: form.name,
        contact: form.contact,
        message: form.message
      });
      setSent(true);
      setForm({ name: "", contact: "", message: "" });
    } catch (e) {
      setFormError(e.message || "Failed to send inquiry");
    } finally {
      setSending(false);
    }
  }

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link to="/gigs" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={16} /> Back to gigs
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading…</div>
      ) : error ? (
        <div className="card p-6 text-sm text-rose-200">{error}</div>
      ) : !gig ? (
        <div className="card p-6 text-sm text-slate-300">Not found.</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={heroImg} alt={gig.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {(gig.tags || []).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-extrabold tracking-tight text-white">{gig.title}</div>
                <div className="mt-2 text-slate-300">{gig.shortDescription}</div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={16} className="text-brand-300" /> {gig.deliveryDays} days delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="text-sm font-semibold text-white">About this gig</div>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{gig.description}</div>
              {gig.galleryUrls && gig.galleryUrls.length ? (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Gallery</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {gig.galleryUrls.map((url) => (
                      <div key={url} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img src={url} alt="" className="h-28 w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-baseline justify-between gap-4">
                <div className="text-sm text-slate-300">Starting at</div>
                <div className="text-2xl font-extrabold text-white">{formatUsd(gig.priceFrom)}</div>
              </div>
              <div className="mt-3 text-sm text-slate-400">
                Final price depends on scope. Message details and references to get an accurate quote.
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="font-semibold text-white">Send an inquiry</div>
                <form className="mt-3 space-y-3" onSubmit={submitInquiry}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 text-xs font-semibold text-slate-200">Your name</div>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                        placeholder="BuilderFan123"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-semibold text-slate-200">Contact (email or Discord)</div>
                      <input
                        value={form.contact}
                        onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                        placeholder="you@email.com or name#0000"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-200">Message</div>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className="min-h-[140px] w-full resize-y rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                      placeholder="Tell me what you want built, the style, size, deadline, and any references."
                    />
                  </div>
                  {formError ? <div className="text-xs text-rose-200">{formError}</div> : null}
                  {sent ? <div className="text-xs text-brand-200">Inquiry sent! I will contact you soon.</div> : null}
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" className="flex-1" disabled={sending}>
                      {sending ? "Sending…" : "Send inquiry"}
                    </Button>
                    <Button as={Link} to="/gigs" variant="secondary">
                      Keep browsing
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

