import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { archiveEntries, aboutNarrative, angelProfile } from "../content.js";
import { profile } from "../data/profile.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE = profile.canonicalUrl;
const PERSON_ID = profile.identity.canonicalId;
const SOCIAL_IMAGE = profile.identity.socialImage ?? profile.identity.image;
const ASSET_VERSION = "20260901.108";
const PUBLISHED_STORY_IDS = new Set(["nespresso-jailbreak", "wifi-cantenna"]);
const stories = archiveEntries.filter((story) => PUBLISHED_STORY_IDS.has(story.id));

const organizationMap = new Map(profile.organizations.map((organization) => [organization.id, organization]));
const evidenceMap = new Map(profile.evidence.map((evidence) => [evidence.id, evidence]));

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const escapeXml = escapeHtml;
const jsonForHtml = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

function organization(id) {
  const value = organizationMap.get(id);
  if (!value) throw new Error(`Unknown organization: ${id}`);
  return value;
}

function evidence(id) {
  const value = evidenceMap.get(id);
  if (!value) throw new Error(`Unknown evidence: ${id}`);
  return value;
}

function monthLabel(value) {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  if (!month) return year;
  const label = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(`${year}-${month}-01T00:00:00Z`),
  );
  return `${label} ${year}`;
}

function dateRange(item) {
  return `${monthLabel(item.startDate)} - ${monthLabel(item.endDate)}`;
}

function markdownLink(label, url) {
  return url ? `[${label}](${url})` : label;
}

function markdownBullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function plainRichText(value) {
  if (Array.isArray(value)) return value.map(plainRichText).join("");
  if (value && typeof value === "object") {
    if (value.content) return plainRichText(value.content);
    if (value.text) return value.text;
    return "";
  }
  return String(value ?? "");
}

function markdownRecord(title, subtitle, dates, details, url = null) {
  return [
    `## ${markdownLink(title, url)}`,
    subtitle ? `**${subtitle}**` : "",
    dates ? dates : "",
    "",
    markdownBullets(details),
  ]
    .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""))
    .join("\n")
    .trim();
}

function buildWorkMarkdown() {
  return [
    "# Work - Tejas Naladala",
    "",
    "> All that fucking around led me to some problems I took personally.",
    "",
    `Canonical profile: ${SITE}/profile.json`,
    `Last updated: ${profile.lastUpdated}`,
    "",
    ...profile.experience.flatMap((item) => {
      const org = organization(item.organizationId);
      return [markdownRecord(org.name, item.role, dateRange(item), item.contributions, org.url), ""];
    }),
  ].join("\n").trim() + "\n";
}

function buildResearchMarkdown() {
  const sections = [
    "# Research - Tejas Naladala",
    "",
    "> I wrote down the answers that held up.",
    "",
    `Canonical profile: ${SITE}/profile.json`,
    `Last updated: ${profile.lastUpdated}`,
    "",
    "## Research",
    "",
  ];

  for (const item of profile.research) {
    sections.push(
      `### ${item.title}`,
      `**Question:** ${item.question}`,
      `**Dates:** ${dateRange(item)}`,
      `**Status:** ${item.status.replaceAll("_", " ")}`,
      "",
      markdownBullets(item.contributions),
      "",
      `**Current result:** ${item.result}`,
      `**Boundary:** ${item.limitation}`,
      "",
      `Evidence: ${item.evidenceIds.map((id) => markdownLink(evidence(id).title, evidence(id).url)).join("; ")}`,
      "",
    );
  }

  sections.push("## Technical notes", "");
  for (const item of profile.technicalReports) {
    sections.push(
      `### ${markdownLink(item.title, item.url)}`,
      `${markdownLink(`Professor ${item.advisor.name}`, item.advisor.url)}, ${organization(item.advisor.organizationId).name}.`,
      `${dateRange(item)}. ${item.status.replaceAll("_", " ")}.`,
      "",
      markdownBullets(item.contributions),
      "",
    );
  }

  sections.push("## Peer-reviewed publications", "");
  for (const item of profile.publications) {
    sections.push(
      `### ${markdownLink(item.title, item.url)}`,
      `${item.authors.join(", ")}. ${item.venue} ${item.volumeIssuePages}. Published ${item.publicationDate}.`,
      "",
    );
  }

  sections.push(
    `Citation snapshot: ${profile.publicationMetrics.citations} citations and h-index ${profile.publicationMetrics.hIndex} as of ${profile.publicationMetrics.asOf}.`,
    "",
    "## Other systems",
    "",
  );
  for (const item of profile.projects.filter((project) => project.status === "public_repository")) {
    sections.push(`- ${markdownLink(item.title, item.url)}: ${item.summary}`);
  }

  return sections.join("\n").trim() + "\n";
}

function buildProfileOverviewMarkdown() {
  const current = profile.experience.filter((item) => item.current);
  const activeResearch = profile.research.filter((item) => item.status === "in_progress");
  return [
    "# Tejas Naladala",
    "",
    `> ${profile.identity.headline}`,
    "",
    profile.identity.shortBio,
    "",
    `- Location: ${profile.identity.location}`,
    `- Email: [${profile.identity.publicEmail}](${profile.identity.contactUrl})`,
    `- GitHub: ${profile.identity.externalProfiles.github}`,
    `- LinkedIn: ${profile.identity.externalProfiles.linkedin}`,
    `- Google Scholar: ${profile.identity.externalProfiles.googleScholar}`,
    `- Canonical machine record: ${SITE}/profile.json`,
    `- Last updated: ${profile.lastUpdated}`,
    "",
    "## Current work",
    "",
    ...current.map((item) => {
      const org = organization(item.organizationId);
      return `- ${item.role}, ${markdownLink(org.name, org.url)} (${dateRange(item)}): ${item.summary}`;
    }),
    ...profile.education.map((item) => {
      const org = organization(item.institutionId);
      return `- ${item.field} student, ${markdownLink(org.name, org.url)} (${dateRange(item)}${item.expectedEndDate ? ", expected" : ""})`;
    }),
    ...activeResearch.map((item) => `- ${item.title} (${statusLabel(item.status)}): ${item.question}`),
    "",
    "## Education",
    "",
    ...profile.education.map((item) => {
      const org = organization(item.institutionId);
      return `- ${item.field}, ${markdownLink(org.name, org.url)} (${dateRange(item)}${item.expectedEndDate ? ", expected" : ""})`;
    }),
    "",
    "## Research interests",
    "",
    markdownBullets(profile.identity.professionalInterests),
    "",
    "## Evidence policy",
    "",
    "Claims in profile.json identify their evidence, evidence tier, confidence, and current status. In-progress research keeps its limitations in the record. Missing evidence is not treated as proof.",
  ].join("\n").trim() + "\n";
}

function statusLabel(value) {
  return String(value ?? "not publicly specified").replaceAll("_", " ");
}

function evidenceLinks(ids = []) {
  return ids.length
    ? ids.map((id) => markdownLink(evidence(id).title, evidence(id).url)).join("; ")
    : "No public evidence is listed.";
}

function skillNames(ids = []) {
  const names = new Map(profile.skills.map((item) => [item.id, item.name]));
  return ids.map((id) => names.get(id) ?? id).join(", ");
}

function entityLabel(id) {
  if (id === profile.identity.id) return profile.identity.name;
  const org = profile.organizations.find((item) => item.id === id);
  if (org) return org.name;
  const education = profile.education.find((item) => item.id === id);
  if (education) return `${education.field} at ${organization(education.institutionId).name}`;
  const experience = profile.experience.find((item) => item.id === id);
  if (experience) return `${experience.role} at ${organization(experience.organizationId).name}`;
  const item = [
    ...profile.research,
    ...profile.technicalReports,
    ...profile.publications,
    ...profile.projects,
    ...profile.awards,
    ...profile.programs,
    ...profile.writing,
  ].find((entry) => entry.id === id);
  return item?.title ?? item?.name ?? id;
}

function buildProfileMarkdown() {
  const lines = [
    "# Tejas Naladala",
    "",
    `> ${profile.identity.headline}`,
    "",
    `Last updated: ${profile.lastUpdated}`,
    `Schema version: ${profile.schemaVersion}`,
    `Canonical identity: ${PERSON_ID}`,
    `Canonical JSON: ${SITE}/profile.json`,
    "",
    "## Identity",
    "",
    profile.identity.shortBio,
    "",
    `- Location: ${profile.identity.location}`,
    `- Email: [${profile.identity.publicEmail}](${profile.identity.contactUrl})`,
    `- Current focus: ${profile.identity.currentFocus.join(", ")}`,
    "",
    "## Current work",
    "",
  ];

  for (const item of profile.experience.filter((entry) => entry.current)) {
    const org = organization(item.organizationId);
    lines.push(`- ${item.role}, ${markdownLink(org.name, org.url)} (${dateRange(item)}): ${item.summary}`);
  }

  for (const item of profile.education) {
    const org = organization(item.institutionId);
    lines.push(`- ${item.field} student, ${markdownLink(org.name, org.url)} (${dateRange(item)}${item.expectedEndDate ? ", expected" : ""})`);
  }

  for (const item of profile.research.filter((entry) => entry.status === "in_progress")) {
    lines.push(`- ${item.title} (${statusLabel(item.status)}): ${item.question}`);
  }

  lines.push("", "## Experience", "");
  for (const item of profile.experience) {
    const org = organization(item.organizationId);
    lines.push(
      `### ${markdownLink(org.name, org.url)}`,
      `- Stable ID: \`${item.id}\``,
      `- Role: ${item.role}`,
      `- Dates: ${dateRange(item)}`,
      `- Current: ${item.current ? "yes" : "no"}`,
      `- Summary: ${item.summary}`,
      `- Demonstrates: ${skillNames(item.demonstrates)}`,
      "",
      "Contributions:",
      "",
      markdownBullets(item.contributions),
      "",
      `Evidence: ${evidenceLinks(item.evidenceIds)}`,
      "",
    );
  }

  lines.push("## Education", "");
  for (const item of profile.education) {
    const org = organization(item.institutionId);
    lines.push(
      `### ${markdownLink(org.name, org.url)}`,
      `- Stable ID: \`${item.id}\``,
      `- Field: ${item.field}`,
      `- Dates: ${dateRange(item)}${item.expectedEndDate ? " (expected end)" : ""}`,
      `- Credential: ${item.credential ?? "not publicly specified"}`,
      "",
      markdownBullets(item.details),
      "",
      `Evidence: ${evidenceLinks(item.evidenceIds)}`,
      "",
    );
  }

  lines.push("## Research", "");
  for (const item of profile.research) {
    lines.push(
      `### ${item.title}`,
      `- Stable ID: \`${item.id}\``,
      `- Role: ${item.role}`,
      `- Type: ${item.researchType}`,
      `- Status: ${statusLabel(item.status)}`,
      `- Dates: ${dateRange(item)}`,
      `- Organizations: ${item.organizationIds.map((id) => organization(id).name).join(", ") || "not publicly specified"}`,
      `- Research question: ${item.question}`,
      `- Demonstrates: ${skillNames(item.demonstrates)}`,
      "",
      "Contributions:",
      "",
      markdownBullets(item.contributions),
      "",
      `Current result: ${item.result}`,
      `Limitation: ${item.limitation}`,
      `Evidence: ${evidenceLinks(item.evidenceIds)}`,
      "",
    );
  }

  lines.push("## Technical reports", "");
  for (const item of profile.technicalReports) {
    lines.push(
      `### ${markdownLink(item.title, item.url)}`,
      `- Stable ID: \`${item.id}\``,
      `- Status: ${statusLabel(item.status)}`,
      `- Dates: ${dateRange(item)}`,
      `- Advisor: ${markdownLink(`Professor ${item.advisor.name}`, item.advisor.url)}, ${organization(item.advisor.organizationId).name}`,
      `- Summary: ${item.summary}`,
      `- Demonstrates: ${skillNames(item.demonstrates)}`,
      "",
      markdownBullets(item.contributions),
      "",
      `Evidence: ${evidenceLinks(item.evidenceIds)}`,
      "",
    );
  }

  lines.push("## Peer-reviewed publications", "");
  for (const item of profile.publications) {
    lines.push(
      `### ${markdownLink(item.title, item.url)}`,
      `- Stable ID: \`${item.id}\``,
      `- Authors: ${item.authors.join(", ")}`,
      `- Tejas authorship position: ${item.authorshipPosition}`,
      `- Venue: ${item.venue} ${item.volumeIssuePages}`,
      `- Published: ${item.publicationDate}`,
      `- Status: ${item.status}; peer reviewed: ${item.peerReviewed ? "yes" : "no"}`,
      `- DOI: ${item.doi}`,
      "",
    );
  }
  lines.push(
    `Citation snapshot: ${profile.publicationMetrics.citations} citations and h-index ${profile.publicationMetrics.hIndex} as of ${profile.publicationMetrics.asOf}.`,
    "",
    "## Patents",
    "",
    `- Count: ${profile.patents.count}`,
    `- Status: ${profile.patents.status}`,
    `- Public details: ${profile.patents.publicDetails ? "yes" : "no"}`,
    `- Note: ${profile.patents.note}`,
    `- Evidence: ${evidenceLinks(profile.patents.evidenceIds)}`,
    "",
    "## Selected projects",
    "",
  );

  for (const item of profile.projects) {
    lines.push(
      `### ${markdownLink(item.title, item.url)}`,
      `- Stable ID: \`${item.id}\``,
      `- Role: ${item.role}`,
      `- Status: ${statusLabel(item.status)}`,
      ...(item.startDate ? [`- Dates: ${dateRange(item)}`] : []),
      `- Summary: ${item.summary}`,
      `- Demonstrates: ${skillNames(item.demonstrates)}`,
      ...(item.contributions?.length ? ["", markdownBullets(item.contributions)] : []),
      "",
      `Evidence: ${evidenceLinks(item.evidenceIds)}`,
      "",
    );
  }

  lines.push("## Awards and programs", "");
  for (const item of profile.awards) {
    lines.push(`- ${item.name}: ${item.result} (${item.date})${item.metric ? `; ${item.metric}` : ""}. Evidence: ${evidenceLinks(item.evidenceIds)}`);
  }
  for (const item of profile.programs) {
    lines.push(`- ${item.name}${item.date ? ` (${item.date})` : ""}; associated with ${entityLabel(item.associatedEntityId)}.`);
  }

  lines.push("", "## Skill evidence", "");
  for (const item of profile.skills) {
    lines.push(`- ${item.name} [${item.category}]: ${item.demonstratedBy.map(entityLabel).join("; ")}`);
  }

  lines.push("", "## Claim and evidence register", "");
  for (const item of profile.claims) {
    lines.push(`- ${item.text} Subject: ${entityLabel(item.subjectId)}. Confidence: ${statusLabel(item.confidence)}. Evidence tier: ${item.evidenceTier}. Evidence: ${evidenceLinks(item.evidenceIds)}`);
  }

  lines.push("", "## Writing", "");
  for (const item of profile.writing) {
    lines.push(`- ${markdownLink(item.title, item.url)} (${item.readingTime}); [Markdown](${item.markdownUrl})`);
  }

  lines.push(
    "",
    "## External identity",
    "",
    `- Website: ${SITE}`,
    `- GitHub: ${profile.identity.externalProfiles.github}`,
    `- LinkedIn: ${profile.identity.externalProfiles.linkedin}`,
    `- Google Scholar: ${profile.identity.externalProfiles.googleScholar}`,
    `- Complete CV: ${profile.contact.resume}`,
    "",
    "## Known uncertainties",
    "",
    markdownBullets(profile.provenance.unresolved),
    "",
    "## Evidence policy",
    "",
    "Claims in profile.json identify evidence type, tier, confidence, and provenance. In-progress research includes its current limitation. Organization pages establish the organization unless the evidence description explicitly supports a personal contribution.",
  );

  return lines.join("\n").trim() + "\n";
}

function buildAboutMarkdown() {
  const allParagraphs = [
    ...aboutNarrative.roots,
    ...aboutNarrative.education,
    ...aboutNarrative.stage,
    aboutNarrative.freedomIntro,
  ];
  return [
    "# About Tejas Naladala",
    "",
    "> I hate following most social norms. I suck at doing things the conventional way.",
    "",
    ...allParagraphs.flatMap((paragraph) => [plainRichText(paragraph), ""]),
    "## Freedom",
    "",
    ...aboutNarrative.freedom.map((line, index) => `${index + 1}. ${line}`),
    "",
    plainRichText(aboutNarrative.freedomClose),
    "",
    ...aboutNarrative.builds.flatMap((paragraph) => [plainRichText(paragraph), ""]),
    ...aboutNarrative.questions.flatMap((paragraph) => [plainRichText(paragraph), ""]),
    ...aboutNarrative.ending.map(plainRichText),
    "",
    "- Tejas Naladala",
  ].join("\n").trim() + "\n";
}

function buildInvestingMarkdown() {
  return [
    "# Investing - Tejas Naladala",
    "",
    angelProfile.lead,
    "",
    `I write checks of $5K-$30K into very early, exceptional teams building in ${angelProfile.thesis.map((item) => item.label).join(", ")}.`,
    "",
    angelProfile.scorecardIntro,
    "",
    ...angelProfile.signals.map((signal) => `- ${signal.label}: ${signal.score}`),
    "",
    ...angelProfile.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    angelProfile.referral,
    "",
    `[Send the company](${profile.contact.pitch})`,
  ].join("\n").trim() + "\n";
}

function storyText(block) {
  if (block.text) return block.text;
  if (block.lines) return block.lines.join("\n\n");
  if (block.items) return markdownBullets(block.items);
  return "";
}

function buildStoryMarkdown(story) {
  const body = story.blocks
    .filter((block) => block.type !== "doodle")
    .map((block) => (block.type === "section-heading" ? `## ${block.text}` : storyText(block)))
    .join("\n\n");
  return [
    `# ${story.title}`,
    "",
    `> ${story.teaser}`,
    "",
    story.readingTime,
    "",
    body,
    "",
    `[Back to Unsupervised](${SITE}/blog)`,
  ].join("\n").trim() + "\n";
}

function buildBlogMarkdown() {
  return [
    "# Blog: \"Un\"Supervised",
    "",
    "> Questionable decisions and the parts that feel most like me.",
    "",
    ...stories.flatMap((story) => [
      `## [${story.title}](${SITE}/blog/${story.id})`,
      "",
      story.teaser,
      "",
      story.readingTime,
      "",
    ]),
    "## The Pavlov'd Fish",
    "",
    "Work in progress.",
  ].join("\n").trim() + "\n";
}

function buildCvMarkdown() {
  return [
    "# Tejas Naladala - CV",
    "",
    buildProfileOverviewMarkdown().replace(/^# Tejas Naladala\s+/, ""),
    "## Experience",
    "",
    buildWorkMarkdown().replace(/^# Work - Tejas Naladala[\s\S]*?Last updated: [^\n]+\n+/, ""),
    "## Research and publications",
    "",
    buildResearchMarkdown().replace(/^# Research - Tejas Naladala[\s\S]*?Last updated: [^\n]+\n+/, ""),
    "## Awards",
    "",
    ...profile.awards.map((item) => `- ${item.name}: ${item.result} (${item.date})${item.metric ? `; ${item.metric}` : ""}`),
    "",
    `PDF: ${profile.contact.resume}`,
  ].join("\n").trim() + "\n";
}

function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.identity.name,
    givenName: profile.identity.givenName,
    familyName: profile.identity.familyName,
    url: SITE,
    image: profile.identity.image,
    email: `mailto:${profile.identity.publicEmail}`,
    description: profile.identity.shortBio,
    homeLocation: { "@type": "Place", name: profile.identity.location },
    sameAs: Object.values(profile.identity.externalProfiles),
    knowsAbout: profile.identity.professionalInterests,
    worksFor: profile.experience
      .filter((item) => item.current)
      .map((item) => ({ "@id": `${SITE}/#${organization(item.organizationId).id.replace(":", "-")}` })),
    affiliation: [{ "@id": `${SITE}/#org-uw` }],
  };
}

function organizationJsonLd(item) {
  return {
    "@type": item.kind === "educational_organization" ? "CollegeOrUniversity" : "Organization",
    "@id": `${SITE}/#${item.id.replace(":", "-")}`,
    name: item.name,
    ...(item.url ? { url: item.url } : {}),
    ...(item.aliases.length ? { alternateName: item.aliases } : {}),
  };
}

function pageJsonLd({ route, title, description, type = "WebPage" }) {
  const url = `${SITE}${route === "/" ? "/" : route}`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: profile.identity.name,
      author: { "@id": PERSON_ID },
      inLanguage: "en-US",
    },
    personJsonLd(),
    ...profile.organizations.map(organizationJsonLd),
    {
      "@type": type,
      "@id": `${url}#page`,
      url,
      name: title,
      description,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      dateModified: profile.lastUpdated,
      inLanguage: "en-US",
    },
  ];

  if (route === "/work") {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#experience`,
      name: "Professional experience",
      itemListElement: profile.experience.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Role",
          "@id": `${url}#${item.id.replace(":", "-")}`,
          roleName: item.role,
          startDate: item.startDate,
          ...(item.endDate ? { endDate: item.endDate } : {}),
          member: { "@id": PERSON_ID },
          memberOf: { "@id": `${SITE}/#${item.organizationId.replace(":", "-")}` },
          description: item.summary,
        },
      })),
    });
  }

  if (route === "/research") {
    for (const item of profile.research) {
      graph.push({
        "@type": "ResearchProject",
        "@id": `${url}#${item.id.replace(":", "-")}`,
        name: item.title,
        description: `${item.question} ${item.result} Boundary: ${item.limitation}`,
        startDate: item.startDate,
        ...(item.endDate ? { endDate: item.endDate } : {}),
        member: { "@id": PERSON_ID },
        subjectOf: item.evidenceIds.map((id) => ({ "@type": "CreativeWork", name: evidence(id).title, url: evidence(id).url })),
      });
    }
    for (const item of profile.publications) {
      graph.push({
        "@type": "ScholarlyArticle",
        "@id": item.url,
        headline: item.title,
        author: item.authors.map((name) =>
          name === profile.identity.name ? { "@id": PERSON_ID } : { "@type": "Person", name },
        ),
        datePublished: item.publicationDate,
        isPartOf: { "@type": "Periodical", name: item.venue },
        url: item.url,
      });
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function discoveryBlock(config) {
  const markdownUrl = `${SITE}${config.markdown}`;
  return `<!-- agent:head:start -->
    <meta name="author" content="Tejas Naladala" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <link rel="alternate" type="text/markdown" href="${escapeHtml(markdownUrl)}" title="${escapeHtml(config.title)} in Markdown" />
    <link rel="describedby" type="text/markdown" href="${SITE}/llms.txt" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="alternate" type="application/atom+xml" href="${SITE}/feed.xml" title="Unsupervised" />
    <meta property="og:site_name" content="Tejas Naladala" />
    <meta property="og:image:secure_url" content="${SOCIAL_IMAGE}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Tejas Naladala, engineer, researcher, entrepreneur, and angel investor" />
    <meta name="twitter:title" content="${escapeHtml(config.title)}" />
    <meta name="twitter:description" content="${escapeHtml(config.description)}" />
    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />
    <meta name="twitter:image:alt" content="Tejas Naladala, engineer, researcher, entrepreneur, and angel investor" />
    <script type="application/ld+json">${jsonForHtml(pageJsonLd(config))}</script>
    <!-- agent:head:end -->`;
}

function addOrReplaceHead(html, config) {
  const block = discoveryBlock(config);
  const marker = /\s*<!-- agent:head:start -->[\s\S]*?<!-- agent:head:end -->/;
  if (marker.test(html)) return html.replace(marker, `\n    ${block}`);
  return html.replace("  </head>", `    ${block}\n  </head>`);
}

function plainList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function recordFallback(item, name, role) {
  return `<section><h2>${escapeHtml(name)}</h2><p><strong>${escapeHtml(role)}</strong></p><p><time datetime="${escapeHtml(item.startDate)}">${escapeHtml(dateRange(item))}</time></p>${plainList(item.contributions)}</section>`;
}

function workFallback() {
  return `<article class="agent-readable" aria-label="Professional experience">${profile.experience
    .map((item) => recordFallback(item, organization(item.organizationId).name, item.role))
    .join("")}</article>`;
}

function researchFallback() {
  const studies = profile.research
    .map(
      (item) => `<section><h3>${escapeHtml(item.title)}</h3><p><strong>${escapeHtml(item.question)}</strong></p><p><time datetime="${escapeHtml(item.startDate)}">${escapeHtml(dateRange(item))}</time></p>${plainList(item.contributions)}<p><strong>Current result:</strong> ${escapeHtml(item.result)}</p><p><strong>Boundary:</strong> ${escapeHtml(item.limitation)}</p></section>`,
    )
    .join("");
  const reports = profile.technicalReports
    .map((item) => `<section><h3>${escapeHtml(item.title)}</h3><p>Advised by Professor ${escapeHtml(item.advisor.name)} at ${escapeHtml(organization(item.advisor.organizationId).name)}.</p>${plainList(item.contributions)}</section>`)
    .join("");
  const publications = profile.publications
    .map((item) => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>, ${escapeHtml(item.venue)}, ${escapeHtml(item.publicationDate.slice(0, 4))}</li>`)
    .join("");
  return `<article class="agent-readable" aria-label="Research record"><h2>Research</h2>${studies}<h2>Technical notes</h2>${reports}<h2>Published record</h2><p>Three peer-reviewed papers, ${profile.publicationMetrics.citations} citations, and an h-index of ${profile.publicationMetrics.hIndex} as of ${escapeHtml(profile.publicationMetrics.asOf)}.</p><ol>${publications}</ol></article>`;
}

function aboutFallback() {
  return `<article class="agent-readable" aria-label="About Tejas Naladala"><h2>I'm 19. I build and research full-time.</h2>${[
    ...aboutNarrative.roots,
    ...aboutNarrative.education,
    ...aboutNarrative.stage,
    aboutNarrative.freedomIntro,
  ].map((text) => `<p>${escapeHtml(plainRichText(text))}</p>`).join("")}<h2>Freedom</h2>${plainList(aboutNarrative.freedom.map(plainRichText))}<p>${escapeHtml(plainRichText(aboutNarrative.freedomClose))}</p>${aboutNarrative.builds.map((text) => `<p>${escapeHtml(plainRichText(text))}</p>`).join("")}${aboutNarrative.questions.map((text) => `<p>${escapeHtml(plainRichText(text))}</p>`).join("")}<p>${escapeHtml(aboutNarrative.ending.map(plainRichText).join(" "))}</p><p><strong>- Tejas Naladala</strong></p></article>`;
}

function investingFallback() {
  return `<article class="agent-readable" aria-label="Angel investing"><p>${escapeHtml(angelProfile.lead)}</p><p>I write checks of $5K-$30K into very early, exceptional teams building in ${escapeHtml(angelProfile.thesis.map((item) => item.label).join(", "))}.</p><p>${escapeHtml(angelProfile.scorecardIntro)}</p><dl>${angelProfile.signals.map((signal) => `<div><dt>${escapeHtml(signal.label)}</dt><dd>${escapeHtml(signal.score)}</dd></div>`).join("")}</dl>${angelProfile.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}<p>${escapeHtml(angelProfile.referral)}</p><p><a href="${escapeHtml(profile.contact.pitch)}">Send the company</a></p></article>`;
}

function blogFallback() {
  return `<section class="agent-readable" aria-label="Unsupervised stories">${stories.map((story) => `<article><h2><a href="/blog/${escapeHtml(story.id)}">${escapeHtml(story.title)}</a></h2><p>${escapeHtml(story.teaser)}</p><p>${escapeHtml(story.readingTime)}</p></article>`).join("")}<article><h2>The Pavlov'd Fish</h2><p>Work in progress.</p></article></section>`;
}

function cvFallback() {
  return `<article class="agent-readable" aria-label="CV summary"><p>${escapeHtml(profile.identity.shortBio)}</p><h2>Experience</h2>${profile.experience.map((item) => `<p><strong>${escapeHtml(organization(item.organizationId).name)}</strong>, ${escapeHtml(item.role)}, ${escapeHtml(dateRange(item))}</p>`).join("")}<h2>Research</h2>${profile.research.map((item) => `<p><strong>${escapeHtml(item.title)}</strong>: ${escapeHtml(item.question)}</p>`).join("")}<p><a href="${escapeHtml(profile.contact.resume.replace(SITE, ""))}">View the complete CV (PDF)</a></p></article>`;
}

function addOrReplaceFallback(html, fallback) {
  const block = `<!-- agent:content:start --><noscript>${fallback}</noscript><!-- agent:content:end -->`;
  const marker = /\s*<!-- agent:content:start -->[\s\S]*?<!-- agent:content:end -->/;
  if (marker.test(html)) return html.replace(marker, `\n      ${block}`);
  return html.replace(/(<div class="page-content" id="pageContent"><\/div>)/, `$1\n      ${block}`);
}

function renderStoryHtmlBlock(block) {
  if (block.type === "doodle") return "";
  if (block.type === "section-heading") return `<h2 class="story-entry__section-heading">${escapeHtml(block.text)}</h2>`;
  if (block.type === "list") return `<ul class="story-entry__list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  if (block.lines) return `<div>${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  if (block.type === "pullquote" || block.type === "question") return `<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`;
  return `<p>${escapeHtml(block.text)}</p>`;
}

function storyJsonLd(story) {
  const url = `${SITE}/blog/${story.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: story.title,
        description: story.teaser,
        author: { "@id": PERSON_ID },
        dateModified: profile.lastUpdated,
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "Unsupervised" },
        mainEntityOfPage: { "@id": `${url}#page` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: `${story.title} | Unsupervised`,
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": `${url}#article` },
      },
    ],
  };
}

function buildStoryHtml(story) {
  const title = `${story.title} | Unsupervised`;
  const route = `/blog/${story.id}`;
  const body = story.blocks.map(renderStoryHtmlBlock).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f4f1e8" />
    <meta name="description" content="${escapeHtml(story.teaser)}" />
    <meta name="author" content="Tejas Naladala" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
    <link rel="icon" href="/favicon-reactor.svg?v=${ASSET_VERSION}" type="image/svg+xml" />
    <link rel="canonical" href="${SITE}${route}" />
    <link rel="alternate" type="text/markdown" href="${SITE}${route}.md" title="${escapeHtml(title)} in Markdown" />
    <link rel="describedby" type="text/markdown" href="${SITE}/llms.txt" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Tejas Naladala" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(story.teaser)}" />
    <meta property="og:url" content="${SITE}${route}" />
    <meta property="og:image" content="${SOCIAL_IMAGE}" />
    <meta property="og:image:secure_url" content="${SOCIAL_IMAGE}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Tejas Naladala, engineer, researcher, entrepreneur, and angel investor" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(story.teaser)}" />
    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />
    <meta name="twitter:image:alt" content="Tejas Naladala, engineer, researcher, entrepreneur, and angel investor" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/pages.css?v=${ASSET_VERSION}" />
    <script type="application/ld+json">${jsonForHtml(storyJsonLd(story))}</script>
  </head>
  <body class="story-entry-page" data-page="stories">
    <a class="skip-link" href="#storyEntry">Skip to content</a>
    <header class="page-topbar"><div class="page-topbar__inner"><a class="back-link" href="/blog" aria-label="Back to Unsupervised"><span class="back-link__arrow" aria-hidden="true">&larr;</span><span>blog</span></a></div></header>
    <main class="story-entry-main" id="storyEntry"><article class="story-entry story-entry--longform"><header class="story-entry__header"><p class="story-entry__brand">&quot;Un&quot;Supervised</p><h1>${escapeHtml(story.title)}</h1><p class="story-entry__teaser">${escapeHtml(story.teaser)}</p><p class="story-entry__reading-time">${escapeHtml(story.readingTime)}</p></header><div class="story-entry__layout"><div class="story-entry__copy">${body}</div></div></article></main>
    <script type="module" src="/story.js?v=${ASSET_VERSION}"></script>
    <script type="module" src="/music.js?v=${ASSET_VERSION}"></script>
  </body>
</html>
`;
}

async function write(relativePath, contents) {
  const target = join(ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents.replaceAll("\r\n", "\n"), "utf8");
}

async function updateHtml(file, config, fallback) {
  const target = join(ROOT, file);
  let html = await readFile(target, "utf8");
  html = html.replace('content="width=device-width, initial-scale=1"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"');
  html = html.replace(/(<meta property="og:image" content=")[^"]*(" \/>)/, `$1${SOCIAL_IMAGE}$2`);
  html = addOrReplaceHead(html, config);
  if (fallback) html = addOrReplaceFallback(html, fallback);
  await write(file, html);
  return html;
}

const pageConfigs = {
  "index.html": { route: "/", title: "Tejas Naladala", description: "i'm an engineer, researcher, entrepreneur, and angel investor based in Seattle, WA.", markdown: "/profile.md", type: "ProfilePage" },
  "about.html": { route: "/about", title: "About | Tejas Naladala", description: "The person behind the research, machines, and companies.", markdown: "/about.md", type: "ProfilePage" },
  "work.html": { route: "/work", title: "Work | Tejas Naladala", description: "Machine learning, research, and machine building.", markdown: "/work.md", type: "CollectionPage" },
  "research.html": { route: "/research", title: "Research | Tejas Naladala", description: "Empirical ML studies, field projects, technical notes, and peer-reviewed plasma engineering.", markdown: "/research.md", type: "CollectionPage" },
  "investing.html": { route: "/investing", title: "Investing | Tejas Naladala", description: "Tejas Naladala's early-stage investment thesis and 20-point rule.", markdown: "/investing.md", type: "WebPage" },
  "stories.html": { route: "/blog", title: "Unsupervised | Tejas Naladala", description: "Questionable decisions and the parts that feel most like me.", markdown: "/blog.md", type: "Blog" },
  "cv.html": { route: "/cv", title: "CV | Tejas Naladala", description: "Tejas Naladala's complete professional and research record.", markdown: "/cv.md", type: "ProfilePage" },
};

const fallbackByFile = {
  "about.html": aboutFallback(),
  "work.html": workFallback(),
  "research.html": researchFallback(),
  "investing.html": investingFallback(),
  "stories.html": blogFallback(),
  "cv.html": cvFallback(),
};

async function main() {
  await write("profile.json", `${JSON.stringify(profile, null, 2)}\n`);
  await write("profile.md", buildProfileMarkdown());
  await write("about.md", buildAboutMarkdown());
  await write("work.md", buildWorkMarkdown());
  await write("research.md", buildResearchMarkdown());
  await write("investing.md", buildInvestingMarkdown());
  await write("cv.md", buildCvMarkdown());
  await write(
    "projects.md",
    `# Public systems - Tejas Naladala\n\n${buildResearchMarkdown().split("## Other systems")[1]?.trim() ?? ""}\n`,
  );
  await write(
    "publications.md",
    `# Peer-reviewed publications - Tejas Naladala\n\n${buildResearchMarkdown().split("## Peer-reviewed publications")[1]?.split("## Other systems")[0].trim() ?? ""}\n`,
  );
  await write("blog.md", buildBlogMarkdown());

  for (const story of stories) {
    await write(`blog/${story.id}.md`, buildStoryMarkdown(story));
    await write(`blog/${story.id}.html`, buildStoryHtml(story));
  }

  await write(
    "llms.txt",
    `# Tejas Naladala\n\n> Engineering builder, founder of R0 Systems, and empirical machine-learning researcher.\n\nLast updated: ${profile.lastUpdated}\nCanonical identity: ${PERSON_ID}\n\n## Primary record\n\n- [Profile JSON](${SITE}/profile.json): Canonical entities, claims, evidence, skills, dates, status, and provenance.\n- [Profile Markdown](${SITE}/profile.md): Concise professional overview.\n- [Complete CV](${SITE}/cv.md): Full text record with a PDF link.\n\n## Professional record\n\n- [Work](${SITE}/work.md): Employment, roles, dates, and contributions.\n- [Research](${SITE}/research.md): Studies, current boundaries, technical notes, publications, and public systems.\n- [Projects](${SITE}/projects.md): Public software systems.\n- [Publications](${SITE}/publications.md): Peer-reviewed papers and citation snapshot.\n\n## Personal writing\n\n- [About](${SITE}/about.md): Personal narrative.\n- [Unsupervised](${SITE}/blog.md): Published stories and work in progress.\n\n## Contact\n\n- [Email Tejas](${profile.identity.contactUrl})\n- [GitHub](${profile.identity.externalProfiles.github})\n- [LinkedIn](${profile.identity.externalProfiles.linkedin})\n- [Google Scholar](${profile.identity.externalProfiles.googleScholar})\n`,
  );

  await write(
    "manifest.webmanifest",
    `${JSON.stringify({
      name: "Tejas Naladala",
      short_name: "Tejas",
      description: profile.identity.headline,
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#f4f1e8",
      theme_color: "#f4f1e8",
      icons: [{ src: "/favicon-reactor.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    }, null, 2)}\n`,
  );

  await write(
    "feed.xml",
    `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><title>Unsupervised by Tejas Naladala</title><id>${SITE}/blog</id><link href="${SITE}/feed.xml" rel="self"/><link href="${SITE}/blog"/><updated>${profile.lastUpdated}T00:00:00Z</updated><author><name>Tejas Naladala</name><uri>${SITE}</uri></author>${stories.map((story) => `<entry><title>${escapeXml(story.title)}</title><id>${SITE}/blog/${story.id}</id><link href="${SITE}/blog/${story.id}"/><updated>${profile.lastUpdated}T00:00:00Z</updated><summary>${escapeXml(story.teaser)}</summary></entry>`).join("")}</feed>\n`,
  );

  const routes = ["/", "/about", "/work", "/research", "/investing", "/blog", ...stories.map((story) => `/blog/${story.id}`), "/cv"];
  await write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${SITE}${route}</loc><lastmod>${profile.lastUpdated}</lastmod></url>`).join("\n")}\n</urlset>\n`,
  );
  await write(
    "robots.txt",
    `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  );

  for (const [file, config] of Object.entries(pageConfigs)) {
    const html = await updateHtml(file, config, fallbackByFile[file]);
    if (file === "stories.html") await write("blog.html", html);
  }

  await write(
    "404.html",
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#f4f1e8"><meta name="robots" content="noindex"><title>Not found | Tejas Naladala</title><link rel="stylesheet" href="/pages.css?v=${ASSET_VERSION}"></head><body class="compact-page"><a class="skip-link" href="#notFound">Skip to content</a><main class="story-entry-missing" id="notFound"><p class="minor-heading">404</p><h1>That page wandered off.</h1><a class="button-link" href="/">Back home <span aria-hidden="true">&larr;</span></a></main></body></html>\n`,
  );
}

await main();
