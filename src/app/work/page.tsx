import { Metadata } from "next";
import PageLayout from "@/components/shared/PageLayout";
import { projects } from "@/data/projects";
import { Project } from "@/types";

export const metadata: Metadata = {
  title: "Work | Tejas Naladala",
  description:
    "Ventures, research, industry systems, competitions, and open-source projects shipped by Tejas Naladala.",
};

const ventures = ["r0-systems", "parchment", "delphi", "cerulean"].map(projectById);
const research = ["agentbreed", "maze-rl-baselines", "seal-lab", "niist"].map(projectById);
const industry = ["plasmafx"].map(projectById);
const competitions = ["parameter-golf"].map(projectById);
const openSource = [
  "forge",
  "engram",
  "wireml",
  "knowledge-engine",
  "claude-nexus",
  "ai-agent-city",
  "mimic",
  "icordion",
  "delulu",
  "tejas-os",
].map(projectById);

const workSections = [
  { eyebrow: "01 / Ventures", title: "Companies and labs", projects: ventures },
  { eyebrow: "02 / Research", title: "Studies and lab work", projects: research },
  { eyebrow: "03 / Industry", title: "Production hardware", projects: industry },
  { eyebrow: "04 / Competition", title: "Compact models", projects: competitions },
  { eyebrow: "05 / Open Source", title: "Tools and experiments", projects: openSource },
].map((section, index, sections) => ({
  ...section,
  startAt:
    sections.slice(0, index).reduce((total, item) => total + item.projects.length, 0) + 1,
}));

function projectById(id: string) {
  const project = projects.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Missing project data for ${id}`);
  }
  return project;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const titleLink = project.links?.[0]?.url;
  const idx = String(index).padStart(2, "0");

  const title = (
    <span className="display" style={{ fontSize: 26, lineHeight: 1.1 }}>
      {project.title}
    </span>
  );

  return (
    <article className="editorial-card flex flex-col">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {idx}
        </span>
        <span
          className="font-mono"
          style={{
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.06em",
          }}
        >
          {project.date}
        </span>
      </div>

      {titleLink ? (
        <a
          href={titleLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--text-primary)", textUnderlineOffset: 4 }}
        >
          {title}
        </a>
      ) : (
        title
      )}

      <p className="eyebrow mt-3" style={{ color: "var(--text-muted)" }}>
        {project.role}
      </p>
      <p
        className="body-md mt-3 flex-1"
        style={{ color: "var(--text-secondary)", fontSize: 15.5, lineHeight: 1.65 }}
      >
        {project.summary}
      </p>

      {project.metrics.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {project.metrics.slice(0, 2).map((metric) => (
            <li key={metric} className="body-sm flex gap-3" style={{ fontSize: 14 }}>
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                style={{ background: "#CC785C" }}
              />
              <span style={{ color: "var(--text-primary)" }}>{metric}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 5).map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-10 mt-24 first:mt-0">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="display" style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}>
        {title}
      </h2>
    </header>
  );
}

function ProjectGrid({
  projects,
  startAt,
}: {
  projects: Project[];
  startAt: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((project, offset) => (
        <ProjectCard key={project.id} project={project} index={startAt + offset} />
      ))}
    </div>
  );
}

export default function WorkPage() {
  return (
    <PageLayout wide>
      <header className="page-header">
        <p className="eyebrow">Work</p>
        <h1 className="display">
          Things I&rsquo;ve <em>shipped.</em>
        </h1>
        <p className="body-lg">
          A categorized map of the CV: companies, research, industrial hardware,
          competitions, and open-source systems.
        </p>
      </header>

      {workSections.map((section) => (
        <section key={section.eyebrow}>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} />
          <ProjectGrid projects={section.projects} startAt={section.startAt} />
        </section>
      ))}
    </PageLayout>
  );
}
