import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Container from "../components/Container.jsx";
import GigCard from "../components/GigCard.jsx";
import { api } from "../lib/api.js";

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
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

  const allTags = useMemo(() => {
    const set = new Set();
    (gigs || []).forEach((g) => {
      (g.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [gigs]);

  const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  const minP = minPrice.trim() === "" ? null : Number(minPrice);
  const maxP = maxPrice.trim() === "" ? null : Number(maxPrice);
  const maxD = maxDays.trim() === "" ? null : Number(maxDays);
  const tagSet = new Set(selectedTags);

  let items = gigs || [];

  items = items.filter((g) => {
    const hay = `${g.title || ""} ${g.shortDescription || ""} ${(g.tags || []).join(" ")}`.toLowerCase();
    if (q && !hay.includes(q)) return false;

    const price = g.priceFrom != null ? Number(g.priceFrom) : null;
    if (minP != null && (price == null || price < minP)) return false;
    if (maxP != null && (price == null || price > maxP)) return false;

    const days = g.deliveryDays != null ? Number(g.deliveryDays) : null;
    if (maxD != null && days != null && days > maxD) return false;

    if (tagSet.size) {
      const tags = new Set(g.tags || []);
      for (const t of tagSet) {
        if (!tags.has(t)) return false;
      }
    }

    return true;
  });

  const sorter =
    {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      "price-asc": (a, b) => (a.priceFrom || 0) - (b.priceFrom || 0),
      "price-desc": (a, b) => (b.priceFrom || 0) - (a.priceFrom || 0),
      fastest: (a, b) => (a.deliveryDays || 9999) - (b.deliveryDays || 9999),
    }[sortBy] || null;

  return sorter ? [...items].sort(sorter) : items;
}, [gigs, query, minPrice, maxPrice, maxDays, selectedTags, sortBy]);

  function toggleTag(tag) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function clearFilters() {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setMaxDays("");
    setSelectedTags([]);
    setSortBy("newest");
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-white">Browse gigs</div>
          <div className="mt-1 text-sm text-slate-400">
            Filter by price, delivery time, and style — all client-side like Fiverr.
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="relative flex-1 md:w-[320px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: city, castle, interior…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-brand-400"
            />
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-white/20"
          >
            <SlidersHorizontal size={14} /> Clear filters
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_2fr]">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filters</div>
          </div>
          <div className="space-y-4 text-sm text-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Min price
                </div>
                <input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-brand-400"
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Max price
                </div>
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-brand-400"
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Max delivery days
              </div>
              <input
                value={maxDays}
                onChange={(e) => setMaxDays(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-brand-400"
                placeholder="e.g. 7"
              />
            </div>
            {allTags.length ? (
              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          active
                            ? "border-brand-400 bg-brand-500/20 text-brand-100"
                            : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Sort by</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-brand-400"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low → high</option>
                <option value="price-desc">Price: high → low</option>
                <option value="fastest">Fastest delivery</option>
              </select>
            </div>
          </div>
        </div>

                <div className="mt-2 md:mt-0">
          {loading ? (
            <div className="text-sm text-slate-400">Loading…</div>
          ) : error ? (
            <div className="text-sm text-rose-200">{error}</div>
          ) : filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <GigCard key={g.id} gig={g} />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-sm text-slate-300">No gigs match that search.</div>
          )}
        </div>
      </div>
    </Container>
);
}

