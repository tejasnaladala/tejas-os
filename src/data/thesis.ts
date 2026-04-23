export interface ThesisEntry {
  number: number;
  title: string;
  body: string;
  accent: "cyan" | "green" | "amber";
}

export const thesisTagline = "I am obsessed with building.";

export const thesisEntries: ThesisEntry[] = [
  {
    number: 1,
    title: "Build or get out of the way",
    body: "Most people aren't really building anything they're just moving pieces around and hoping it looks like progress. The real ones don't wait for permission or validation. Rules are meant to be broken. If what you're building doesn't make something else obsolete its probably not worth it.",
    accent: "cyan",
  },
  {
    number: 2,
    title: "Outwork everyone",
    body: "I don't believe in work-life balance when you're building something from nothing. That's a luxury for people maintaining what someone else already built. Right now it's volume. Ship more, break more, learn faster than your competitor.",
    accent: "green",
  },
  {
    number: 3,
    title: "Failure is not an option",
    body: "People love romanticizing failure like it's some badge of honor. \"We learned so much.\" Fuck no. Your investors lost money, your team lost a year. The market doesn't give participation trophies. Failure is not an option.",
    accent: "amber",
  },
];
