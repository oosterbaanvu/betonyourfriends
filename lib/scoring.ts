/**
 * Pure scoring logic for Party Rounds (Who's Most Likely To).
 *
 * Lives outside of any React state on purpose — when the Supabase backend
 * lands this entire file ports straight into a Postgres function. No DOM,
 * no React, no async.
 */

export type Stamp =
  | "PROPHET"
  | "SELF_AWARE"
  | "DELUSIONAL"
  | "CLOSE_READ"
  | "AFK"
  | "GROUPTHINK";

export type RoundVote = {
  voterId: string;
  /** null when the voter timed out without locking in. */
  targetId: string | null;
};

export type RoundAward = {
  voterId: string;
  points: number;
  stamp: Stamp;
  /** True if the voter's pick is part of the plurality target set. */
  matchedPlurality: boolean;
  /** True if the voter targeted themselves and was right. */
  selfPlurality: boolean;
};

export type RoundResult = {
  /** Vote counts keyed by target user id. */
  tally: Record<string, number>;
  /** All users tied for the most votes. */
  pluralityTargetIds: string[];
  /** Plurality vote count. 0 if nobody voted. */
  pluralityCount: number;
  /** True if literally everyone picked the same target. */
  groupthink: boolean;
  awards: RoundAward[];
};

const POINTS = {
  prophet: 100,
  selfAware: 150,
  closeRead: 50, // only used in some tie configurations
  groupthinkBonus: 50,
  afkPenalty: -25,
} as const;

/**
 * Compute the round result given the locked votes for one prompt.
 * Streak multipliers and rank tier are applied by the caller — this
 * function only knows about a single round.
 */
export function scoreRound(votes: RoundVote[]): RoundResult {
  const tally: Record<string, number> = {};
  for (const v of votes) {
    if (!v.targetId) continue;
    tally[v.targetId] = (tally[v.targetId] ?? 0) + 1;
  }

  let pluralityCount = 0;
  for (const id of Object.keys(tally)) {
    if (tally[id] > pluralityCount) pluralityCount = tally[id];
  }

  const pluralityTargetIds =
    pluralityCount === 0
      ? []
      : Object.keys(tally).filter((id) => tally[id] === pluralityCount);

  const lockedVotes = votes.filter((v) => v.targetId !== null);
  const groupthink =
    lockedVotes.length > 1 &&
    pluralityTargetIds.length === 1 &&
    pluralityCount === lockedVotes.length;

  const awards: RoundAward[] = votes.map((v) => {
    if (!v.targetId) {
      return {
        voterId: v.voterId,
        points: POINTS.afkPenalty,
        stamp: "AFK",
        matchedPlurality: false,
        selfPlurality: false,
      };
    }
    const matched = pluralityTargetIds.includes(v.targetId);
    const isSelfVote = v.voterId === v.targetId;

    if (matched && isSelfVote) {
      return {
        voterId: v.voterId,
        points: POINTS.selfAware + (groupthink ? POINTS.groupthinkBonus : 0),
        stamp: "SELF_AWARE",
        matchedPlurality: true,
        selfPlurality: true,
      };
    }
    if (matched) {
      return {
        voterId: v.voterId,
        points:
          POINTS.prophet +
          (groupthink ? POINTS.groupthinkBonus : 0) +
          (pluralityTargetIds.length > 1 ? -POINTS.prophet + POINTS.closeRead : 0),
        stamp: pluralityTargetIds.length > 1 ? "CLOSE_READ" : groupthink ? "GROUPTHINK" : "PROPHET",
        matchedPlurality: true,
        selfPlurality: false,
      };
    }
    if (isSelfVote) {
      return {
        voterId: v.voterId,
        points: 0,
        stamp: "DELUSIONAL",
        matchedPlurality: false,
        selfPlurality: false,
      };
    }
    return {
      voterId: v.voterId,
      points: 0,
      stamp: "DELUSIONAL",
      matchedPlurality: false,
      selfPlurality: false,
    };
  });

  return {
    tally,
    pluralityTargetIds,
    pluralityCount,
    groupthink,
    awards,
  };
}

/** Streak multiplier — kicks in at 3, doubles at 5. */
export function streakMultiplier(streak: number): number {
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

/** Persistent rank tier from total prophet hits across all sessions. */
export type Tier = "ROOKIE" | "READER" | "ORACLE" | "PROPHET" | "GOAT";

export function tierFor(prophetHits: number): Tier {
  if (prophetHits >= 60) return "GOAT";
  if (prophetHits >= 30) return "PROPHET";
  if (prophetHits >= 15) return "ORACLE";
  if (prophetHits >= 5) return "READER";
  return "ROOKIE";
}

export const TIER_THRESHOLDS: Record<Tier, number> = {
  ROOKIE: 0,
  READER: 5,
  ORACLE: 15,
  PROPHET: 30,
  GOAT: 60,
};
