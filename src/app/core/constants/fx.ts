/** Fixed conversion rate: 1 USD = VND (whole đồng). */
export const USD_TO_VND_RATE = 26_000;

/**
 * VND minor units (integer đồng) → USD for storage.
 * Uses full float division (no cent rounding) so integer VND round-trips with {@link usdToVndMinor}.
 */
export function vndMinorToUsd(vndMinor: number): number {
  return vndMinor / USD_TO_VND_RATE;
}

/** USD stored value → VND minor for display (integer đồng). */
export function usdToVndMinor(usd: number): number {
  return Math.round(usd * USD_TO_VND_RATE);
}

/** Typed amount in the active UI currency → canonical USD for persistence. */
export function displayAmountToUsd(amount: number, display: 'en' | 'vi'): number {
  return display === 'vi' ? vndMinorToUsd(amount) : amount;
}
