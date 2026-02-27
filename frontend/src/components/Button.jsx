import React from "react";
import clsx from "clsx";

export default function Button({ as: As = "button", variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-500 text-slate-950 hover:bg-brand-400 shadow-soft",
    secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/10",
    ghost: "hover:bg-white/10 text-white"
  };

  return <As className={clsx(base, variants[variant], className)} {...props} />;
}

