export interface ThesisEntry {
  number: number;
  title: string;
  body: string;
  accent: "cyan" | "green" | "amber";
}

export const thesisEntries: ThesisEntry[] = [
  {
    number: 1,
    title: "Hardware is the hardest problem",
    body: "Atoms don't compile. When you burn a PCB trace at 2am, there's no undo button and no Stack Overflow answer. Software engineers get infinite retries — hardware engineers get one shot at a $180K production unit. That constraint breeds a different kind of builder, one who thinks in tolerances, thermal gradients, and failure modes before writing a single line of code. If you can ship hardware, software feels like easy mode.",
    accent: "cyan",
  },
  {
    number: 2,
    title: "Build with your hands before you build with code",
    body: "Machining a venturi nozzle to ±0.01mm tolerance or waterproofing an electronics enclosure to 100m depth — these aren't abstractions. They're the reason my software ships with fewer assumptions baked in. Every engineer should solder a board, blow a MOSFET, and debug a signal with an oscilloscope at least once. Physical constraints make you a better thinker everywhere else.",
    accent: "green",
  },
  {
    number: 3,
    title: "The best engineers are founders",
    body: "Engineering is not about elegant code — it's about solving problems real people will pay real money for. The moment you have a customer, everything changes: your abstractions get stress-tested, your edge cases become production bugs, and your architecture decisions have dollar signs attached. I don't trust engineers who've never had to ship something with their name on the invoice.",
    accent: "amber",
  },
  {
    number: 4,
    title: "Ship fast, but ship right",
    body: "Plasma reactors don't forgive sloppy work. Neither should software. Speed and correctness aren't opposites — they're both outcomes of clear thinking. Prototype recklessly in the lab. Spec rigorously before production. Know which phase you're in. The founders who confuse these two phases are the ones who blow deadlines and budgets.",
    accent: "cyan",
  },
  {
    number: 5,
    title: "Open-source compounds",
    body: "Forge hit 150 clones in week one because the framework was free. The knowledge compounds in public — contributors find bugs you missed, adoption creates distribution, and the community you build becomes infrastructure. Give away your frameworks. Keep your competitive insight. The moat is never the code — it's the taste, the speed, and the network you build around it.",
    accent: "green",
  },
  {
    number: 6,
    title: "Research without product is tourism",
    body: "I've published three papers and worked in two research labs. The work mattered most when it connected to a deployed system — when a plasma physics paper became a $180K production unit, when a signal processing technique became a real-time wearable. Papers are credentials. Products are proof. Do both, but know which one actually changes anything.",
    accent: "amber",
  },
];
