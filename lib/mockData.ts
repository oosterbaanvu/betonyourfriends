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
