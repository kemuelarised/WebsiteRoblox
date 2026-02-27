import React from "react";
import clsx from "clsx";

export default function Badge({ children, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200",
        className
      )}
    >
      {children}
    </span>
  );
}

