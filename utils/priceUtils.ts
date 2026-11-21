
export function parsePrice(priceText: string): number {
  const normalizedPrice = priceText
    .replace(/Rs\.\s*/i, '')
    .replace(/,/g, '')
    .trim();

  const price = Number(normalizedPrice);

  if (!Number.isFinite(price) || price < 0 || normalizedPrice === '') {
    throw new Error(`Invalid price: ${priceText}`);
  }

  return price;
}
