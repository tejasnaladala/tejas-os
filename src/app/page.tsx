import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { bio } from "@/data/bio";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";
import ProfileTabs from "@/components/profile/ProfileTabs";

export const metadata: Metadata = {
  title: "Tejas Naladala",
  description: SITE_CONFIG.description,
};

/**
 * Landing layout, post-redesign:
 *   1. Studio portrait card with hover-mask reveal (the tarot version
 *      surfaces underneath the cursor).
 *   2. ProfileTabs - nameplate, gooey morphing words, tabbed CV body.
 *   3. PortfolioTechHero - technical-identity card (circuits, agents, plasma)
 *      themed in cream/orange to match the rest of the site.
 *
 * Hidden behind a `sr-only` block: full content for SEO + screen readers
 * since the visible body uses tabs.
 */
export default function Home() {
  return (
    <main
      id="main-content"
      style={{
        paddingTop: "var(--page-top)",
        paddingBottom: "var(--page-bottom)",
      }}
    >
      {/* Hidden SEO content */}
      <div className="sr-only" aria-label="Profile index">
        <h1>Tejas Naladala</h1>
        <p>{bio.tagline}</p>
        <p>{bio.full}</p>
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p>
              {p.role} . {p.date}
            </p>
            <p>{p.description}</p>
          </article>
        ))}
        <h2>Skills</h2>
        {skillCategories.map((cat) => (
          <section key={cat.name}>
            <h3>{cat.name}</h3>
            <ul>
              {cat.skills.map((s) => (
                <li key={s.name}>
                  {s.name}, {s.level}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Achievements</h2>
        <ul>
          {achievements.map((a) => (
            <li key={a.title}>
              {a.title}: {a.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Hero + tabs + panels all live inside ProfileTabs. */}
      <div className="container-wide">
        <ProfileTabs />
      </div>
    </main>
  );
}
