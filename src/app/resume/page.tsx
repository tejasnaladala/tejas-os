import type { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/shared/PageLayout";
import { SITE_CONFIG } from "@/lib/constants";
import { bio } from "@/data/bio";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";
import { preprints, publications, scholarProfile } from "@/data/publications";
import { Project, Publication } from "@/types";

export const metadata: Metadata = {
  title: "Resume | Tejas Naladala",
  description:
    "Hardware engineer, AI systems builder, startup founder, and University of Washington ECE + Applied Math student.",
};

const researchExperience = [
  "r0-systems",
  "parchment",
  "delphi",
  "agentbreed",
  "maze-rl-baselines",
  "seal-lab",
  "niist",
].map(projectById);

const industryExperience = ["plasmafx"].map(projectById);

const openSourceAndCompetitions = [
  "parameter-golf",
  "forge",
  "engram",
  "wireml",
  "knowledge-engine",
  "claude-nexus",
  "ai-agent-city",
  "mimic",
  "icordion",
  "delulu",
  "cerulean",
  "tejas-os",
].map(projectById);

function projectById(id: string) {
  const project = projects.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Missing project data for ${id}`);
  }
  return project;
}

const ACCENT = "#CC785C";

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="eyebrow mb-5 mt-14 pb-3 first:mt-0"
      style={{ borderBottom: "1px solid var(--hairline)", color: ACCENT }}
    >
      {children}
    </h2>
  );
}

function BulletList({ items, limit }: { items: string[]; limit?: number }) {
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;
  return (
    <ul className="mt-3 space-y-1.5">
      {visible.map((item) => (
        <li key={item} className="body-md flex items-start gap-3" style={{ fontSize: 15.5 }}>
          <span
            aria-hidden="true"
            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
            style={{ background: ACCENT }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectEntry({ project, compact }: { project: Project; compact?: boolean }) {
  return (
    <article className="py-6" style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="display" style={{ fontSize: compact ? 19 : 21, lineHeight: 1.2 }}>
            {project.title}
          </p>
          <p className="body-sm mt-1" style={{ color: ACCENT }}>
            {project.role}
          </p>
        </div>
        <p
          className="body-sm shrink-0"
          style={{ color: "var(--text-muted)", fontSize: 13 }}
        >
          {project.date}
        </p>
      </div>
      <p
        className="body-md mt-3 max-w-3xl"
        style={{ color: "var(--text-secondary)", fontSize: 15.5, lineHeight: 1.65 }}
      >
        {compact ? project.summary : project.description}
      </p>
      <BulletList items={project.metrics} limit={compact ? 2 : 4} />
      <p
        className="body-sm mt-3"
        style={{ color: "var(--text-muted)", fontSize: 13 }}
      >
        {project.tech.join(", ")}
      </p>
    </article>
  );
}

function PublicationEntry({ publication }: { publication: Publication }) {
  const citationText =
    typeof publication.citations === "number"
      ? ` [${publication.citations} citations]`
      : "";

  return (
    <article className="py-4" style={{ borderBottom: "1px solid var(--hairline)" }}>
      <p className="body-md" style={{ fontWeight: 600, fontSize: 16 }}>
        {publication.title}
      </p>
      <p
        className="body-sm mt-1"
        style={{ color: "var(--text-secondary)", fontSize: 14 }}
      >
        {publication.authors}. {publication.venue} ({publication.year}).
        {citationText}
      </p>
      {publication.doi && (
        <a
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="body-sm mt-1 inline-block hover:underline"
          style={{ color: ACCENT, fontSize: 13 }}
        >
          doi.org/{publication.doi}
        </a>
      )}
    </article>
  );
}

export default function ResumePage() {
  return (
    <PageLayout>
      <header className="mb-12">
        <h1 className="display" style={{ fontSize: "clamp(48px, 7.4vw, 88px)", lineHeight: 1.04 }}>
          Tejas <em>Naladala</em>
        </h1>
        <p
          className="body-md mt-4"
          style={{ color: "var(--text-muted)", fontSize: 15 }}
        >
          Hardware Engineer &middot; AI Builder &middot; Founder
        </p>
        <p
          className="body-md mt-1"
          style={{ color: "var(--text-muted)", fontSize: 15 }}
        >
          Seattle, WA &middot;{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            style={{ color: ACCENT }}
            className="hover:underline"
          >
            {SITE_CONFIG.email}
          </a>{" "}
          &middot;{" "}
          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT }}
            className="hover:underline"
          >
            LinkedIn
          </a>{" "}
          &middot;{" "}
          <a
            href={SITE_CONFIG.social.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT }}
            className="hover:underline"
          >
            GitHub
          </a>
        </p>
      </header>

      <SectionHeading>Profile</SectionHeading>
      <p className="body-md max-w-3xl">{bio.full}</p>
      <p className="body-md mt-4 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
        Research interests: safety-relevant evaluation and interpretability of
        frontier models; empirical study design for multi-agent and RL failure
        modes; reproducible research artifacts with pre-registered protocols,
        open code/data, and audit trails.
      </p>

      <SectionHeading>Education</SectionHeading>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="display" style={{ fontSize: 22, lineHeight: 1.2 }}>
            University of Washington, Seattle
          </p>
          <p className="body-md mt-1" style={{ fontSize: 15.5 }}>
            B.S. Electrical &amp; Computer Engineering and Applied Mathematics
            (Double Major)
          </p>
        </div>
        <p
          className="body-sm shrink-0"
          style={{ color: "var(--text-muted)", fontSize: 13 }}
        >
          Sep 2024 — Jun 2028
        </p>
      </div>
      <BulletList
        items={[
          "GPA 3.93 / 4.0",
          "Lavin Entrepreneurship Fellow, four-year selective program",
          "Y Combinator AI Startup School 2026, San Francisco cohort",
          "Activities: Research & Computing Club, National Acapella Team",
        ]}
      />

      <SectionHeading>Research & Founder Experience</SectionHeading>
      {researchExperience.map((project) => (
        <ProjectEntry key={project.id} project={project} />
      ))}

      <SectionHeading>Industry</SectionHeading>
      {industryExperience.map((project) => (
        <ProjectEntry key={project.id} project={project} />
      ))}

      <SectionHeading>Publications</SectionHeading>
      <p className="body-md max-w-3xl">
        Google Scholar: {scholarProfile.citations} total citations, h-index{" "}
        {scholarProfile.hIndex}, i10-index {scholarProfile.i10Index}.
      </p>
      <div className="mt-4">
        {publications.map((publication) => (
          <PublicationEntry key={publication.title} publication={publication} />
        ))}
      </div>
      <p className="eyebrow mb-2 mt-8" style={{ color: "var(--text-muted)" }}>
        Preprints in preparation
      </p>
      {preprints.map((publication) => (
        <PublicationEntry key={publication.title} publication={publication} />
      ))}

      <SectionHeading>Open Source Projects & Competitions</SectionHeading>
      {openSourceAndCompetitions.map((project) => (
        <ProjectEntry key={project.id} project={project} compact />
      ))}

      <SectionHeading>Technical Skills</SectionHeading>
      <div className="space-y-3">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <span
              className="eyebrow"
              style={{ color: ACCENT, display: "inline-block", marginRight: 10 }}
            >
              {category.name}
            </span>
            <span className="body-md" style={{ fontSize: 15.5 }}>
              {category.skills.map((skill) => skill.name).join(", ")}
            </span>
          </div>
        ))}
      </div>

      <SectionHeading>Awards & Recognition</SectionHeading>
      <BulletList items={achievements.map((a) => `${a.title}: ${a.description}`)} />

      <SectionHeading>Additional</SectionHeading>
      <BulletList
        items={[
          "Languages: English, Hindi, Telugu, Mandarin",
          "Interests: Powerlifting, beatboxing, public speaking, entrepreneurial mentoring",
        ]}
      />

      <footer
        id="contact"
        className="mt-16 flex flex-wrap items-center gap-3 pt-10"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
          Download PDF
        </a>
        <a href={`mailto:${SITE_CONFIG.email}`} className="btn-secondary">
          Email
        </a>
        <Link href="/" className="btn-secondary">
          Home
        </Link>
      </footer>
    </PageLayout>
  );
}
