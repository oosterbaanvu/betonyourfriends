/**
 * AI-flavored AskUs prompt seeder.
 *
 * For now this is a heuristic that picks a challenge pack from the
 * existing curated set based on the event title and vibe, then draws
 * N prompts. When we wire a real LLM (Claude/OpenAI) this function
 * becomes the only thing that changes: same signature, real generation.
 */

import { CHALLENGE_PACKS } from "./challengePacks";
import { Friend, MockProp, mockFriends } from "./mockData";

const KEYWORDS: { match: RegExp; packId: string }[] = [
  { match: /\bdart/i, packId: "cp_darts" },
  { match: /wedding/i, packId: "cp_wedding" },
  { match: /office|holiday|work|christmas party/i, packId: "cp_office" },
  { match: /watch|lakers|celtics|game|nba|nfl|premier league|football|f1/i, packId: "cp_sports" },
  { match: /birthday|bash/i, packId: "cp_birthday" },
  { match: /crypto|trader|bro|portfolio/i, packId: "cp_crypto" },
  { match: /karaoke|club|after dark|nightclub/i, packId: "cp_afterdark" },
  { match: /bar|crawl|pub|drinks|friday night|saturday night/i, packId: "cp_bar" },
];

export function pickPackForEvent(title: string, vibe?: string): string {
  if (vibe) {
    const direct = CHALLENGE_PACKS.find((p) => p.vibe === vibe);
    if (direct) return direct.id;
  }
  for (const k of KEYWORDS) {
    if (k.match.test(title)) return k.packId;
  }
  return "cp_bar";
}

/**
 * Generate N AskUs prompts for an event. Subject candidates default to
 * all event members. Expiry defaults to the event's nominal duration.
 */
export function generateAskUsForEvent(args: {
  eventId: string;
  title: string;
  vibe?: string;
  memberIds: string[];
  count?: number;
  durationMs?: number;
}): MockProp[] {
  const {
    eventId,
    title,
    vibe,
    memberIds,
    count = 4,
    durationMs = 4 * 60 * 60 * 1000,
  } = args;

  const packId = pickPackForEvent(title, vibe);
  const pack = CHALLENGE_PACKS.find((p) => p.id === packId);
  if (!pack) return [];

  const pool = pack.prompts.slice();
  const out: MockProp[] = [];
  const max = Math.min(count, pool.length);
  const now = Date.now();
  const expiresAt = now + durationMs;

  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const prompt = pool.splice(idx, 1)[0];
    out.push({
      id: `prp_ai_${now.toString(36)}_${i}`,
      eventId,
      description: prompt,
      kind: "WMLT",
      subjectUserIds: [],
      status: "OPEN",
      yesPool: 0,
      noPool: 0,
      votes: { yes: 0, no: 0 },
      voterCount: memberIds.length,
      candidateUserIds: memberIds,
      wmltVotes: {},
      createdAt: now,
      expiresAt,
      fromHouse: true,
    });
  }
  return out;
}

/** Resolve the candidate friend display name for a userId. */
export function friendOf(userId: string, members?: Friend[]): Friend | undefined {
  const pool = members ?? mockFriends;
  return pool.find((f) => f.id === userId);
}
