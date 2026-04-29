/** Mock data — replaced by Supabase queries in a later phase. */

export type EventStatus = "OPEN" | "LIVE" | "RESOLVING" | "CLOSED";

export type MockEvent = {
  id: string;
  title: string;
  creator: string;
  startsAt: string;
  status: EventStatus;
  propsCount: number;
  potTokens: number;
  accent: "lime" | "pink" | "violet" | "sun";
};

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
  yesPayout: number;
  noPayout: number;
  status: "OPEN" | "AWAITING_VERDICT" | "RESOLVED";
};

export const CURRENT_USER_ID = "u_jules";

export const mockEvents: MockEvent[] = [
  {
    id: "evt_1",
    title: "Mark's Birthday Rager",
    creator: "@jules",
    startsAt: "Tonight · 9:00 PM",
    status: "LIVE",
    propsCount: 7,
    potTokens: 4280,
    accent: "pink",
  },
  {
    id: "evt_2",
    title: "Fantasy Draft Night",
    creator: "@deeznuts",
    startsAt: "Sat · 7:30 PM",
    status: "OPEN",
    propsCount: 12,
    potTokens: 1900,
    accent: "lime",
  },
  {
    id: "evt_3",
    title: "Sunday Brunch Carnage",
    creator: "@romi",
    startsAt: "Sun · 11:00 AM",
    status: "OPEN",
    propsCount: 4,
    potTokens: 620,
    accent: "violet",
  },
  {
    id: "evt_4",
    title: "Karaoke Apocalypse",
    creator: "@bigsteve",
    startsAt: "Resolving now",
    status: "RESOLVING",
    propsCount: 9,
    potTokens: 5550,
    accent: "sun",
  },
];

export const mockProps: MockProp[] = [
  {
    id: "prp_1",
    eventId: "evt_1",
    description: "Mark spills his drink before midnight",
    subjectUserIds: ["u_mark"],
    yesPayout: 1.8,
    noPayout: 2.2,
    status: "OPEN",
  },
  {
    id: "prp_2",
    eventId: "evt_1",
    description: "Jules tells the story about Croatia (again)",
    subjectUserIds: ["u_jules"], // hidden from current user
    yesPayout: 1.4,
    noPayout: 3.1,
    status: "OPEN",
  },
  {
    id: "prp_3",
    eventId: "evt_1",
    description: "Romi falls asleep on the couch",
    subjectUserIds: ["u_romi"],
    yesPayout: 2.6,
    noPayout: 1.6,
    status: "OPEN",
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
