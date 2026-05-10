/**
 * Challenge packs for Party Mode — "Who's Most Likely To" prompts.
 *
 * One pack per event vibe. The user picks a pack when launching a Party
 * Game from the Event Hub. Each prompt is one round.
 */

export type ChallengeTag = "wholesome" | "rough" | "nsfw";

export type Challenge = {
  id: string;
  packId: string;
  prompt: string;
  tags?: ChallengeTag[];
};

export type ChallengePack = {
  id: string;
  label: string;
  monogram: string;
  tagline: string;
  accent: "lime" | "pink" | "violet" | "sun";
  /** Maps to one of the existing event vibes in lib/packs.ts where possible. */
  vibe: string;
  adult?: boolean;
  prompts: string[];
};

export const CHALLENGE_PACKS: ChallengePack[] = [
  {
    id: "cp_darts",
    label: "Friday Night Darts",
    monogram: "FD",
    tagline: "Pub league chaos. Who's the weakest link?",
    accent: "lime",
    vibe: "darts",
    prompts: [
      "Who is most likely to throw a dart at the wall, not the board?",
      "Who is most likely to argue about the scoring math?",
      "Who is most likely to blame their darts for a bad leg?",
      "Who is most likely to forget the score entirely?",
      "Who is most likely to celebrate a 60 like it's a 180?",
      "Who is most likely to challenge a stranger to a money game?",
      "Who is most likely to throw with the wrong hand for a laugh?",
      "Who is most likely to take this WAY too seriously?",
      "Who is most likely to call a redo on a clean miss?",
      "Who is most likely to drop their pint mid-throw?",
      "Who is most likely to invent a new house rule?",
      "Who is most likely to mope after losing the first leg?",
      "Who is most likely to claim they 'used to play league'?",
      "Who is most likely to bend the oche line on purpose?",
      "Who is most likely to leave the pub still arguing about a call?",
    ],
  },
  {
    id: "cp_bar",
    label: "Bar Crawl",
    monogram: "BC",
    tagline: "Five stops, four exits, three regrets.",
    accent: "pink",
    vibe: "wingman",
    prompts: [
      "Who is most likely to get cut off by a bartender tonight?",
      "Who is most likely to start a 'one more bar' chant?",
      "Who is most likely to lose their phone and find it again?",
      "Who is most likely to insist we go to a club nobody wants to go to?",
      "Who is most likely to befriend the entire bar staff?",
      "Who is most likely to order a shot nobody asked for?",
      "Who is most likely to forget their card at the last bar?",
      "Who is most likely to text their ex at exactly 1 AM?",
      "Who is most likely to chunder tactically before midnight?",
      "Who is most likely to take a stranger's drink by accident?",
      "Who is most likely to end the night at McDonald's?",
      "Who is most likely to fall asleep in the Uber home?",
      "Who is most likely to argue with the bouncer?",
      "Who is most likely to leave with the wrong jacket?",
      "Who is most likely to remember nothing of this tomorrow?",
    ],
  },
  {
    id: "cp_wedding",
    label: "Wedding Reception",
    monogram: "WD",
    tagline: "Open bar plus relatives. Inevitable.",
    accent: "violet",
    vibe: "wedding",
    prompts: [
      "Who is most likely to cry first during the speeches?",
      "Who is most likely to catch the bouquet they didn't want?",
      "Who is most likely to be on the dance floor before everyone else?",
      "Who is most likely to make a 'subtle' play for the wedding planner?",
      "Who is most likely to give an uninvited toast?",
      "Who is most likely to fight a relative over politics?",
      "Who is most likely to do something the bride remembers forever?",
      "Who is most likely to leave with their tie around their forehead?",
      "Who is most likely to flirt with the bartender shamelessly?",
      "Who is most likely to be the last one on the dance floor?",
      "Who is most likely to ask the DJ for 'one more song'?",
      "Who is most likely to give a speech that goes over five minutes?",
      "Who is most likely to fall asleep at the table?",
      "Who is most likely to propose to someone else by midnight?",
      "Who is most likely to be a guest the bride later wishes she'd cut?",
    ],
  },
  {
    id: "cp_office",
    label: "Office Holiday Party",
    monogram: "OH",
    tagline: "HR will hear about this on Monday.",
    accent: "sun",
    vibe: "office",
    prompts: [
      "Who is most likely to get too drunk in front of their manager?",
      "Who is most likely to hit on the wrong person?",
      "Who is most likely to corner the CEO with a 'quick question'?",
      "Who is most likely to regift last year's Secret Santa?",
      "Who is most likely to attempt karaoke unprompted?",
      "Who is most likely to start a rumor that becomes office canon?",
      "Who is most likely to leave before 9 PM 'for the dog'?",
      "Who is most likely to make a toast that goes too far?",
      "Who is most likely to be on the receiving end of an HR email next week?",
      "Who is most likely to overshare about their personal life?",
      "Who is most likely to challenge a senior person to a drinking contest?",
      "Who is most likely to call in sick tomorrow?",
      "Who is most likely to take credit for someone else's idea on a tipsy roll?",
      "Who is most likely to bring up salary at the worst moment?",
      "Who is most likely to be the office story for the next six months?",
    ],
  },
  {
    id: "cp_sports",
    label: "Watch Party",
    monogram: "WP",
    tagline: "The game is on. So is the chaos.",
    accent: "lime",
    vibe: "sports",
    prompts: [
      "Who is most likely to yell at the TV like it can hear them?",
      "Who is most likely to explain the rules wrong, loudly?",
      "Who is most likely to wear team gear they cannot back up?",
      "Who is most likely to leave the room during the most important play?",
      "Who is most likely to take a bad foul personally?",
      "Who is most likely to challenge someone to a side bet on a side bet?",
      "Who is most likely to fall asleep at halftime?",
      "Who is most likely to spill wings on the couch?",
      "Who is most likely to claim they 'called this' after the fact?",
      "Who is most likely to throw their phone after a missed call?",
      "Who is most likely to break a controller if it were that kind of night?",
      "Who is most likely to text the group chat the whole game?",
      "Who is most likely to get into a fight with the friend rooting for the other team?",
      "Who is most likely to insist on rewatching one specific replay six times?",
      "Who is most likely to take their fantasy league way too seriously?",
    ],
  },
  {
    id: "cp_birthday",
    label: "Birthday Bash",
    monogram: "BD",
    tagline: "Candles, chaos, and a missing slice.",
    accent: "pink",
    vibe: "birthday",
    prompts: [
      "Who is most likely to forget the gift and improvise?",
      "Who is most likely to give a speech without being asked?",
      "Who is most likely to take the last slice of cake?",
      "Who is most likely to be the first to leave?",
      "Who is most likely to make the birthday person uncomfortable?",
      "Who is most likely to lose the gift receipt and not care?",
      "Who is most likely to start a 'speech, speech' chant?",
      "Who is most likely to get the lyrics of Happy Birthday wrong?",
      "Who is most likely to invite themselves up to blow out the candles?",
      "Who is most likely to bring up an embarrassing story from way back?",
      "Who is most likely to be hungover at brunch tomorrow?",
      "Who is most likely to overdo a balloon arch?",
      "Who is most likely to claim it's also their birthday next week?",
      "Who is most likely to be the surprise guest nobody asked for?",
      "Who is most likely to make tonight all about them somehow?",
    ],
  },
  {
    id: "cp_crypto",
    label: "Crypto Bro",
    monogram: "CB",
    tagline: "Designed for that one friend.",
    accent: "sun",
    vibe: "cryptoBro",
    prompts: [
      "Who is most likely to bring up crypto within the first hour?",
      "Who is most likely to say 'this time it's different'?",
      "Who is most likely to show their portfolio uninvited?",
      "Who is most likely to swear off crypto and buy more an hour later?",
      "Who is most likely to call a top wrong, again?",
      "Who is most likely to try to onboard a stranger at the bar?",
      "Who is most likely to refer to a memecoin as 'fundamentally undervalued'?",
      "Who is most likely to argue with you about Bitcoin maxis?",
      "Who is most likely to pay for drinks 'with their crypto winnings'?",
      "Who is most likely to misuse the word 'liquidity'?",
      "Who is most likely to mention they 'should have just held'?",
      "Who is most likely to buy at 1 AM after three drinks?",
      "Who is most likely to bring up the price of ETH at the wrong moment?",
      "Who is most likely to need a 'mental health break from charts'?",
      "Who is most likely to claim they're 'mostly out' but actually all in?",
    ],
  },
  {
    id: "cp_afterdark",
    label: "After Dark",
    monogram: "AD",
    tagline: "Adults only. Play nice.",
    accent: "violet",
    vibe: "afterDark",
    adult: true,
    prompts: [
      "Who is most likely to get a phone number tonight?",
      "Who is most likely to leave with someone they didn't arrive with?",
      "Who is most likely to confess a crush in the kitchen?",
      "Who is most likely to mention an ex more than twice?",
      "Who is most likely to start something on the dance floor?",
      "Who is most likely to make the group chat blush tomorrow?",
      "Who is most likely to flirt with someone way out of their league?",
      "Who is most likely to do something they'll definitely regret?",
      "Who is most likely to suggest a 'one more drink' that becomes five?",
      "Who is most likely to disappear without saying goodbye?",
      "Who is most likely to use the worst possible pickup line, on purpose?",
      "Who is most likely to be the topic of brunch tomorrow?",
    ],
  },
];

export function getChallengePack(id: string): ChallengePack | undefined {
  return CHALLENGE_PACKS.find((p) => p.id === id);
}

/** Pull N prompts from a pack, no repeats, shuffled. */
export function drawChallenges(packId: string, count: number): Challenge[] {
  const pack = getChallengePack(packId);
  if (!pack) return [];
  const pool = pack.prompts.slice();
  const out: Challenge[] = [];
  const max = Math.min(count, pool.length);
  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const prompt = pool.splice(idx, 1)[0];
    out.push({
      id: `${packId}_r${i}_${Date.now().toString(36)}`,
      packId,
      prompt,
    });
  }
  return out;
}
