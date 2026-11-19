const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
})

const gbpPrecise = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formats whole pounds, e.g. £1,250. */
export function formatGbp(value: number) {
  return gbp.format(value)
}

/** Formats pounds and pence, e.g. £1,250.75. */
export function formatGbpPrecise(value: number) {
  return gbpPrecise.format(value)
}
