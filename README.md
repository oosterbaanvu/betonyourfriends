# BetOnYourFriends

A social prediction market for friend groups. Take Polymarket, strip out the
finance jargon, and turn it into a fast, fun party game for whatever your
friends are about to do.

**Stack:** React Native, Expo SDK 54 (Expo Router, TypeScript), NativeWind, Supabase

## The vision (locked-in)

- **Event Hub:** someone creates an event for anything — a darts night, a
  watch party, a wedding, a friend's deadline — and invites the squad with
  a share code.
- **Prop Board:** before *and during* the event, anyone in the group can add
  Yes/No propositions ("Dave hits a 180 in the first leg," "Sarah submits
  her thesis before midnight").
- **The Wager:** users buy Yes or No shares with an in-app virtual currency.
  Live parimutuel odds shift as bets come in.
- **The Oracle:** the friend group resolves the bet. Simple majority vote
  clears each prop and distributes the winnings.
- **Photo evidence:** voters can attach a photo as proof when voting.
- **Premade Packs:** for events nobody has inspiration for, load curated
  prop packs with one tap (Bar Crawl, Wedding Reception, Office Holiday
  Party, Watch Party, Darts Night, Birthday Bash, Crypto Bro, After Dark —
  the last is 18+).
- **Leaderboards & stats:** Prophet score, biggest risk-taker, most
  predictable friend.

## Design language

Polymarket-clean with editorial weight. White surfaces, 1px gray borders,
modest 10–14px radii, calm typography, and only Ionicons for symbols (no
emojis anywhere). Color is reserved for semantics — green for Yes / wins,
red for No / losses, navy for primary actions, status pills for live state.
A featured Live event gets a dark hero card on the Markets home for visual
hierarchy.

## House rules

### No betting on yourself

A prop carries `subjectUserIds[]` — the people the prediction is *about*.
A user **cannot see, wager on, or vote to resolve** any prop where they
appear in that list. If you knew there was a bet on you spilling your drink,
you'd be tempted to influence it. So we hide it end-to-end:

- **Read path:** props are filtered through `visiblePropsFor(viewerId, props)`
  before they hit the feed. Subjects literally don't see them.
- **Write path:** Supabase RLS rejects share inserts and vote inserts where
  `auth.uid() = ANY(props.subject_user_ids)`. Server is the source of truth.
- **Authoring:** every composer (Create screen + the in-event Add Prop sheet)
  has a subject tagger so this constraint has data to work with from day one.

The mock helpers live in `lib/mockData.ts`; they'll move to a `lib/api/`
layer once Supabase is wired up.

## Packs

Premade packs live in `lib/packs.ts`. Each pack is a curated list of party
props with an accent color and two-letter monogram. The Create screen
exposes them via a horizontal chip strip — tap a chip, preview the props in
a sheet, toggle off any you don't want, and the rest get appended to your
event.

Current set:

| Pack | Vibe |
|------|------|
| Bar Crawl | Bar crawl chaos |
| Wedding Reception | Open bar plus relatives |
| Office Holiday Party | HR will hear about this |
| Watch Party | Game night |
| Darts Night | Pub-league commitment |
| Birthday Bash | Candles plus chaos |
| Crypto Bro | Designed for that one friend |
| After Dark | Adults-only party bets (18+, with confirm) |

Adult packs are gated by a confirm dialog and a small `18+` chip on the
card. Pack content stays tasteful party-game tone.

## Event Hub features

- Sticky header with status pill, live countdown, member avatar stack,
  market count, and total volume.
- Segmented tabs: Open / Verdict / Resolved.
- "Add prop" button — anyone in the event can append new props at any time.
- "Invite" button — opens a sheet with the event code and a copy-link.
- Anti-self-bet: a hidden-count card on top so the rule is visible without
  leaking the prop content.

## Run it

```bash
npm install
npx expo install --check
npx expo start --web
```

Or `--tunnel` to use Expo Go on your phone over any network.

## Data model (Supabase plan)

| Table  | Fields |
|--------|--------|
| users  | id, username, avatar_url, virtual_balance |
| events | id, title, creator_id, start_time, status, invite_code |
| event_members | event_id, user_id |
| props  | id, event_id, description, **subject_user_ids[]**, status, source_pack_id |
| shares | id, user_id, prop_id, position (yes/no), amount |
| votes  | id, prop_id, user_id, vote (yes/no), photo_evidence_url |

RLS on `shares` and `votes`: rejects rows where
`auth.uid() = ANY(props.subject_user_ids)`.

## Phase 1 status

- [x] Step 1: Bottom-tab scaffold (Markets / Create / Profile)
- [x] Anti-self-bet rule baked into the data model + helpers
- [x] Packs + subject tagging in Create
- [x] Step 2: Event Hub (countdown, segmented tabs, Add prop, Invite)
- [x] Step 3: Wager Modal (parimutuel pools, payout preview)
- [x] Step 4: Resolution UI (vote + photo evidence + auto-settle)
- [x] Iconography (Ionicons), no emojis
- [ ] Step 5: Supabase backend (auth, schema, RLS, real-time)
