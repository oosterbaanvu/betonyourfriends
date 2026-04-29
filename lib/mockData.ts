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
  /** Used to compute the running pot from props. */
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
    title: "Mark's Birthday Rager",
    creator: "@jules",
    startsAt: "Tonight · 9:00 PM",
    startsInMinutes: 90,
    status: "LIVE",
    accent: "pink",
  },
  {
    id: "evt_2",
    title: "Fantasy Draft Night",
    creator: "@deeznuts",
    startsAt: "Sat · 7:30 PM",
    startsInMinutes: 60 * 26,
    status: "OPEN",
    accent: "lime",
  },
  {
    id: "evt_3",
    title: "Sunday Brunch Carnage",
    creator: "@romi",
    startsAt: "Sun · 11:00 AM",
    startsInMinutes: 60 * 50,
    status: "OPEN",
    accent: "violet",
  },
  {
    id: "evt_4",
    title: "Karaoke Apocalypse",
    creator: "@bigsteve",
    startsAt: "Resolving now",
    startsInMinutes: -180,
    status: "RESOLVING",
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

  // ─── evt_2 — OPEN ─────────────────────────────────────────────
  {
    id: "prp_10",
    eventId: "evt_2",
    description: "Priya picks a kicker in the first 5 rounds",
    subjectUserIds: ["u_priya"],
    status: "OPEN",
    yesPool: 60,
    noPool: 240,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },
  {
    id: "prp_11",
    eventId: "evt_2",
    description: "Steve falls asleep before round 8",
    subjectUserIds: ["u_steve"],
    status: "OPEN",
    yesPool: 320,
    noPool: 180,
    votes: { yes: 0, no: 0 },
    voterCount: 6,
  },

  // ─── evt_4 — RESOLVING ────────────────────────────────────────
  {
    id: "prp_20",
    eventId: "evt_4",
    description: "Steve attempts Bohemian Rhapsody",
    subjectUserIds: ["u_steve"],
    status: "AWAITING_VERDICT",
    yesPool: 1240,
    noPool: 360,
    votes: { yes: 4, no: 1 },
    voterCount: 6,
  },
  {
    id: "prp_21",
    eventId: "evt_4",
    description: "Romi cries during a slow song",
    subjectUserIds: ["u_romi"],
    status: "RESOLVED",
    yesPool: 880,
    noPool: 220,
    votes: { yes: 5, no: 1 },
    voterCount: 6,
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
