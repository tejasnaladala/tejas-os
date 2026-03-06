import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";

export const metadata: Metadata = {
  title: "Tejas Naladala \u2014 Resume",
  description:
    "Hardware engineer, AI builder, startup founder. B.S. ECE + Applied Math at UW Seattle. Founder of PlasmaX, Cerulean Robotics, Atticus AI.",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-[#2a2a3e] pb-1 text-xs font-semibold uppercase tracking-widest text-[#ffb000]">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0a0a0f] text-[#e0e0e8]">
      <div className="mx-auto max-w-3xl px-6 py-12" style={{ fontFamily: "var(--font-sans)" }}>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Tejas Naladala
          </h1>
          <p className="mt-1 text-sm text-[#8888a0]">
            Seattle, WA &middot;{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-[#00d4ff] hover:underline"
            >
              {SITE_CONFIG.email}
            </a>{" "}
            &middot;{" "}
            <a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:underline"
            >
              GitHub
            </a>{" "}
            &middot;{" "}
            <a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </header>

        {/* Education */}
        <section className="mb-8">
          <SectionHeading>Education</SectionHeading>
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  University of Washington, Seattle
                </p>
                <p className="text-sm text-[#8888a0]">
                  B.S. Electrical & Computer Engineering + Applied Mathematics
                </p>
              </div>
              <p className="shrink-0 text-xs text-[#8888a0]">Class of 2028</p>
            </div>
            <p className="mt-1 text-xs text-[#8888a0]">
              GPA: 3.93/4.0 &middot; Lavin Entrepreneurship Fellow
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-5">
            {projects.map((project) => {
              // Get first 2 sentences of description
              const sentences = project.description.match(/[^.!?]+[.!?]+/g) || [
                project.description,
              ];
              const shortDesc = sentences.slice(0, 2).join(" ").trim();
              const topMetrics = project.metrics.slice(0, 3);

              return (
                <div key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {project.title}
                      </p>
                      <p className="text-xs text-[#00d4ff]">{project.role}</p>
                    </div>
                    <p className="shrink-0 text-xs text-[#8888a0]">
                      {project.date}
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#8888a0]">
                    {shortDesc}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {topMetrics.map((metric, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-[#e0e0e8]"
                      >
                        <span className="mt-0.5 shrink-0 text-[#00ff41]">
                          &bull;
                        </span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Publications */}
        <section className="mb-8">
          <SectionHeading>Publications</SectionHeading>
          <p className="text-xs leading-relaxed text-[#8888a0]">
            3 peer-reviewed papers (2024) in J. Phys. D: Appl. Phys. and Innov.
            Food Sci. Emerg. Technol.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <SectionHeading>Skills</SectionHeading>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.name}>
                <span className="text-xs font-semibold text-white">
                  {cat.name}:{" "}
                </span>
                <span className="text-xs text-[#8888a0]">
                  {cat.skills.map((s) => s.name).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <SectionHeading>Achievements</SectionHeading>
          <ul className="space-y-1">
            {achievements.map((a) => (
              <li
                key={a.title}
                className="flex items-start gap-1.5 text-xs text-[#e0e0e8]"
              >
                <span className="mt-0.5 shrink-0 text-[#00ff41]">&bull;</span>
                <span>
                  <strong>{a.title}</strong> &mdash; {a.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <footer className="flex flex-wrap items-center gap-4 border-t border-[#2a2a3e] pt-6">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[#00ff41]/30 bg-[#00ff41]/10 px-5 py-2.5 text-sm font-medium text-[#00ff41] transition-colors hover:bg-[#00ff41]/20"
          >
            Download Resume
          </a>
          <a
            href="/"
            className="text-sm text-[#00d4ff] transition-colors hover:underline"
          >
            Home &rarr;
          </a>
        </footer>
      </div>
    </div>
  );
}
