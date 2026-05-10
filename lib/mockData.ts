/** Mock data — replaced by Supabase queries in a later phase. */

export type EventStatus = "OPEN" | "LIVE" | "RESOLVING" | "CLOSED";

export type MockEvent = {
  id: string;
  title: string;
  creator: string;
  startsAt: string;
  /**
   * Approx delta from "now" used to drive the live countdown.
   * Negative = already started.
   */
  startsInMinutes: number;
  status: EventStatus;
  /** People in the friend group invited to this event. Drives avatar stacks. */
  memberIds: string[];
  /** Sharable invite code; in real life Supabase would generate this. */
  inviteCode: string;
  accent: "lime" | "pink" | "violet" | "sun";
  /** Theme keyword used by the AI seeder to pick AskUs prompts. */
  vibe?: string;
};

export type PropStatus = "OPEN" | "AWAITING_VERDICT" | "RESOLVED";

/**
 * YESNO = parimutuel "X will happen" bet. Subjects can't see it.
 * WMLT  = "Who's most likely to..." AskUs vote. Everyone sees it; the
 *         plurality target's identity is revealed in the Mirror once the
 *         timer expires (anti-influence).
 */
export type PropKind = "YESNO" | "WMLT";

export type MockProp = {
  id: string;
  eventId: string;
  description: string;
  kind: PropKind;

  /**
   * The users this prop is ABOUT (the "subjects"). YESNO only — WMLT
   * subjects are determined by the plurality once expired.
   * House rule: a user can never see, wager on, or vote to resolve a prop
   * where they appear in subjectUserIds.
   */
  subjectUserIds: string[];
  status: PropStatus;

  /** Parimutuel pools — implied probability is yes / (yes + no). YESNO only. */
  yesPool: number;
  noPool: number;

  /** Vote tally for YESNO resolution; undefined slots mean "not yet voted". */
  votes: { yes: number; no: number };
  /** Total eligible voters for this prop (excludes subjects). YESNO only. */
  voterCount: number;
  /** Set when status === RESOLVED. YESNO only. */
  resolvedSide?: "YES" | "NO";

  /**
   * Each tagged subject's own verdict. The bet only RESOLVES once every
   * id in subjectUserIds has an entry here AND they all agree. Disagreement
   * leaves the bet AWAITING_VERDICT and opens the group-vote fallback so
   * non-subject bettors can adjudicate.
   */
  subjectVerdicts?: Record<string, "CONFESSED" | "DENIED">;

  /* ── WMLT-only fields ───────────────────────────────────── */
  /** Members eligible to be voted for. Defaults to all event members. */
  candidateUserIds?: string[];
  /** voterId -> targetId. Hidden from everyone except the voter until expiry. */
  wmltVotes?: Record<string, string>;
  /** Plurality target set after expiry. */
  wmltWinnerIds?: string[];

  /* ── Timing ─────────────────────────────────────────────── */
  /** Creation timestamp (ms). */
  createdAt: number;
  /** Lock timestamp (ms). After this, no more bets/votes — verdicts reveal. */
  expiresAt: number;
  /**
   * Whether this prompt was seeded by the AI on event creation
   * (lets the UI flag "FROM THE HOUSE" vs user-created).
   */
  fromHouse?: boolean;
};

export const CURRENT_USER_ID = "u_jules";

export type Friend = { id: string; handle: string };

/** Mock friend group used for subject tagging in the Create flow. */
export const mockFriends: Friend[] = [
  { id: "u_jules", handle: "@jules" },
  { id: "u_mark", handle: "@mark" },
  { id: "u_romi", handle: "@romi" },
  { id: "u_dave", handle: "@dave" },
  { id: "u_steve", handle: "@bigsteve" },
  { id: "u_sarah", handle: "@sarah" },
  { id: "u_priya", handle: "@priya" },
];

/* ─────────────────────────── Time helpers ─────────────────────────── */

const NOW = Date.now();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export function minutesUntil(expiresAt: number): number {
  return Math.round((expiresAt - Date.now()) / MINUTE);
}

export function isExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

/* ─────────────────────────── Events ───────────────────────────────── */

export const mockEvents: MockEvent[] = [
  {
    id: "evt_1",
    title: "Mark's Birthday",
    creator: "@jules",
    startsAt: "Tonight, 9:00 PM",
    startsInMinutes: 90,
    status: "LIVE",
    memberIds: ["u_jules", "u_mark", "u_romi", "u_dave", "u_steve", "u_sarah"],
    inviteCode: "RAGE-91X",
    accent: "pink",
    vibe: "birthday",
  },
  {
    id: "evt_2",
    title: "Friday Night Darts at The Anchor",
    creator: "@dave",
    startsAt: "Fri, 8:00 PM",
    startsInMinutes: 60 * 4,
    status: "OPEN",
    memberIds: ["u_jules", "u_dave", "u_steve", "u_priya"],
    inviteCode: "BULL-501",
    accent: "lime",
    vibe: "darts",
  },
  {
    id: "evt_3",
    title: "Lakers vs Celtics — Game 5",
    creator: "@bigsteve",
    startsAt: "Sat, 7:30 PM",
    startsInMinutes: 60 * 26,
    status: "OPEN",
    memberIds: ["u_jules", "u_steve", "u_dave", "u_romi", "u_sarah"],
    inviteCode: "TIPOFF-7",
    accent: "lime",
    vibe: "sports",
  },
  {
    id: "evt_4",
    title: "Sarah Finishes Her Thesis",
    creator: "@sarah",
    startsAt: "Sun, 11:59 PM deadline",
    startsInMinutes: 60 * 50,
    status: "OPEN",
    memberIds: ["u_jules", "u_sarah", "u_priya", "u_romi"],
    inviteCode: "PHD-CTDN",
    accent: "violet",
    vibe: "office",
  },
  {
    id: "evt_5",
    title: "Karaoke Night",
    creator: "@bigsteve",
    startsAt: "Resolving now",
    startsInMinutes: -180,
    status: "RESOLVING",
    memberIds: ["u_jules", "u_steve", "u_romi", "u_priya", "u_mark"],
    inviteCode: "MIC-DROP",
    accent: "sun",
    vibe: "bar",
  },
];

/* ─────────────────────────── Props (seed) ─────────────────────────── */

/**
 * Default fields for a YESNO prop — keeps the seed list readable.
 */
function yesno(p: Partial<MockProp> & { id: string; eventId: string; description: string }): MockProp {
  return {
    kind: "YESNO",
    subjectUserIds: [],
    status: "OPEN",
    yesPool: 50,
    noPool: 50,
    votes: { yes: 0, no: 0 },
    voterCount: 5,
    createdAt: NOW - 30 * MINUTE,
    expiresAt: NOW + 6 * HOUR,
    ...p,
  } as MockProp;
}

function wmlt(p: Partial<MockProp> & { id: string; eventId: string; description: string; candidateUserIds: string[] }): MockProp {
  return {
    kind: "WMLT",
    subjectUserIds: [],
    status: "OPEN",
    yesPool: 0,
    noPool: 0,
    votes: { yes: 0, no: 0 },
    voterCount: p.candidateUserIds.length,
    wmltVotes: {},
    createdAt: NOW - 30 * MINUTE,
    expiresAt: NOW + 4 * HOUR,
    fromHouse: true,
    ...p,
  } as MockProp;
}

export const mockProps: MockProp[] = [
  // ─── evt_1 — Mark's Birthday — LIVE ────────────────────────
  yesno({
    id: "prp_1",
    eventId: "evt_1",
    description: "Mark spills his drink before midnight",
    subjectUserIds: ["u_mark"],
    yesPool: 1280,
    noPool: 720,
    voterCount: 6,
    expiresAt: NOW + 3 * HOUR,
  }),
  yesno({
    id: "prp_2",
    eventId: "evt_1",
    description: "Jules tells the Croatia story (again)",
    subjectUserIds: ["u_jules"],
    yesPool: 940,
    noPool: 410,
    voterCount: 6,
    expiresAt: NOW + 3 * HOUR,
  }),
  yesno({
    id: "prp_3",
    eventId: "evt_1",
    description: "Romi falls asleep on the couch before 1 AM",
    subjectUserIds: ["u_romi"],
    yesPool: 320,
    noPool: 580,
    voterCount: 6,
    expiresAt: NOW + 3 * HOUR,
  }),
  yesno({
    id: "prp_4",
    eventId: "evt_1",
    description: "There's a tactical chunder before midnight",
    yesPool: 460,
    noPool: 540,
    votes: { yes: 2, no: 1 },
    voterCount: 7,
    status: "AWAITING_VERDICT",
    expiresAt: NOW - 5 * MINUTE,
  }),
  yesno({
    id: "prp_5",
    eventId: "evt_1",
    description: "Sarah brings the cake she promised",
    subjectUserIds: ["u_sarah"],
    yesPool: 880,
    noPool: 120,
    voterCount: 6,
    expiresAt: NOW + 2 * HOUR,
  }),
  // ── House WMLT for Mark's Birthday ───
  wmlt({
    id: "prp_w1",
    eventId: "evt_1",
    description: "Who's most likely to embarrass the birthday boy?",
    candidateUserIds: ["u_jules", "u_mark", "u_romi", "u_dave", "u_steve", "u_sarah"],
    expiresAt: NOW + 90 * MINUTE,
  }),
  wmlt({
    id: "prp_w2",
    eventId: "evt_1",
    description: "Who's most likely to start a 'speech, speech' chant?",
    candidateUserIds: ["u_jules", "u_mark", "u_romi", "u_dave", "u_steve", "u_sarah"],
    expiresAt: NOW + 90 * MINUTE,
  }),

  // ─── evt_2 — Friday Night Darts ────────────────────────────
  yesno({
    id: "prp_10",
    eventId: "evt_2",
    description: "Dave hits a 180 at least once",
    subjectUserIds: ["u_dave"],
    yesPool: 480,
    noPool: 220,
    voterCount: 4,
    expiresAt: NOW + 6 * HOUR,
  }),
  yesno({
    id: "prp_11",
    eventId: "evt_2",
    description: "Steve overshoots his finish at least 3 times",
    subjectUserIds: ["u_steve"],
    yesPool: 320,
    noPool: 180,
    voterCount: 4,
    expiresAt: NOW + 6 * HOUR,
  }),
  // ── House WMLT for darts ───
  wmlt({
    id: "prp_w10",
    eventId: "evt_2",
    description: "Who's most likely to argue about the scoring math?",
    candidateUserIds: ["u_jules", "u_dave", "u_steve", "u_priya"],
    expiresAt: NOW + 5 * HOUR,
  }),
  wmlt({
    id: "prp_w11",
    eventId: "evt_2",
    description: "Who's most likely to throw with the wrong hand for a laugh?",
    candidateUserIds: ["u_jules", "u_dave", "u_steve", "u_priya"],
    expiresAt: NOW + 5 * HOUR,
  }),

  // ─── evt_3 — Lakers vs Celtics ─────────────────────────────
  yesno({
    id: "prp_15",
    eventId: "evt_3",
    description: "Lakers cover the spread",
    yesPool: 720,
    noPool: 480,
    voterCount: 5,
    expiresAt: NOW + 25 * HOUR,
  }),
  wmlt({
    id: "prp_w15",
    eventId: "evt_3",
    description: "Who's most likely to yell at the TV like it can hear them?",
    candidateUserIds: ["u_jules", "u_steve", "u_dave", "u_romi", "u_sarah"],
    expiresAt: NOW + 25 * HOUR,
  }),

  // ─── evt_4 — Sarah's thesis ────────────────────────────────
  yesno({
    id: "prp_18",
    eventId: "evt_4",
    description: "Sarah submits before midnight Sunday",
    subjectUserIds: ["u_sarah"],
    yesPool: 220,
    noPool: 580,
    voterCount: 4,
    expiresAt: NOW + 50 * HOUR,
  }),

  // ─── evt_5 — Karaoke (already past) ────────────────────────
  yesno({
    id: "prp_20",
    eventId: "evt_5",
    description: "Steve attempts Bohemian Rhapsody",
    subjectUserIds: ["u_steve"],
    yesPool: 1240,
    noPool: 360,
    votes: { yes: 4, no: 1 },
    voterCount: 5,
    status: "AWAITING_VERDICT",
    expiresAt: NOW - 10 * MINUTE,
  }),
  yesno({
    id: "prp_22",
    eventId: "evt_5",
    description: "Jules picks a song from before 1990",
    subjectUserIds: ["u_jules"],
    yesPool: 540,
    noPool: 280,
    votes: { yes: 2, no: 1 },
    voterCount: 4,
    status: "AWAITING_VERDICT",
    expiresAt: NOW - 10 * MINUTE,
  }),
  // ── Multi-subject demo: both subjects still owe a verdict ───
  yesno({
    id: "prp_24",
    eventId: "evt_5",
    description: "Jules beats Steve in their karaoke point count",
    subjectUserIds: ["u_jules", "u_steve"],
    yesPool: 720,
    noPool: 480,
    voterCount: 3,
    status: "AWAITING_VERDICT",
    expiresAt: NOW - 2 * MINUTE,
  }),
  // ── Multi-subject demo: co-subject already weighed in ───
  yesno({
    id: "prp_25",
    eventId: "evt_5",
    description: "Mark made it through 'Bohemian Rhapsody' without skipping a verse",
    subjectUserIds: ["u_jules", "u_mark"],
    subjectVerdicts: { u_mark: "DENIED" },
    yesPool: 320,
    noPool: 480,
    voterCount: 3,
    status: "AWAITING_VERDICT",
    expiresAt: NOW - 5 * MINUTE,
  }),
  // ── Expired WMLT to demo Mirror reveal ───
  // Jules wins this one — the Mirror will reveal who voted for him.
  {
    id: "prp_w20",
    eventId: "evt_5",
    kind: "WMLT",
    description: "Who's most likely to pick a song from before 1990?",
    subjectUserIds: [],
    status: "RESOLVED",
    yesPool: 0,
    noPool: 0,
    votes: { yes: 0, no: 0 },
    voterCount: 5,
    candidateUserIds: ["u_jules", "u_steve", "u_romi", "u_priya", "u_mark"],
    wmltVotes: {
      u_steve: "u_jules",
      u_romi: "u_jules",
      u_priya: "u_steve",
      u_mark: "u_jules",
      u_jules: "u_steve",
    },
    wmltWinnerIds: ["u_jules"],
    createdAt: NOW - 3 * HOUR,
    expiresAt: NOW - 30 * MINUTE,
    fromHouse: true,
  },
];

/* ───────────────────── Subject verdict helpers ───────────────────── */

export type SubjectAgreement = "CONFESSED" | "DENIED" | "MIXED" | "INCOMPLETE";

/** True if every tagged subject has cast a verdict. False for no-subject props. */
export function allSubjectsVoted(prop: MockProp): boolean {
  if (prop.kind !== "YESNO") return false;
  if (prop.subjectUserIds.length === 0) return false;
  const vs = prop.subjectVerdicts ?? {};
  return prop.subjectUserIds.every((id) => !!vs[id]);
}

/**
 * Where this prop stands on subject agreement:
 *  - INCOMPLETE: at least one subject hasn't cast a verdict yet
 *  - CONFESSED:  everyone confessed (resolves YES)
 *  - DENIED:     everyone denied (resolves NO)
 *  - MIXED:      everyone weighed in but they disagree — group fallback opens
 */
export function subjectAgreement(prop: MockProp): SubjectAgreement {
  if (!allSubjectsVoted(prop)) return "INCOMPLETE";
  const vs = prop.subjectVerdicts!;
  const list = prop.subjectUserIds.map((id) => vs[id]);
  if (list.every((v) => v === "CONFESSED")) return "CONFESSED";
  if (list.every((v) => v === "DENIED")) return "DENIED";
  return "MIXED";
}

/** Group vote is open when subjects deadlock OR when there are no subjects at all. */
export function groupVoteOpen(prop: MockProp): boolean {
  if (prop.status !== "AWAITING_VERDICT") return false;
  if (prop.subjectUserIds.length === 0) return true;
  return subjectAgreement(prop) === "MIXED";
}

/**
 * Filter a list of props to those a viewer is allowed to see/wager on.
 * Anti-self-bet rule: hides YESNO props where the viewer is a subject.
 * WMLT props are visible to everyone while OPEN (the AskUs game is the point);
 * after expiry they remain in the feed as RESOLVED, with the plurality named.
 */
export function visiblePropsFor(viewerId: string, props: MockProp[]): MockProp[] {
  return props.filter((p) => {
    if (p.kind === "WMLT") return true;
    return !p.subjectUserIds.includes(viewerId);
  });
}

/**
 * True if the viewer is forbidden from interacting with this prop because
 * the prop is about them. Only meaningful for YESNO.
 */
export function isPropAboutViewer(viewerId: string, prop: MockProp): boolean {
  if (prop.kind === "WMLT") return false;
  return prop.subjectUserIds.includes(viewerId);
}

/** Sum of all YESNO pools across an event's props — the live pot. */
export function eventPot(eventId: string, props: MockProp[]): number {
  return props
    .filter((p) => p.eventId === eventId && p.kind === "YESNO")
    .reduce((acc, p) => acc + p.yesPool + p.noPool, 0);
}

/**
 * Mirror state for a viewer. Critical anti-influence rule: only EXPIRED
 * props ever appear here. While anything is still open the viewer learns
 * nothing about it.
 *
 * YESNO props about the viewer split into three buckets:
 *   pending  — viewer hasn't cast their own verdict yet (action needed)
 *   waiting  — viewer voted, still waiting on co-subjects (informational)
 *   judged   — everyone's weighed in; result on the Wall of Shame
 *              (includes both clean resolutions and MIXED deadlocks)
 *
 * Plus WMLT props the viewer was the plurality target of (the AskUs reveal).
 */
export function mirrorStateFor(viewerId: string, props: MockProp[]) {
  const now = Date.now();
  const yesnoSubject = props.filter(
    (p) =>
      p.kind === "YESNO" &&
      p.subjectUserIds.includes(viewerId) &&
      p.expiresAt <= now
  );
  const wmltSubject = props.filter(
    (p) =>
      p.kind === "WMLT" &&
      p.expiresAt <= now &&
      (p.wmltWinnerIds ?? []).includes(viewerId)
  );

  const myVerdict = (p: MockProp) => p.subjectVerdicts?.[viewerId];

  const pending = yesnoSubject.filter(
    (p) => !myVerdict(p) && p.status !== "RESOLVED"
  );
  const waiting = yesnoSubject.filter(
    (p) => !!myVerdict(p) && !allSubjectsVoted(p)
  );
  const judged = yesnoSubject.filter(
    (p) =>
      !!myVerdict(p) &&
      (allSubjectsVoted(p) || p.status === "RESOLVED")
  );

  const secret = props.filter(
    (p) =>
      p.kind === "YESNO" &&
      p.subjectUserIds.includes(viewerId) &&
      p.expiresAt > now
  );

  return {
    secretCount: secret.length,
    pendingCount: pending.length + wmltSubject.length,
    pending,
    waiting,
    wmltReveals: wmltSubject,
    judged,
    judgedCount: judged.length,
  };
}
