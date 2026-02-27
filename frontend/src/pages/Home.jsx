import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import GigCard from "../components/GigCard.jsx";
import { api } from "../lib/api.js";

export default function HomePage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.listGigs();
        if (mounted) setGigs(data || []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load gigs");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = useMemo(() => (gigs || []).slice(0, 6), [gigs]);

  return (
    <div>
      <div className="relative overflow-hidden">
        <Container className="py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <Sparkles size={14} className="text-brand-300" /> Fiverr-like storefront for Roblox builds
              </div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                Sell your Roblox build gigs with a clean, modern website.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Showcase projects, set starting prices, and capture buyer inquiries — all stored in MySQL. Perfect for
                maps, terrain, interiors, and full environments.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button as={Link} to="/gigs">
                  Browse gigs <ArrowRight size={16} />
                </Button>
                <Button as={Link} to="/admin" variant="secondary">
                  Add / edit gigs
                </Button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="card p-4">
                  <div className="text-sm font-semibold text-white">Fast</div>
                  <div className="mt-1 text-sm text-slate-400">Vite + React UI</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm font-semibold text-white">Secure-ish</div>
                  <div className="mt-1 text-sm text-slate-400">Admin token create/edit</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm font-semibold text-white">Ready</div>
                  <div className="mt-1 text-sm text-slate-400">MySQL migrations + seed</div>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="border-b border-white/10 p-5">
                <div className="text-sm font-semibold text-white">Featured gigs</div>
                <div className="mt-1 text-sm text-slate-400">A storefront grid like Fiverr (customize anytime).</div>
              </div>
              <div className="p-5">
                {loading ? (
                  <div className="text-sm text-slate-400">Loading…</div>
                ) : error ? (
                  <div className="text-sm text-rose-200">{error}</div>
                ) : featured.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.slice(0, 4).map((g) => (
                      <GigCard key={g.id} gig={g} />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    No gigs yet. Add one in <span className="font-semibold text-white">Admin</span>.
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 p-5">
                <Button as={Link} to="/gigs" variant="secondary" className="w-full">
                  See all gigs
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

