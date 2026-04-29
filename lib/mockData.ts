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
};

export type PropStatus = "OPEN" | "AWAITING_VERDICT" | "RESOLVED";

export type MockProp = {
  id: string;
  eventId: string;
  description: string;
  /**
   * The users this prop is ABOUT (the "subjects").
   * House rule: a user can never see, wager on, or vote to resolve a prop
   * where they appear in subjectUserIds. Insider trading on yourself = banned.
   */
  subjectUserIds: string[];
  status: PropStatus;
  /** Parimutuel pools — implied probability is yes / (yes + no). */
  yesPool: number;
  noPool: number;
  /** Vote tally for resolution; undefined slots mean "not yet voted". */
  votes: { yes: number; no: number };
  /** Total eligible voters for this prop (excludes subjects). */
  voterCount: number;
  /** Set when status === RESOLVED. */
  resolvedSide?: "YES" | "NO";
  /**
   * Subject's own confession when the prop hits AWAITING_VERDICT. Indexed
   * per-subject would be ideal once we have a real backend; for the demo
   * we store one string keyed off the first listed subject.
   */
  subjectVerdict?: "CONFESSED" | "DENIED";
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
  },
];

export const mockProps: MockProp[] = [
  // ─── evt_1 — LIVE ─────────────────────────────────────────────
  {
    id: "prp_1",
    eventId: "evt_1",
    description: "Mark spills his drink before midnight",
    subjectUserIds: ["u_mark"],
    status: "OPEN",
    yesPool: 1280,
    noPool: 720,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },
  {
    id: "prp_2",
    eventId: "evt_1",
    description: "Jules tells the Croatia story (again)",
    subjectUserIds: ["u_jules"], // hidden from current user
    status: "OPEN",
    yesPool: 940,
    noPool: 410,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },
  {
    id: "prp_3",
    eventId: "evt_1",
    description: "Romi falls asleep on the couch before 1 AM",
    subjectUserIds: ["u_romi"],
    status: "OPEN",
    yesPool: 320,
    noPool: 580,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },
  {
    id: "prp_4",
    eventId: "evt_1",
    description: "There's a tactical chunder before midnight",
    subjectUserIds: [],
    status: "AWAITING_VERDICT",
    yesPool: 460,
    noPool: 540,
    votes: { yes: 2, no: 1 },
    voterCount: 7,
  },
  {
    id: "prp_5",
    eventId: "evt_1",
    description: "Sarah brings the cake she promised",
    subjectUserIds: ["u_sarah"],
    status: "OPEN",
    yesPool: 880,
    noPool: 120,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },
  {
    id: "prp_6",
    eventId: "evt_1",
    description: "Dave brings up his crypto portfolio uninvited",
    subjectUserIds: ["u_dave"],
    status: "OPEN",
    yesPool: 1450,
    noPool: 80,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },

  // ─── evt_2 — Friday Night Darts ───────────────────────────────
  {
    id: "prp_10",
    eventId: "evt_2",
    description: "Dave hits a 180 at least once",
    subjectUserIds: ["u_dave"],
    status: "OPEN",
    yesPool: 480,
    noPool: 220,
    votes: { yes: 0, no: 0 },
    voterCount: 4,
  },
  {
    id: "prp_11",
    eventId: "evt_2",
    description: "Steve overshoots his finish at least 3 times",
    subjectUserIds: ["u_steve"],
    status: "OPEN",
    yesPool: 320,
    noPool: 180,
    votes: { yes: 0, no: 0 },
    voterCount: 4,
  },
  {
    id: "prp_12",
    eventId: "evt_2",
    description: "The match goes to a deciding leg",
    subjectUserIds: [],
    status: "OPEN",
    yesPool: 250,
    noPool: 150,
    votes: { yes: 0, no: 0 },
    voterCount: 4,
  },

  // ─── evt_3 — Lakers vs Celtics ────────────────────────────────
  {
    id: "prp_15",
    eventId: "evt_3",
    description: "Lakers cover the spread",
    subjectUserIds: [],
    status: "OPEN",
    yesPool: 720,
    noPool: 480,
    votes: { yes: 0, no: 0 },
    voterCount: 5,
  },
  {
    id: "prp_16",
    eventId: "evt_3",
    description: "More than 220 total points scored",
    subjectUserIds: [],
    status: "OPEN",
    yesPool: 540,
    noPool: 360,
    votes: { yes: 0, no: 0 },
    voterCount: 5,
  },

  // ─── evt_4 — Sarah's thesis ───────────────────────────────────
  {
    id: "prp_18",
    eventId: "evt_4",
    description: "Sarah submits before midnight Sunday",
    subjectUserIds: ["u_sarah"],
    status: "OPEN",
    yesPool: 220,
    noPool: 580,
    votes: { yes: 0, no: 0 },
    voterCount: 4,
  },
  {
    id: "prp_19",
    eventId: "evt_4",
    description: "Sarah pulls at least one all-nighter this week",
    subjectUserIds: ["u_sarah"],
    status: "OPEN",
    yesPool: 920,
    noPool: 80,
    votes: { yes: 0, no: 0 },
    voterCount: 4,
  },

  // ─── evt_5 — Karaoke (RESOLVING) ──────────────────────────────
  {
    id: "prp_20",
    eventId: "evt_5",
    description: "Steve attempts Bohemian Rhapsody",
    subjectUserIds: ["u_steve"],
    status: "AWAITING_VERDICT",
    yesPool: 1240,
    noPool: 360,
    votes: { yes: 4, no: 1 },
    voterCount: 5,
  },
  {
    id: "prp_22",
    eventId: "evt_5",
    description: "Jules picks a song from before 1990",
    subjectUserIds: ["u_jules"],
    status: "AWAITING_VERDICT",
    yesPool: 540,
    noPool: 280,
    votes: { yes: 2, no: 1 },
    voterCount: 4,
  },
  {
    id: "prp_23",
    eventId: "evt_5",
    description: "Jules duets with Steve at least once",
    subjectUserIds: ["u_jules"],
    status: "AWAITING_VERDICT",
    yesPool: 320,
    noPool: 660,
    votes: { yes: 1, no: 2 },
    voterCount: 4,
  },
  {
    id: "prp_21",
    eventId: "evt_5",
    description: "Romi cries during a slow song",
    subjectUserIds: ["u_romi"],
    status: "RESOLVED",
    yesPool: 880,
    noPool: 220,
    votes: { yes: 5, no: 1 },
    voterCount: 5,
    resolvedSide: "YES",
  },
];

/**
 * Filter a list of props to those a viewer is allowed to see/wager on.
 * Anti-self-bet rule: hides any prop where the viewer is a subject.
 */
export function visiblePropsFor(viewerId: string, props: MockProp[]): MockProp[] {
  return props.filter((p) => !p.subjectUserIds.includes(viewerId));
}

/**
 * True if the viewer is forbidden from interacting with this prop because
 * the prop is about them.
 */
export function isPropAboutViewer(viewerId: string, prop: MockProp): boolean {
  return prop.subjectUserIds.includes(viewerId);
}

/** Sum of all pools across an event's props — the live pot. */
export function eventPot(eventId: string, props: MockProp[]): number {
  return props
    .filter((p) => p.eventId === eventId)
    .reduce((acc, p) => acc + p.yesPool + p.noPool, 0);
}

/**
 * Mirror state for a viewer.
 * - secret: count of OPEN props about the viewer (descriptions hidden).
 * - pending: AWAITING_VERDICT props the viewer should judge (descriptions
 *   are unmasked here — the event has ended).
 * - judged: props the viewer already confessed/denied on.
 */
export function mirrorStateFor(viewerId: string, props: MockProp[]) {
  const subjectProps = props.filter((p) => p.subjectUserIds.includes(viewerId));
  const secret = subjectProps.filter((p) => p.status === "OPEN");
  const pending = subjectProps.filter(
    (p) => p.status === "AWAITING_VERDICT" && !p.subjectVerdict
  );
  const judged = subjectProps.filter((p) => p.subjectVerdict);
  return {
    secretCount: secret.length,
    pendingCount: pending.length,
    judgedCount: judged.length,
    pending,
    judged,
  };
}
