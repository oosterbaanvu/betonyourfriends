# BetOnYourFriends

A social prediction market for friend groups. Take Polymarket, strip out the
finance jargon, and turn it into a fast, fun party game for whatever your
friends are about to do.

**Stack:** React Native, Expo SDK 54 (Expo Router, TypeScript), NativeWind, Supabase

## The vision

- **Event Hub:** someone creates an event for anything — a darts night, a
  watch party, a wedding, a friend's deadline — and invites the squad with
  a share code.
- **Prop Board:** before *and during* the event, anyone in the group can add
  Yes/No propositions.
- **The Wager:** users buy Yes or No shares with an in-app virtual currency.
  Live parimutuel odds shift as bets come in.
- **The Oracle:** the friend group resolves the bet. Simple majority vote
  clears each prop and distributes the winnings.
- **Photo evidence:** voters can attach a photo as proof.
- **Premade Packs:** Bar Crawl, Wedding Reception, Office Holiday Party,
  Watch Party, Darts Night, Birthday Bash, Crypto Bro, After Dark (18+).
- **Live odds, leaderboards, Prophet Score.**

## The Dual Hub (entry experience)

The app opens to a split landing screen — two massive tiles:

- **THE MIRROR (left/top)** — about the user.
  - **State A — Tracking:** while events are live, the tile is dark with a
    blurred-eye icon, showing only a *count* of secret bets running about
    you. Descriptions and amounts are masked end-to-end. Disabled — there
    is nothing to do here yet.
  - **State B — Pending Judgment:** as soon as a prop about the user moves
    to `AWAITING_VERDICT`, the tile pulses lime, the count flips to "verdicts
    need you," and tapping enters Judgment Mode where the user can
    **CONFESS** or **DENY** each prop (with a rotated rubber-stamp visual:
    GUILTY in blood red, SQUEAKY CLEAN in violet).
- **THE PIT (right/bottom)** — the main market. White surface, lime LIVE chip,
  big "ENTER" display type. Drops into the standard Markets / Create /
  Profile tabs.

## House rules

### No betting on yourself

A prop carries `subjectUserIds[]` — the people the prediction is *about*.
A user **cannot see, wager on, or vote to resolve** any prop where they
appear in that list:

- **Read path:** props are filtered through `visiblePropsFor(viewerId, props)`
  before they hit the feed. Subjects literally don't see them while OPEN.
- **Mirror reveal:** descriptions stay masked while the event is OPEN.
  Once a prop hits `AWAITING_VERDICT`, descriptions unmask in the Mirror
  so the subject can judge — but pools and bettor identities stay hidden.
- **Write path:** Supabase RLS rejects share inserts and vote inserts where
  `auth.uid() = ANY(props.subject_user_ids)`. Server is the source of truth.
- **Judgment:** subjects use `confessOrDeny` to resolve their own props
  directly (one-shot for now; weighted vote with tiebreak in Phase 2).

## Design language

Refined Neo-Brutalist.

- Pitch black ink, bone white, chalk surfaces.
- Hard 5px borders, no rounded blobs (radius 0–6 max).
- Stacked-block drop shadows behind every elevated surface — never soft blur.
- Display type: 900 weight, uppercase, tight letter-spacing.
- Mono (Courier) for codes, timestamps, and stat strips.
- Pop colors used as energy moments only: lime (verdicts, pulse, OPEN),
  pink/blood (live, danger, NO), violet (judgment), sun yellow (warning).
- Status pills are colored squares with thick ink borders, not pills.
- Primary buttons stomp into their drop block when pressed.

## Run it

```bash
npm install
npx expo install --check
npx expo start --web
```

Or `--tunnel` to use Expo Go on your phone over any network.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Dual-hub landing (Mirror + Pit) |
| `/judgment` | Judgment Mode (Mirror, pending props + Wall of Shame) |
| `/markets` | Tabs entry — markets list (the Pit) |
| `/create` | Tabs entry — new event composer |
| `/profile` | Tabs entry — stats + verdicts |
| `/event/:id` | Event Hub with prop board |

## Data model (Supabase plan)

| Table  | Fields |
|--------|--------|
| users  | id, username, avatar_url, virtual_balance |
| events | id, title, creator_id, start_time, status, invite_code |
| event_members | event_id, user_id |
| props  | id, event_id, description, **subject_user_ids[]**, status, source_pack_id, subject_verdict |
| shares | id, user_id, prop_id, position (yes/no), amount |
| votes  | id, prop_id, user_id, vote (yes/no), photo_evidence_url |

## Phase status

- [x] Step 1: Bottom-tab scaffold (Markets / Create / Profile)
- [x] Anti-self-bet rule baked into the data model + helpers
- [x] Packs + subject tagging
- [x] Step 2: Event Hub (countdown, segmented tabs, Add prop, Invite)
- [x] Step 3: Wager Modal (parimutuel pools, payout preview)
- [x] Step 4: Resolution UI (vote + photo evidence + auto-settle)
- [x] Iconography (Ionicons), no emojis
- [x] Dual Hub entry (Mirror + Pit)
- [x] Judgment Mode + Confess / Deny + Wall of Shame stamps
- [x] Refined Neo-Brutalist redesign across the app
- [ ] Step 5: Supabase backend (auth, schema, RLS, real-time, encrypted
      payload reveal on event status flip)
