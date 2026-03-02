"use client";

import { bio } from "@/data/bio";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

export default function ResumeApp({ windowId }: { windowId: string }) {
  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      {/* Download Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-accent-green text-base">Resume</h2>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-accent-green/10 border border-accent-green/30 rounded-sm
            text-accent-green text-xs hover:bg-accent-green/20 transition-colors"
        >
          Download PDF
        </a>
      </div>

      {/* Name & Tagline */}
      <div className="border border-border rounded-sm p-3 mb-4">
        <div className="text-text-primary text-sm font-bold">{bio.systemInfo.user}</div>
        <div className="text-accent-green text-xs mt-1">{bio.tagline}</div>
        <div className="text-text-secondary text-[10px] mt-1">
          {bio.systemInfo.location} | {bio.systemInfo.status}
        </div>
      </div>

      {/* Education */}
      <Section title="EDUCATION">
        <div className="mb-2">
          <div className="text-text-primary text-xs font-bold">University of Washington</div>
          <div className="text-text-secondary text-[10px]">
            B.S. Electrical & Computer Engineering + Applied Mathematics
          </div>
          <div className="text-text-secondary text-[10px]">
            GPA: 3.93/4.0 | Lavin Entrepreneurship Fellow | Class of 2028
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section title="EXPERIENCE">
        {projects.map((project) => (
          <div key={project.id} className="mb-3 last:mb-0">
            <div className="flex justify-between items-start">
              <div className="text-text-primary text-xs font-bold">{project.title}</div>
              <div className="text-text-secondary text-[10px] shrink-0 ml-2">{project.date}</div>
            </div>
            <div className="text-accent-cyan text-[10px]">{project.role}</div>
            <ul className="mt-1 space-y-0.5">
              {project.metrics.slice(0, 3).map((m, i) => (
                <li key={i} className="text-text-secondary text-[10px] flex items-start gap-1">
                  <span className="shrink-0">{"\u2022"}</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Publications */}
      <Section title="PUBLICATIONS">
        <div className="text-text-secondary text-[10px]">
          <p>{"\u2022"} 3 peer-reviewed publications in J. Phys. D: Applied Physics and Innov. Food Sci. & Emerging Technologies</p>
          <p className="mt-1">{"\u2022"} Patent filed: Venturi-plasma integration architecture</p>
        </div>
      </Section>

      {/* Skills Summary */}
      <Section title="SKILLS">
        {skillCategories.map((cat) => (
          <div key={cat.name} className="mb-2 last:mb-0">
            <div className="text-text-secondary text-[10px] font-bold mb-0.5">
              {cat.name}
            </div>
            <div className="text-text-secondary text-[10px]">
              {cat.skills.map((s) => s.name).join(", ")}
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="text-accent-amber text-[10px] uppercase tracking-wider border-b border-border pb-1 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}
