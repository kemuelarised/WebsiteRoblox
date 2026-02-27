import React from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import { formatUsd } from "../lib/format.js";

export default function GigCard({ gig }) {
  const img =
    gig.thumbnailUrl ||
    "https://images.unsplash.com/photo-1527600478564-488952effedb?auto=format&fit=crop&w=1200&q=80";

  return (
    <Link to={`/g/${gig.slug}`} className="group block">
      <div className="card overflow-hidden transition group-hover:-translate-y-0.5 group-hover:border-white/20">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={img}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(gig.tags || []).slice(0, 3).map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <div className="rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-200 backdrop-blur">
              From <span className="font-semibold text-white">{formatUsd(gig.priceFrom)}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="line-clamp-2 text-base font-semibold text-white">{gig.title}</div>
          <div className="mt-2 line-clamp-2 text-sm text-slate-300">{gig.shortDescription}</div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
            <div>{gig.deliveryDays} days delivery</div>
            <div className="text-brand-300 group-hover:text-brand-200">View →</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

