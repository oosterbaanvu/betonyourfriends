/**
 * Parimutuel odds engine. Pure functions — no I/O, no React.
 *
 * Implied probability of YES = yesPool / (yesPool + noPool).
 * Payout for a winning YES bet of `stake`:
 *   stake + stake * (noPool / (yesPool + stake_for_yes_winners))
 * Simplified for the pre-bet preview: the bettor's share of the losing pool
 * is proportional to their stake within the winning pool.
 */

import { MockProp } from "./mockData";

const HOUSE_FLOOR = 1; // avoid divide-by-zero on empty pools

export function impliedYesProb(prop: MockProp): number {
  const total = Math.max(prop.yesPool + prop.noPool, HOUSE_FLOOR);
  return prop.yesPool / total;
}

export function impliedNoProb(prop: MockProp): number {
  return 1 - impliedYesProb(prop);
}

/** Polymarket-style "cents" formatting: 64¢ for a 0.64 implied prob. */
export function asCents(prob: number): string {
  return `${Math.round(prob * 100)}¢`;
}

/**
 * Estimate the gross return (stake + winnings) for a hypothetical bet,
 * assuming pools won't change before resolution. For preview UI only.
 */
export function estimatePayout(
  prop: MockProp,
  side: "YES" | "NO",
  stake: number
): number {
  if (stake <= 0) return 0;
  const yesAfter = side === "YES" ? prop.yesPool + stake : prop.yesPool;
  const noAfter = side === "NO" ? prop.noPool + stake : prop.noPool;
  const winningPool = side === "YES" ? yesAfter : noAfter;
  const losingPool = side === "YES" ? noAfter : yesAfter;
  if (winningPool <= 0) return stake;
  return stake + (stake / winningPool) * losingPool;
}

/** Convenience: payout multiplier (e.g. 2.4× for "you 2.4× your stake"). */
export function payoutMultiplier(
  prop: MockProp,
  side: "YES" | "NO",
  stake = 100
): number {
  return estimatePayout(prop, side, stake) / stake;
}
