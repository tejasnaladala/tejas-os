export interface ThesisEntry {
  number: number;
  title: string;
  body: string;
  accent: "cyan" | "green" | "amber";
}

export const thesisEntries: ThesisEntry[] = [
  {
    number: 1,
    title: "Atoms don't have a backspace key",
    body: "Software engineers get infinite retries. I get one shot at a $80K plasma reactor — burn a trace at 2am and it's scrap metal, not a rollback. That constraint breeds a different kind of builder, one who thinks in failure modes before features. If you can ship hardware, software is easy mode.",
    accent: "cyan",
  },
  {
    number: 2,
    title: "No customers, no opinion",
    body: "Three ventures before graduating — not side projects, ventures with invoices and people depending on the thing actually working. Engineering isn't elegant abstractions. It's solving problems someone will pay real money for. If you've never shipped with your name on the line, you're practicing.",
    accent: "green",
  },
  {
    number: 3,
    title: "Prototype like a maniac. Produce like a surgeon.",
    body: "I'll hack a proof of concept in a weekend and spend weeks specifying it for production. Plasma reactors don't forgive sloppy work and neither do customers. Speed and rigor aren't opposites — they're both outcomes of knowing which phase you're in.",
    accent: "amber",
  },
  {
    number: 4,
    title: "Research that never ships is tourism",
    body: "Three papers. Two labs. The work I'm proudest of left the building. Plasma physics became a $80K production unit. Signal processing became a real-time wearable. Papers are credentials. Products are proof.",
    accent: "cyan",
  },
];
