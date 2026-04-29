# BetOnYourFriends

A social prediction market for friend groups. Take Polymarket, strip out the
finance jargon, and turn it into a fast, fun party game for the night out.

**Stack:** React Native · Expo SDK 54 (Expo Router, TypeScript) · NativeWind · Supabase

## The vision (locked-in)

- **Event Hub:** someone creates an event ("Saturday Bar Crawl,"
  "Sarah's Birthday," "Super Bowl Watch Party") and invites the squad via a link.
- **Prop Board:** before the event starts, anyone in the group can add Yes/No
  propositions ("Mark will spill his drink before 11 PM," "We end up at
  McDonald's," "Dave talks about his crypto portfolio").
- **The Wager:** users buy Yes or No shares with an in-app virtual currency.
- **The Oracle:** the friend group resolves the bet. Simple majority vote
  clears each prop and distributes the winnings.
- **Photo evidence:** voters can attach a photo as proof when voting.
- **Premade Packs:** for nights nobody has inspiration, load curated
  prop packs with one tap (Wingman, Wedding Reception, Office Holiday Party,
  Watch Party, Birthday Bash, Crypto Bro, After Dark — the last is 18+).
- **Live odds:** as wagers come in, implied probabilities and payouts shift
  in real time.
- **Leaderboards & stats:** Prophet score, biggest risk-taker, most predictable
  friend.

## Design language

Polymarket-clean. White surfaces, 1px gray borders, modest 10–14px radii,
calm typography. Color is reserved for semantics — green for Yes / wins,
red for No / losses, blue for primary actions, status pills for live state.
No decorative pop, no slabs.

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
- **Authoring:** in the Create flow, each prop has a "About whom?" subject
  tagger so this constraint has data to work with from day one.

The mock helpers live in `lib/mockData.ts`; they'll move to a `lib/api/`
layer once Supabase is wired up.

## Packs

Premade packs live in `lib/packs.ts`. Each pack is a curated list of party
props. The Create screen exposes them via a horizontal chip strip — tap a
chip → preview the props in a sheet → toggle off any you don't want →
"Add N props" appends them to your event.

Current set:

| Pack | Vibe |
|------|------|
| 🍻 The Wingman Pack | Bar crawl chaos |
| 💍 The Wedding Reception Pack | Open bar + relatives |
| 🎄 The Office Holiday Party Pack | HR will hear about this |
| 🏈 The Watch Party Pack | Game night |
| 🎂 The Birthday Bash Pack | Candles + chaos |
| 💸 The Crypto Bro Pack | Designed for that one friend |
| 🌶️ The After Dark Pack | Adults-only party bets (18+, with confirm) |

Adult packs are gated by a confirm dialog and a small `18+` chip on the card.
The pack content stays tasteful party-game tone — suggestive, not explicit.

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
| events | id, title, creator_id, start_time, status |
| props  | id, event_id, description, **subject_user_ids[]**, status, source_pack_id |
| shares | id, user_id, prop_id, position (yes/no), amount |
| votes  | id, prop_id, user_id, vote (yes/no), photo_evidence_url |

RLS on `shares` and `votes`: rejects rows where
`auth.uid() = ANY(props.subject_user_ids)`.

## Phase 1 status

- [x] Step 1: Bottom-tab scaffold (Markets / Create / Profile)
- [x] Anti-self-bet rule baked into the data model + helpers
- [x] Packs + subject tagging in Create
- [ ] Step 2: Event Hub & Prop Board (uses `visiblePropsFor`)
- [ ] Step 3: Wager Modal
- [ ] Step 4: Resolution UI
