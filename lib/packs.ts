/**
 * Premade prop packs — load N props in one tap so a blank Create screen
 * never stops the night. Subjects (the people each prop is about) are
 * left empty when the pack is applied; the user tags friends after.
 */

export type PackVibe =
  | "wingman"
  | "wedding"
  | "office"
  | "sports"
  | "birthday"
  | "afterDark"
  | "cryptoBro";

export type Pack = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  /** True for adult-only packs — UI shows an 18+ chip and a confirm. */
  adult?: boolean;
  vibe: PackVibe;
  props: string[];
};

export const PACKS: Pack[] = [
  {
    id: "pk_wingman",
    name: "The Wingman Pack",
    emoji: "🍻",
    tagline: "Bar crawl chaos and bad decisions.",
    vibe: "wingman",
    props: [
      "Someone gets cut off by the bartender",
      "We end up at McDonald's after 1 AM",
      "Someone loses their phone (and finds it)",
      "There's a tactical chunder before midnight",
      "Someone tries to start a 'one more bar' chant",
      "An Uber gets canceled and re-booked twice",
    ],
  },
  {
    id: "pk_wedding",
    name: "The Wedding Reception Pack",
    emoji: "💍",
    tagline: "Open bar + relatives = inevitable.",
    vibe: "wedding",
    props: [
      "An uncle cries during the speeches",
      "Someone catches the bouquet they didn't want",
      "The DJ plays Mr. Brightside",
      "A child runs onto the dance floor mid-slow-song",
      "Someone proposes to someone else by the end of the night",
      "Best man's speech goes over 5 minutes",
    ],
  },
  {
    id: "pk_office",
    name: "The Office Holiday Party Pack",
    emoji: "🎄",
    tagline: "HR will hear about this on Monday.",
    vibe: "office",
    props: [
      "Someone hits on the wrong person",
      "An exec attempts karaoke",
      "The Secret Santa gift is regifted from last year",
      "The CEO leaves before 9 PM",
      "Someone gets too drunk in front of their manager",
      "There's an awkward photocopier joke (it lands flat)",
    ],
  },
  {
    id: "pk_sports",
    name: "The Watch Party Pack",
    emoji: "🏈",
    tagline: "Game's on. So is the chaos.",
    vibe: "sports",
    props: [
      "Someone yells at the TV like it can hear them",
      "Wings arrive cold",
      "A commercial gets more attention than a play",
      "Someone explains the rules wrong, loudly",
      "There's a bet over who pays for the next round",
    ],
  },
  {
    id: "pk_birthday",
    name: "The Birthday Bash Pack",
    emoji: "🎂",
    tagline: "Candles, chaos, and a missing cake slice.",
    vibe: "birthday",
    props: [
      "The birthday person spills their drink",
      "Someone gets the lyrics to Happy Birthday wrong",
      "A surprise guest actually shows up",
      "The candles are relit at least twice",
      "Someone forgets to bring a gift and pretends otherwise",
    ],
  },
  {
    id: "pk_crypto",
    name: "The Crypto Bro Pack",
    emoji: "💸",
    tagline: "Designed for that one friend.",
    vibe: "cryptoBro",
    props: [
      "Crypto comes up in conversation within the first hour",
      "The phrase 'this time it's different' is uttered",
      "Someone shows their portfolio uninvited",
      "A 'we're so back' is followed by an 'it's so over' the same night",
      "Someone gets stopped from buying ETH at 1 AM",
    ],
  },
  {
    id: "pk_afterdark",
    name: "The After Dark Pack",
    emoji: "🌶️",
    tagline: "Adults-only party bets. No specifics — keep it classy.",
    adult: true,
    vibe: "afterDark",
    props: [
      "Someone gets a phone number tonight",
      "A new flirtation forms by the end of the night",
      "There's a kitchen confession before last call",
      "Someone leaves with someone they didn't arrive with",
      "A dance-floor moment becomes group chat material tomorrow",
      "Someone's ex gets brought up at least twice",
    ],
  },
];

/** Quick lookup. */
export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}
