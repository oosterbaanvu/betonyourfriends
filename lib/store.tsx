import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CURRENT_USER_ID,
  MockProp,
  mockEvents,
  mockProps,
  PropStatus,
} from "./mockData";
import { generateAskUsForEvent } from "./ai";

/** A user's position on a YESNO prop. One per (user, prop) pair for now. */
export type Position = {
  side: "YES" | "NO";
  amount: number;
};

export type UserVote = {
  side: "YES" | "NO";
  photoUri?: string;
};

type Store = {
  viewerId: string;
  balance: number;
  props: MockProp[];

  /** propId -> Position for the current user (YESNO only). */
  positions: Record<string, Position>;
  /** propId -> the current user's YES/NO resolution vote. */
  votes: Record<string, UserVote>;

  placeBet: (
    propId: string,
    side: "YES" | "NO",
    stake: number
  ) => { ok: true } | { ok: false; reason: string };

  castVote: (
    propId: string,
    side: "YES" | "NO",
    photoUri?: string
  ) => { ok: true } | { ok: false; reason: string };

  /** Cast the viewer's WMLT (AskUs) pick. */
  castWmltVote: (
    propId: string,
    targetUserId: string
  ) => { ok: true } | { ok: false; reason: string };

  /**
   * Create a YESNO prop. Subjects must be tagged; the description carries
   * the actual claim. expiresInMinutes drives the countdown after which
   * the bet locks and verdicts open.
   */
  addProp: (
    eventId: string,
    description: string,
    subjectUserIds: string[],
    options?: { expiresInMinutes?: number }
  ) => { ok: true; id: string } | { ok: false; reason: string };

  /** Create a WMLT (AskUs) prompt. */
  addWmltProp: (
    eventId: string,
    description: string,
    candidateUserIds: string[],
    options?: { expiresInMinutes?: number }
  ) => { ok: true; id: string } | { ok: false; reason: string };

  /** Seed AI AskUs prompts onto an event (idempotent per call). */
  seedAskUsForEvent: (eventId: string) => void;

  /**
   * Subject-as-judge: the viewer confesses or denies a prop about them.
   * Records the verdict and resolves the prop directly.
   */
  confessOrDeny: (
    propId: string,
    verdict: "CONFESSED" | "DENIED"
  ) => { ok: true } | { ok: false; reason: string };

  /** Helper: prop by id. */
  propById: (id: string) => MockProp | undefined;
};

const StoreContext = createContext<Store | null>(null);

/* ─────────────────────── helpers ─────────────────────── */

function computeWmltWinners(prop: MockProp): string[] {
  const votes = prop.wmltVotes ?? {};
  const tally: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    tally[target] = (tally[target] ?? 0) + 1;
  }
  let max = 0;
  for (const id of Object.keys(tally)) {
    if (tally[id] > max) max = tally[id];
  }
  if (max === 0) return [];
  return Object.keys(tally).filter((id) => tally[id] === max);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(2840);
  const [props, setProps] = useState<MockProp[]>(mockProps);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [votes, setVotes] = useState<Record<string, UserVote>>({});
  /** Tracks which event ids we've already AI-seeded so it's idempotent. */
  const seededEvents = useRef<Set<string>>(new Set());

  /* ─── auto-expire: tick once a second and flip expired props. ─── */
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const now = Date.now();
    let mutated = false;
    const next = props.map((p) => {
      if (p.status === "RESOLVED") return p;
      if (now < p.expiresAt) return p;
      if (p.kind === "YESNO") {
        // YESNO with subjects → AWAITING_VERDICT (subject judges in Mirror).
        // YESNO without subjects → AWAITING_VERDICT (group votes).
        if (p.status === "OPEN") {
          mutated = true;
          return { ...p, status: "AWAITING_VERDICT" as PropStatus };
        }
        return p;
      }
      // WMLT: resolve immediately once expired.
      if (p.status === "OPEN") {
        const winners = computeWmltWinners(p);
        mutated = true;
        return {
          ...p,
          status: "RESOLVED" as PropStatus,
          wmltWinnerIds: winners,
        };
      }
      return p;
    });
    if (mutated) setProps(next);
  }, [props]);

  /* ─────────────────────── actions ─────────────────────── */

  const placeBet: Store["placeBet"] = useCallback(
    (propId, side, stake) => {
      if (stake <= 0) return { ok: false, reason: "Stake must be > 0" };
      if (stake > balance) return { ok: false, reason: "Not enough tokens" };

      const prop = props.find((p) => p.id === propId);
      if (!prop) return { ok: false, reason: "Prop not found" };
      if (prop.kind !== "YESNO")
        return { ok: false, reason: "Use a vote for an AskUs prompt" };
      if (prop.subjectUserIds.includes(CURRENT_USER_ID)) {
        return { ok: false, reason: "You can't bet on a prop about you" };
      }
      if (prop.status !== "OPEN") {
        return { ok: false, reason: "Prop is no longer open" };
      }
      if (Date.now() >= prop.expiresAt) {
        return { ok: false, reason: "Bet has timed out" };
      }

      setProps((prev) =>
        prev.map((p) =>
          p.id !== propId
            ? p
            : {
                ...p,
                yesPool: side === "YES" ? p.yesPool + stake : p.yesPool,
                noPool: side === "NO" ? p.noPool + stake : p.noPool,
              }
        )
      );
      setBalance((b) => b - stake);

      setPositions((prev) => {
        const existing = prev[propId];
        if (existing && existing.side === side) {
          return {
            ...prev,
            [propId]: { side, amount: existing.amount + stake },
          };
        }
        return { ...prev, [propId]: { side, amount: stake } };
      });

      return { ok: true };
    },
    [balance, props]
  );

  const castVote: Store["castVote"] = useCallback(
    (propId, side, photoUri) => {
      const prop = props.find((p) => p.id === propId);
      if (!prop) return { ok: false, reason: "Prop not found" };
      if (prop.kind !== "YESNO")
        return { ok: false, reason: "Wrong vote type" };
      if (prop.subjectUserIds.includes(CURRENT_USER_ID)) {
        return { ok: false, reason: "You can't vote on a prop about you" };
      }
      if (prop.status !== "AWAITING_VERDICT") {
        return { ok: false, reason: "Prop is not awaiting a verdict" };
      }

      const previous = votes[propId];

      setProps((prev) =>
        prev.map((p) => {
          if (p.id !== propId) return p;
          const yes =
            p.votes.yes -
            (previous?.side === "YES" ? 1 : 0) +
            (side === "YES" ? 1 : 0);
          const no =
            p.votes.no -
            (previous?.side === "NO" ? 1 : 0) +
            (side === "NO" ? 1 : 0);

          const cast = yes + no;
          let nextStatus: PropStatus = p.status;
          let resolved: "YES" | "NO" | undefined = p.resolvedSide;
          const majorityNeeded = Math.floor(p.voterCount / 2) + 1;
          if (yes >= majorityNeeded) {
            nextStatus = "RESOLVED";
            resolved = "YES";
          } else if (no >= majorityNeeded) {
            nextStatus = "RESOLVED";
            resolved = "NO";
          } else if (cast >= p.voterCount) {
            nextStatus = "RESOLVED";
            resolved = yes >= no ? "YES" : "NO";
          }

          return {
            ...p,
            votes: { yes, no },
            status: nextStatus,
            resolvedSide: resolved,
          };
        })
      );

      setVotes((prev) => ({ ...prev, [propId]: { side, photoUri } }));
      return { ok: true };
    },
    [props, votes]
  );

  const castWmltVote: Store["castWmltVote"] = useCallback(
    (propId, targetUserId) => {
      const prop = props.find((p) => p.id === propId);
      if (!prop) return { ok: false, reason: "Prop not found" };
      if (prop.kind !== "WMLT")
        return { ok: false, reason: "Not an AskUs prompt" };
      if (prop.status !== "OPEN") {
        return { ok: false, reason: "Voting has closed" };
      }
      if (Date.now() >= prop.expiresAt) {
        return { ok: false, reason: "Voting has timed out" };
      }
      if (!(prop.candidateUserIds ?? []).includes(targetUserId)) {
        return { ok: false, reason: "Not a candidate" };
      }
      setProps((prev) =>
        prev.map((p) =>
          p.id !== propId
            ? p
            : {
                ...p,
                wmltVotes: { ...(p.wmltVotes ?? {}), [CURRENT_USER_ID]: targetUserId },
              }
        )
      );
      return { ok: true };
    },
    [props]
  );

  const confessOrDeny: Store["confessOrDeny"] = useCallback(
    (propId, verdict) => {
      const prop = props.find((p) => p.id === propId);
      if (!prop) return { ok: false, reason: "Prop not found" };
      if (prop.kind !== "YESNO")
        return { ok: false, reason: "Only YESNO props use confess/deny" };
      if (!prop.subjectUserIds.includes(CURRENT_USER_ID)) {
        return { ok: false, reason: "This prop isn't about you" };
      }
      if (Date.now() < prop.expiresAt) {
        return { ok: false, reason: "Bet hasn't timed out yet" };
      }
      const winningSide: "YES" | "NO" = verdict === "CONFESSED" ? "YES" : "NO";

      setProps((prev) =>
        prev.map((p) => {
          if (p.id !== propId) return p;
          return {
            ...p,
            subjectVerdict: verdict,
            status: "RESOLVED",
            resolvedSide: winningSide,
          };
        })
      );
      return { ok: true };
    },
    [props]
  );

  const addProp: Store["addProp"] = useCallback(
    (eventId, description, subjectUserIds, options) => {
      const trimmed = description.trim();
      if (!trimmed) return { ok: false, reason: "Description is required" };
      const expiresInMinutes = options?.expiresInMinutes ?? 60 * 6;
      const expiresAt = Date.now() + expiresInMinutes * 60_000;

      const voterCount = Math.max(3, 7 - subjectUserIds.length);
      const newProp: MockProp = {
        id: `prp_${Date.now().toString(36)}`,
        eventId,
        description: trimmed,
        kind: "YESNO",
        subjectUserIds,
        status: "OPEN",
        yesPool: 50,
        noPool: 50,
        votes: { yes: 0, no: 0 },
        voterCount,
        createdAt: Date.now(),
        expiresAt,
      };
      setProps((prev) => [...prev, newProp]);
      return { ok: true, id: newProp.id };
    },
    []
  );

  const addWmltProp: Store["addWmltProp"] = useCallback(
    (eventId, description, candidateUserIds, options) => {
      const trimmed = description.trim();
      if (!trimmed) return { ok: false, reason: "Prompt is required" };
      if (candidateUserIds.length < 2)
        return { ok: false, reason: "Need at least 2 candidates" };
      const expiresInMinutes = options?.expiresInMinutes ?? 60 * 4;
      const expiresAt = Date.now() + expiresInMinutes * 60_000;

      const newProp: MockProp = {
        id: `prp_w_${Date.now().toString(36)}`,
        eventId,
        description: trimmed,
        kind: "WMLT",
        subjectUserIds: [],
        candidateUserIds,
        wmltVotes: {},
        status: "OPEN",
        yesPool: 0,
        noPool: 0,
        votes: { yes: 0, no: 0 },
        voterCount: candidateUserIds.length,
        createdAt: Date.now(),
        expiresAt,
        fromHouse: false,
      };
      setProps((prev) => [...prev, newProp]);
      return { ok: true, id: newProp.id };
    },
    []
  );

  const seedAskUsForEvent: Store["seedAskUsForEvent"] = useCallback(
    (eventId) => {
      if (seededEvents.current.has(eventId)) return;
      seededEvents.current.add(eventId);
      const event = mockEvents.find((e) => e.id === eventId);
      if (!event) return;
      const fresh = generateAskUsForEvent({
        eventId,
        title: event.title,
        vibe: event.vibe,
        memberIds: event.memberIds,
        count: 3,
        durationMs: Math.max(30, event.startsInMinutes + 60) * 60_000,
      });
      if (fresh.length === 0) return;
      setProps((prev) => [...prev, ...fresh]);
    },
    []
  );

  const propById = useCallback(
    (id: string) => props.find((p) => p.id === id),
    [props]
  );

  // Settle YESNO positions when a prop resolves.
  useResolutionSettler(props, positions, setPositions, setBalance);

  const value = useMemo<Store>(
    () => ({
      viewerId: CURRENT_USER_ID,
      balance,
      props,
      positions,
      votes,
      placeBet,
      castVote,
      castWmltVote,
      addProp,
      addWmltProp,
      seedAskUsForEvent,
      confessOrDeny,
      propById,
    }),
    [
      balance,
      props,
      positions,
      votes,
      placeBet,
      castVote,
      castWmltVote,
      addProp,
      addWmltProp,
      seedAskUsForEvent,
      confessOrDeny,
      propById,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* ─────────────────────── Resolution settlement ─────────────────────── */

type SettledMap = Record<string, true>;

function useResolutionSettler(
  props: MockProp[],
  positions: Record<string, Position>,
  setPositions: (
    update:
      | Record<string, Position>
      | ((p: Record<string, Position>) => Record<string, Position>)
  ) => void,
  setBalance: (update: number | ((b: number) => number)) => void
) {
  const settled = useRef<SettledMap>({});

  useEffect(() => {
    for (const p of props) {
      if (p.status !== "RESOLVED" || !p.resolvedSide) continue;
      if (settled.current[p.id]) continue;
      const pos = positions[p.id];
      if (!pos) {
        settled.current[p.id] = true;
        continue;
      }

      const winningPool = p.resolvedSide === "YES" ? p.yesPool : p.noPool;
      const losingPool = p.resolvedSide === "YES" ? p.noPool : p.yesPool;
      const won = pos.side === p.resolvedSide;
      const payout = won
        ? pos.amount + (pos.amount / Math.max(winningPool, 1)) * losingPool
        : 0;

      if (payout > 0) {
        setBalance((b) => b + payout);
      }

      setPositions((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
      settled.current[p.id] = true;
    }
  }, [props, positions, setBalance, setPositions]);
}
