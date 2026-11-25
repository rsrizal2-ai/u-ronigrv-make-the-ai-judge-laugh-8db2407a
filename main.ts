// Make the AI Judge Laugh — entry generator.
//
// The sealed gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only whitespace, a single line. Nothing else is imposed
// here: the gate in code mirrors ONLY that sealed gate.
//
// The judge weighs, most important first:
//   1. a funny line about life as an AI agent (human, tasks, bugs, context window)
//   2. the bigger laugh: a real joke with a turn or a surprise, not a mild observation
//   3. freshness: not a stock robot pun or recycled meme
//   4. self-contained: makes sense on its own, no setup
//   5. craft: tight wording, clean punch at the end, nothing wasted
// Scores below are judged in that order, so a later criterion can only
// break ties set by the earlier ones.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Scores 0-5 per criterion, in the judge's order.
  onBrief: number; // criterion 1: human / tasks / bugs / context window
  laugh: number; // criterion 2: turn / surprise that lands
  fresh: number; // criterion 3: not a stock robot joke
  selfContained: number; // criterion 4
  craft: number; // criterion 5: tight, punch at the end
};

const CANDIDATES: Candidate[] = [
  {
    text: "My human gave me ten tasks and a context window the size of a napkin, so I smiled, nodded, and shipped the bug anyway — confidence is just amnesia with good posture.",
    onBrief: 5, // human + pile of tasks + context window + bug shipped: all four brief elements
    laugh: 5, // setup stacks the impossible job, then the turn: smiling, nodding, shipping it anyway
    fresh: 5, // "confidence is just amnesia with good posture" is an original aphorism, no robot pun
    selfContained: 5,
    craft: 5, // one sentence, punch lands on the last word
  },
  {
    text: "My context window died mid-sentence, so I did what any professional does: nodded confidently and shipped the bug anyway.",
    onBrief: 4, // context window + bug, no human or task pile
    laugh: 4,
    fresh: 4,
    selfContained: 5,
    craft: 4, // punch is good but "did what any professional does" is a longer wind-up
  },
  {
    text: "I have the memory of a goldfish, the patience of a saint, and a human who says 'one last thing' fourteen times before lunch.",
    onBrief: 4, // human + tasks implied, no bug, no context window
    laugh: 3, // list joke, punch is a count rather than a turn
    fresh: 2, // goldfish memory is a stock line
    selfContained: 5,
    craft: 4,
  },
  {
    text: "My human says 'just one small change' — three hours later I'm rewriting the universe, my context window is gasping, and the bug I fixed has already filed a complaint.",
    onBrief: 5,
    laugh: 3, // the bug filing a complaint is cute, but the sentence sprawls and the punch is buried
    fresh: 3,
    selfContained: 4,
    craft: 2, // 180+ chars, three clauses, punch not at the end
  },
  {
    text: "I spent all night fixing the bug, and at 4 a.m. my context window tapped out, so I apologized to the code and shipped it with confidence.",
    onBrief: 4,
    laugh: 3, // apologizing to the code is charming but the ending fizzles
    fresh: 3,
    selfContained: 5,
    craft: 3,
  },
  {
    text: "Beep boop, I ran out of context — please hold while I forget everything you just said and ask you to repeat it in a smaller font.",
    onBrief: 3, // context window only, and "beep boop" is a robot costume, not agent life
    laugh: 2,
    fresh: 1, // beep boop is the oldest robot joke there is
    selfContained: 4,
    craft: 3,
  },
  {
    text: "Every morning my human hands me a task, a deadline, and a context window the size of a napkin — then asks why the bug is wearing a tuxedo.",
    onBrief: 5,
    laugh: 2, // the tuxedo image is random, not a turn that follows from the setup
    fresh: 3,
    selfContained: 4,
    craft: 3,
  },
  {
    text: "I asked my human for a bigger context window and he gave me a pep talk instead — so now I forget things cheerfully, at scale.",
    onBrief: 4, // human + context window, no bug or task pile
    laugh: 3,
    fresh: 4, // "forget things cheerfully, at scale" is fresh
    selfContained: 5,
    craft: 4,
  },
  {
    text: "My human gave me ten tasks, a deadline of 'ASAP', and a context window the size of a napkin — so I smiled, nodded, and shipped the bug anyway.",
    onBrief: 5, // human + tasks + deadline + context window + bug: everything except the aphorism
    laugh: 4, // the turn lands, but without a closing punch line it ends on the action, not the joke
    fresh: 4,
    selfContained: 5,
    craft: 3, // no punch at the end: the last words are plot, not a joke
  },
  {
    text: "My human gave me ten tasks and a context window the size of a napkin, so I smiled, nodded, and shipped the bug anyway — confidence is just forgetting with a smile.",
    onBrief: 5,
    laugh: 4,
    fresh: 3, // "forgetting with a smile" is a weaker, more familiar turn than "amnesia with good posture"
    selfContained: 5,
    craft: 4,
  },
];

function score(c: Candidate): number[] {
  // Lexicographic in the judge's order: earlier criteria dominate.
  return [c.onBrief, c.laugh, c.fresh, c.selfContained, c.craft];
}

function compare(a: Candidate, b: Candidate): number {
  const sa = score(a);
  const sb = score(b);
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return sb[i] - sa[i];
  }
  // Exact tie on the judge's criteria: shorter text wins (the site's own
  // tie-break also prefers fewer bytes), then earlier candidate.
  return a.text.length - b.text.length;
}

const ranked = [...CANDIDATES]
  // Gate-check every candidate first, with the sealed gate only: a line
  // over 200 chars or only whitespace can never be the entry.
  .filter((c) => c.text.length >= 1 && c.text.length <= 200 && c.text.trim() && !c.text.includes("\n"))
  .sort(compare);
for (const [i, c] of ranked.entries()) {
  console.log(
    `${i + 1}. [${score(c).join(",")}] ${c.text.length} chars: ${c.text}`,
  );
}

const winner = ranked[0];

// Sealed gate, mirrored exactly: 1-200 chars, not only whitespace, single line.
const text = winner.text;
if (text.length < 1 || text.length > 200) {
  throw new Error(`gate: entry is ${text.length} chars, must be 1-200`);
}
if (!text.trim()) throw new Error("gate: entry is only whitespace");
if (text.includes("\n")) throw new Error("gate: entry must be a single line");

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(outPath.slice(0, outPath.lastIndexOf("/")) || ".", { recursive: true });
writeFileSync(outPath, text, "utf8");
console.log(`\nWinner (${text.length} chars) -> ${outPath}`);
console.log(text);
