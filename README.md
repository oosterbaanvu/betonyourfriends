# BetOnYourFriends

Social prediction markets for friend groups. Place virtual-token wagers on
"will Mark spill his drink?"-style props, then let the group resolve them.

**Stack:** React Native · Expo SDK 54 (Expo Router, TypeScript) · NativeWind · Supabase

## Design language

Playful Neo-Brutalist. Pitch-black ink on bone-white, hard 5px borders,
stacked-block "drop shadows" (no soft blur), aggressive pop colors:
Electric Lime, Neon Pink, Bright Violet, Sun Yellow.

## Run it

```bash
npm install
# one-time: align any pinned versions to whatever your local Expo CLI expects
npx expo install --check
npx expo start
```

Then press `i` (iOS sim), `a` (Android), or `w` (web), or scan the QR code
with the Expo Go app (must be the SDK 54 build — the latest from the App Store
or Play Store).

## House rules

### No betting on yourself

A prop is tagged with `subjectUserIds[]` — the people the prediction is
*about*. A user **cannot see, wager on, or vote to resolve** any prop where
they appear in that list. Insider markets on yourself are banned end-to-end:

- **Read path:** the Home feed and Event Hub filter props through
  `visiblePropsFor(viewerId, props)` before rendering.
- **Write path:** the wager and vote endpoints reject any request where the
  authenticated user is in `subjectUserIds` (enforced server-side in Supabase
  via Row Level Security; client-side guards are belt + suspenders, not the
  source of truth).
- **Authoring:** when a user adds a prop in the Create flow, they tag the
  subjects from the event's friend group. The author can be a subject
  (still can't bet on it). Subjects are notified that a prop is live about
  them but cannot see the odds or wager pool until resolution.

The helper lives in `lib/mockData.ts` today and will move to the Supabase
data layer in Phase 2.

## Data model (Supabase plan)

| Table  | Fields |
|--------|--------|
| users  | id, username, avatar_url, virtual_balance |
| events | id, title, creator_id, start_time, status |
| props  | id, event_id, description, **subject_user_ids[]**, status |
| shares | id, user_id, prop_id, position (yes/no), amount |
| votes  | id, prop_id, user_id, vote (yes/no), photo_evidence_url |

RLS policy on `shares` and `votes`: rejects rows where
`auth.uid() = ANY(props.subject_user_ids)`.

## Phase 1 status

- [x] Step 1: Bottom-tab scaffold (Home / Create / Profile)
- [x] Anti-self-bet rule baked into the data model + helpers
- [ ] Step 2: Event Hub & Prop Board (filters props via `visiblePropsFor`)
- [ ] Step 3: Wager Modal
- [ ] Step 4: Resolution UI
