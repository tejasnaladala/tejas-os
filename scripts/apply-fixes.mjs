import fs from "node:fs";

const root = "C:/Users/tejas/OneDrive/Desktop/tejas-os";

// FIX 1: Restore .display class in globals.css so sub-pages don't break
const cssPath = root + "/src/app/globals.css";
let css = fs.readFileSync(cssPath, "utf8");
const cssAnchor = `/* Display nameplate (huge bold mono) */
.nameplate {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--text-primary);
}`;
const cssAdd = `${cssAnchor}

/* Legacy .display alias for sub-pages: bold mono, sane line-height, no uppercase. */
.display {
  font-family: var(--font-display);
  font-weight: 700;
  font-style: normal;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--text-primary);
}
.display em {
  font-style: normal;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}`;
if (!css.includes("Legacy .display alias")) {
  css = css.replace(cssAnchor, cssAdd);
  fs.writeFileSync(cssPath, css);
  console.log("FIX 1: .display class restored.");
}

// FIX 2: Update OG image route text
const ogPath = root + "/src/app/api/og/route.tsx";
if (fs.existsSync(ogPath)) {
  let og = fs.readFileSync(ogPath, "utf8");
  const before = og;
  og = og.replace(/3 VENTURES \/ 3 PAPERS \/ \$2M RAISED/g, "$2M RAISED / 3 PAPERS / 1 PATENT");
  og = og.replace(/3 VENTURES/g, "$2M RAISED");
  if (og !== before) {
    fs.writeFileSync(ogPath, og);
    console.log("FIX 2: OG image text updated.");
  } else {
    console.log("FIX 2: OG text was already clean.");
  }
}

// FIX 3: Demote Parchment from Founder & CTO in editorial Timeline.tsx
const tlPath = root + "/src/components/editorial/Timeline.tsx";
let tl = fs.readFileSync(tlPath, "utf8");
const tlOld = `    label: "Founder & CTO",
    org: "Parchment Labs",
    body:
      "Autonomous research discovery engine. Multi-agent adversarial debate, GPU experiment execution, LaTeX manuscript generation. Currently raising pre-seed.",`;
const tlNew = `    label: "Side Project",
    org: "Parchment Labs",
    body:
      "Autonomous research discovery engine. Multi-agent adversarial debate, GPU experiment execution, LaTeX manuscript generation. Open source.",`;
if (tl.includes(tlOld)) {
  tl = tl.replace(tlOld, tlNew);
  fs.writeFileSync(tlPath, tl);
  console.log("FIX 3: Timeline.tsx Parchment demoted to Side Project.");
}

console.log("Done.");
