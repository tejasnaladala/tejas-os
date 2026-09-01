# Professional Entity Map

Audit date: 2026-09-01

Canonical source: `data/profile.js`

Canonical person ID: `https://tejasnaladala.com/#person`

## Graph shape

```text
person:tejas-naladala
|-- current activities -> experience / education / research
|-- experience -> organization / claims / skills / evidence
|-- research -> organizations / claims / skills / evidence
|-- reports -> advisor organization / claims / skills / evidence
|-- publications -> authorship / experience / evidence
|-- projects -> role / skills / evidence
|-- programs and awards -> associated entity / evidence
|-- writing -> HTML and Markdown resources
`-- patents -> status / inventors / evidence

claim -> subject + evidence
skill -> demonstratedBy
organization -> parent organization
```

## Node inventory

| Family | Count | Stable ID examples |
| --- | ---: | --- |
| Person | 1 | `person:tejas-naladala` |
| Organizations | 13 | `org:r0-systems`, `org:uw`, `org:mteb` |
| Education | 1 | `education:uw-engineering` |
| Experience | 5 | `experience:r0-founder`, `experience:opentrade-ml` |
| Research | 6 | `research:mteb-gym`, `research:ocean-cv` |
| Technical reports | 2 | `report:vlm-inference`, `report:single-gpu-serving` |
| Publications | 3 | `publication:paw-systems` |
| Projects | 5 | `project:mimic`, `project:engram` |
| Awards | 4 | `award:cmu-venture-challenge` |
| Programs | 5 | `program:a16z-speedrun`, `program:visions-26` |
| Writing | 2 | `writing:nespresso-jailbreak` |
| Skills | 35 | `skill:machine-learning`, `skill:embedded-systems` |
| Claims | 25 | `claim:r0-revenue`, `claim:ocean-pipeline` |
| Evidence | 28 | `evidence:r0-dyson`, `evidence:mteb-pulls` |
| Patents | 1 record | `patents:r0-pending` |

The generated graph contains 134 entities in total.

## Professional record

| Experience ID | Organization | Role | Dates |
| --- | --- | --- | --- |
| `experience:r0-founder` | R0 Systems | Founder & CEO | 2024-06 to present |
| `experience:opentrade-ml` | OpenTrade | Machine Learning Engineer | 2026-06 to 2026-09 |
| `experience:seal-research` | Sensors, Energy, and Automation Laboratory | Research Associate | 2025-03 to 2025-11 |
| `experience:niist-research` | CSIR-NIIST | Research Associate | 2024-06 to 2025-03 |
| `experience:ingenium-research-engineer` | Ingenium Naturae | Research Engineer | 2023-05 to 2024-06 |

| Research ID | Status | Main evidence |
| --- | --- | --- |
| `research:mteb-gym` | in progress | Merged public contributions |
| `research:rsna-knee` | in progress | Public context and CV |
| `research:agentbreed` | in progress | Public repository |
| `research:maze-rl` | artifact reconciliation | Public repository |
| `research:connectome-v2` | corrected run pending | Public repository |
| `research:ocean-cv` | in progress | VISIONS '26, ROV Jason, and CV |

## Relationship rules

- IDs are deterministic, lowercase, and namespaced.
- Subjects list claim IDs; claims point back to their subjects.
- Subjects list demonstrated skills; skills point back through `demonstratedBy`.
- Evidence records state the public URL, evidence tier, and the fact each source supports.
- JSON-LD uses one canonical person at `/#person` and stable organization IDs.
- Unknown dates remain null; known dates retain year or month precision.

## Evidence tiers

- Tier 1: public repositories, DOI records, and official institutional pages.
- Tier 2: first-party technical reports, company pages, and project pages.
- Tier 3: self-reported professional records such as the CV.

Evidence tier records provenance. It does not upgrade a source beyond what its description supports.

## Identity decisions

- Engineering is the canonical University of Washington field.
- Ingenium Naturae is the work-history name; Ingenium Technologies remains a publication-era alias.
- LinkedIn was unavailable for an authenticated automated copy audit.
- The GitHub account-level bio requires user-profile scope.
- The public month for entry into the Lavin Entrepreneurship Program remains unknown.
