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
import { CURRENT_USER_ID, Friend, mockFriends } from "./mockData";
import { Challenge, drawChallenges } from "./challengePacks";
import { RoundAward, RoundResult, scoreRound, streakMultiplier } from "./scoring";

/**
 * Party Mode — the Jackbox-style synchronous round loop.
 *
 * One device demo: the viewer is the host. The other event members are
 * simulated bots — they "lock in" their picks on a small random delay so
 * the lobby and voting feel populated. When the Supabase backend lands,
 * the bot loop is replaced by Realtime subscriptions and every player
 * lives on their own device.
 */

export type Phase =
  | "LOBBY"
  | "PROMPT"
  | "VOTING"
  | "LOCK"
  | "REVEAL"
  | "SCOREBOARD"
  | "FINAL";

export type SessionPlayer = {
  userId: string;
  handle: string;
  score: number;
  streak: number;
  prophetHits: number;
  /** Bot players auto-vote so the demo feels alive. */
  isBot: boolean;
};

export type RoundState = {
  challenge: Challenge;
  number: number;
  votes: Record<string, string>; // voterId -> targetId
  result?: RoundResult;
  /** Per-voter point delta after streak multipliers applied. */
  pointsAwarded?: Record<string, number>;
};

export type GameSession = {
  id: string;
  eventId: string;
  hostId: string;
  packId: string;
  packLabel: string;
  phase: Phase;
  currentRoundIndex: number;
  rounds: RoundState[];
  players: SessionPlayer[];
  /** ms timestamp when the current voting timer ends. */
  votingEndsAt?: number;
};

type GameSessionContextValue = {
  session: GameSession | null;
  createSession: (
    eventId: string,
    packId: string,
    options?: { rounds?: number; memberIds?: string[] }
  ) => string;
  advancePhase: () => void;
  castVote: (targetId: string) => void;
  resetSession: () => void;
};

const VOTING_WINDOW_MS = 18_000;
const PROMPT_HOLD_MS = 2400;
const LOCK_HOLD_MS = 800;
const REVEAL_HOLD_MS = 4200;
const SCOREBOARD_HOLD_MS = 4200;

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makePlayer(friend: Friend, isViewer: boolean): SessionPlayer {
  return {
    userId: friend.id,
    handle: friend.handle,
    score: 0,
    streak: 0,
    prophetHits: 0,
    isBot: !isViewer,
  };
}

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSession | null>(null);

  /** Timers — kept in refs so phase changes don't leak setTimeouts. */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const createSession: GameSessionContextValue["createSession"] = useCallback(
    (eventId, packId, options) => {
      const rounds = drawChallenges(packId, options?.rounds ?? 8);
      const memberIds =
        options?.memberIds ??
        mockFriends.slice(0, 6).map((f) => f.id); // sensible default
      const friends = mockFriends.filter((f) => memberIds.includes(f.id));
      const withViewer = friends.some((f) => f.id === CURRENT_USER_ID)
        ? friends
        : [
            mockFriends.find((f) => f.id === CURRENT_USER_ID)!,
            ...friends,
          ];

      const players: SessionPlayer[] = withViewer.map((f) =>
        makePlayer(f, f.id === CURRENT_USER_ID)
      );

      const id = `gs_${Date.now().toString(36)}`;
      const newSession: GameSession = {
        id,
        eventId,
        hostId: CURRENT_USER_ID,
        packId,
        packLabel: packId,
        phase: "LOBBY",
        currentRoundIndex: 0,
        rounds: rounds.map((c, i) => ({
          challenge: c,
          number: i + 1,
          votes: {},
        })),
        players,
      };
      setSession(newSession);
      return id;
    },
    []
  );

  const resetSession = useCallback(() => {
    clearTimers();
    setSession(null);
  }, [clearTimers]);

  /* ─────────── Phase progression ─────────── */

  const scheduleBotVotes = useCallback((roundIndex: number, endsAt: number) => {
    setSession((s) => {
      if (!s) return s;
      const round = s.rounds[roundIndex];
      if (!round) return s;
      const candidates = s.players.map((p) => p.userId);

      // Stagger bot vote arrivals so the lobby counter ticks up.
      s.players
        .filter((p) => p.isBot)
        .forEach((bot) => {
          const delay =
            1000 + Math.floor(Math.random() * Math.max(2000, VOTING_WINDOW_MS - 3000));
          const t = setTimeout(() => {
            // 30% chance a bot self-votes; otherwise random other.
            const selfVote = Math.random() < 0.25;
            const target = selfVote
              ? bot.userId
              : rand(candidates.filter((id) => id !== bot.userId));
            setSession((cur) => {
              if (!cur) return cur;
              if (cur.phase !== "VOTING") return cur;
              if (cur.currentRoundIndex !== roundIndex) return cur;
              const r = cur.rounds[roundIndex];
              if (r.votes[bot.userId]) return cur;
              const newRounds = cur.rounds.slice();
              newRounds[roundIndex] = {
                ...r,
                votes: { ...r.votes, [bot.userId]: target },
              };
              return { ...cur, rounds: newRounds };
            });
          }, delay);
          timers.current.push(t);
        });

      // Auto-lock at the end of the voting window.
      const remaining = Math.max(0, endsAt - Date.now());
      const lockT = setTimeout(() => {
        setSession((cur) => {
          if (!cur) return cur;
          if (cur.phase !== "VOTING") return cur;
          return { ...cur, phase: "LOCK" };
        });
      }, remaining);
      timers.current.push(lockT);

      return s;
    });
  }, []);

  /**
   * Drive the state machine. Each phase auto-advances on a timer except
   * LOBBY (host taps START) and VOTING (advances when all locked or timeout).
   */
  const transitionInto = useCallback(
    (next: Phase) => {
      setSession((s) => {
        if (!s) return s;
        const updated: GameSession = { ...s, phase: next };

        if (next === "PROMPT") {
          updated.votingEndsAt = undefined;
        }
        if (next === "VOTING") {
          updated.votingEndsAt = Date.now() + VOTING_WINDOW_MS;
        }
        return updated;
      });

      if (next === "PROMPT") {
        const t = setTimeout(() => transitionInto("VOTING"), PROMPT_HOLD_MS);
        timers.current.push(t);
      } else if (next === "VOTING") {
        setSession((cur) => {
          if (!cur) return cur;
          const endsAt = cur.votingEndsAt!;
          scheduleBotVotes(cur.currentRoundIndex, endsAt);
          return cur;
        });
      } else if (next === "LOCK") {
        const t = setTimeout(() => transitionInto("REVEAL"), LOCK_HOLD_MS);
        timers.current.push(t);
      } else if (next === "REVEAL") {
        // Compute result now.
        setSession((cur) => {
          if (!cur) return cur;
          const idx = cur.currentRoundIndex;
          const round = cur.rounds[idx];
          const votes = cur.players.map((p) => ({
            voterId: p.userId,
            targetId: round.votes[p.userId] ?? null,
          }));
          const result = scoreRound(votes);

          const pointsAwarded: Record<string, number> = {};
          const nextPlayers = cur.players.map((p) => {
            const award = result.awards.find((a) => a.voterId === p.userId)!;
            const newStreak = award.matchedPlurality ? p.streak + 1 : 0;
            const mult = streakMultiplier(p.streak + (award.matchedPlurality ? 1 : 0));
            const earned = award.points > 0 ? award.points * mult : award.points;
            pointsAwarded[p.userId] = earned;
            return {
              ...p,
              score: Math.max(0, p.score + earned),
              streak: newStreak,
              prophetHits: p.prophetHits + (award.matchedPlurality ? 1 : 0),
            };
          });

          const newRounds = cur.rounds.slice();
          newRounds[idx] = { ...round, result, pointsAwarded };
          return { ...cur, rounds: newRounds, players: nextPlayers };
        });

        const t = setTimeout(() => transitionInto("SCOREBOARD"), REVEAL_HOLD_MS);
        timers.current.push(t);
      } else if (next === "SCOREBOARD") {
        const t = setTimeout(() => {
          setSession((cur) => {
            if (!cur) return cur;
            const isLast = cur.currentRoundIndex >= cur.rounds.length - 1;
            if (isLast) {
              return { ...cur, phase: "FINAL" };
            }
            return {
              ...cur,
              phase: "PROMPT",
              currentRoundIndex: cur.currentRoundIndex + 1,
            };
          });
          // schedule next prompt → voting
          const t2 = setTimeout(() => transitionInto("VOTING"), PROMPT_HOLD_MS);
          timers.current.push(t2);
        }, SCOREBOARD_HOLD_MS);
        timers.current.push(t);
      }
    },
    [scheduleBotVotes]
  );

  const advancePhase: GameSessionContextValue["advancePhase"] = useCallback(() => {
    if (!session) return;
    if (session.phase === "LOBBY") {
      transitionInto("PROMPT");
    } else if (session.phase === "FINAL") {
      // No-op; final is terminal. Host can resetSession from the UI.
    } else if (session.phase === "VOTING") {
      // Allow host to force-lock.
      transitionInto("LOCK");
    }
  }, [session, transitionInto]);

  /** When all players have voted, jump to LOCK early. */
  useEffect(() => {
    if (!session) return;
    if (session.phase !== "VOTING") return;
    const round = session.rounds[session.currentRoundIndex];
    if (!round) return;
    const everyone = session.players.every((p) => round.votes[p.userId]);
    if (everyone) {
      const t = setTimeout(() => transitionInto("LOCK"), 600);
      timers.current.push(t);
    }
  }, [session, transitionInto]);

  const castVote: GameSessionContextValue["castVote"] = useCallback(
    (targetId) => {
      setSession((cur) => {
        if (!cur) return cur;
        if (cur.phase !== "VOTING") return cur;
        const idx = cur.currentRoundIndex;
        const r = cur.rounds[idx];
        const newRounds = cur.rounds.slice();
        newRounds[idx] = {
          ...r,
          votes: { ...r.votes, [CURRENT_USER_ID]: targetId },
        };
        return { ...cur, rounds: newRounds };
      });
    },
    []
  );

  const value = useMemo<GameSessionContextValue>(
    () => ({
      session,
      createSession,
      advancePhase,
      castVote,
      resetSession,
    }),
    [session, createSession, advancePhase, castVote, resetSession]
  );

  return (
    <GameSessionContext.Provider value={value}>
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameSession(): GameSessionContextValue {
  const ctx = useContext(GameSessionContext);
  if (!ctx)
    throw new Error("useGameSession must be used inside GameSessionProvider");
  return ctx;
}

export type { RoundAward };
