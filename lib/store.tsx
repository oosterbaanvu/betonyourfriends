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
  mockProps,
  PropStatus,
} from "./mockData";

/** A user's position on a prop. One per (user, prop) pair for now. */
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

  /** propId -> Position for the current user. */
  positions: Record<string, Position>;
  /** propId -> the current user's vote in resolution. */
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

  addProp: (
    eventId: string,
    description: string,
    subjectUserIds: string[]
  ) => { ok: true; id: string } | { ok: false; reason: string };

  /** Helper: prop by id. */
  propById: (id: string) => MockProp | undefined;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(2840);
  const [props, setProps] = useState<MockProp[]>(mockProps);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [votes, setVotes] = useState<Record<string, UserVote>>({});

  const placeBet: Store["placeBet"] = useCallback(
    (propId, side, stake) => {
      if (stake <= 0) return { ok: false, reason: "Stake must be > 0" };
      if (stake > balance) return { ok: false, reason: "Not enough tokens" };

      const prop = props.find((p) => p.id === propId);
      if (!prop) return { ok: false, reason: "Prop not found" };
      if (prop.subjectUserIds.includes(CURRENT_USER_ID)) {
        return { ok: false, reason: "You can't bet on a prop about you" };
      }
      if (prop.status !== "OPEN") {
        return { ok: false, reason: "Prop is no longer open" };
      }

      // Mutate pools optimistically.
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

      // Stack stakes if the user bets the same side again; otherwise replace.
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
      if (prop.subjectUserIds.includes(CURRENT_USER_ID)) {
        return { ok: false, reason: "You can't vote on a prop about you" };
      }
      if (prop.status !== "AWAITING_VERDICT") {
        return { ok: false, reason: "Prop is not awaiting a verdict" };
      }

      const previous = votes[propId];

      // Update tally — undo the previous vote if any, then apply the new one.
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

          // Auto-resolve when a strict majority of eligible voters has voted.
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
      // Settlement (paying out the user's winnings) is handled by
      // useResolutionSettler below as soon as a prop transitions to RESOLVED.
      return { ok: true };
    },
    [props, votes]
  );

  const addProp: Store["addProp"] = useCallback(
    (eventId, description, subjectUserIds) => {
      const trimmed = description.trim();
      if (!trimmed) return { ok: false, reason: "Description is required" };

      // Voter pool excludes subjects (anti-self-bet). Default to 5 for the demo.
      const voterCount = Math.max(3, 7 - subjectUserIds.length);
      const newProp: MockProp = {
        id: `prp_${Date.now().toString(36)}`,
        eventId,
        description: trimmed,
        subjectUserIds,
        status: "OPEN",
        yesPool: 50,
        noPool: 50,
        votes: { yes: 0, no: 0 },
        voterCount,
      };
      setProps((prev) => [...prev, newProp]);
      return { ok: true, id: newProp.id };
    },
    []
  );

  // Settle the user's position whenever a prop transitions to RESOLVED.
  // We do it lazily — the moment we render a Resolved card we pay out via this hook.
  // Settlement is idempotent because we read it from a derived flag on Position.
  const propById = useCallback(
    (id: string) => props.find((p) => p.id === id),
    [props]
  );

  // Settle resolved props that the user has positions on, exactly once.
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
      addProp,
      propById,
    }),
    [balance, props, positions, votes, placeBet, castVote, addProp, propById]
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

      // Parimutuel payout: winners share the losing pool proportional to their stake.
      const winningPool = p.resolvedSide === "YES" ? p.yesPool : p.noPool;
      const losingPool = p.resolvedSide === "YES" ? p.noPool : p.yesPool;
      const won = pos.side === p.resolvedSide;
      const payout = won
        ? pos.amount + (pos.amount / Math.max(winningPool, 1)) * losingPool
        : 0;

      if (payout > 0) {
        setBalance((b) => b + payout);
      }

      // Mark the position as settled by removing it (UI shows it as a resolved verdict).
      setPositions((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
      settled.current[p.id] = true;
    }
  }, [props, positions, setBalance, setPositions]);
}
