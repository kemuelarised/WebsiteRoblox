export function formatUsd(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(Number(amount));
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

