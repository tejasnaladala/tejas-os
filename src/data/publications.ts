import { Publication } from "@/types";

export const scholarProfile = {
  citations: 35,
  hIndex: 3,
  i10Index: 2,
};

export const publications: Publication[] = [
  {
    title:
      "Design of systems for plasma activated water (PAW) for agri-food applications",
    authors: "Misra NN, Naladala T, Alzahrani KJ",
    venue: "Journal of Physics D: Applied Physics 57(49), 493003",
    year: "2024",
    citations: 12,
    doi: "10.1088/1361-6463/ad77de",
  },
  {
    title:
      "Design of a continuous plasma activated water (PAW) disinfection system for fresh produce industry",
    authors: "Misra NN, Naladala T, Alzahrani KJ, Sreelakshmi VP, Negi PS",
    venue: "Innovative Food Science & Emerging Technologies 97, 103845",
    year: "2024",
    citations: 9,
    doi: "10.1016/j.ifset.2024.103845",
  },
  {
    title:
      "Design and construction of a continuous industrial scale cold plasma equipment for fresh produce industry",
    authors: "Misra NN, Sreelakshmi VP, Naladala T, Alzahrani KJ, Negi PS",
    venue: "Innovative Food Science & Emerging Technologies 97, 103840",
    year: "2024",
    citations: 14,
    doi: "10.1016/j.ifset.2024.103840",
  },
];

export const preprints: Publication[] = [
  {
    title: "Connectome Architecture Benchmark",
    authors: "Parchment Labs",
    venue: "Submitted to Nature Communications",
    year: "2026",
    status: "submitted",
  },
  {
    title: "Reward-driven discovery failure in deep RL on procedural mazes",
    authors: "maze-rl-baselines",
    venue: "Preprint in preparation",
    year: "2026",
    status: "in preparation",
  },
  {
    title:
      "Pre-registered empirical study of multi-agent LLM configuration optimization",
    authors: "agentbreed",
    venue: "Preprint in preparation",
    year: "2026",
    status: "in preparation",
  },
];
