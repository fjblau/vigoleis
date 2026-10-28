export function shippingCost(country: string, subtotal: number): number | null {
  const destination = country.trim().toLocaleLowerCase("de-DE");
  if (!["deutschland", "germany", "de", "bundesrepublik deutschland"].includes(destination)) return null;
  return Math.round(subtotal * 100) <= 5700 ? 4 : 0;
}
