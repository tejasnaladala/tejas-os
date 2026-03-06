import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "plasmafx",
    filename: "PlasmaX",
    extension: "sys",
    title: "PlasmaX",
    role: "Founder & CEO",
    date: "May 2023 – Present",
    description:
      "Designed, built, and shipped a $180K production plasma reactor that eliminates chlorine-based water sanitation entirely, from custom 18kV flyback drivers and STM32 firmware to CNC-machined reactor housings. Deployed to CSIR-CFTRI, India's premier government food safety lab. No chemicals, just ionized gas and engineering.",
    metrics: [
      "$2M seed round at $8M post-money valuation",
      "Sold first production unit ($180K) to CSIR-CFTRI India",
      "10 contracted revenue-generating system deployments",
      "Patent filed on venturi-plasma integration architecture",
      "3 peer-reviewed publications",
      "2.5 log\u2081\u2080 microbial reduction at 1.86 kW, $0.47/ton operating cost",
      "Custom high-voltage flyback driver: 18kV AC at 23kHz, <2W quiescent",
      "Embedded STM32 PID loop controlling gas flow, voltage regulation, and thermal management",
    ],
    tech: [
      "High-Voltage Electronics",
      "Embedded C (STM32)",
      "Plasma Physics",
      "CAD/CNC Machining",
    ],
    links: [
      { label: "DOI: 10.1088/1361-6463/ad77de", url: "https://doi.org/10.1088/1361-6463/ad77de" },
    ],
  },
  {
    id: "cerulean",
    filename: "CeruleanROV",
    extension: "hw",
    title: "Cerulean Robotics",
    role: "Founder & Sole Engineer",
    date: "Nov 2025 – Present",
    description:
      "Sole-engineering an open-source underwater ROV rated to 100m depth at 1/10th the cost of commercial alternatives, with government LOIs already secured for environmental audit contracts on Lake Sammamish. Custom MOSFET power distribution, 5-thruster vectored drive on Pixhawk/ArduSub, and a Raspberry Pi 5 HD vision pipeline, all designed and assembled from scratch.",
    metrics: [
      "Government LOIs secured for Lake Sammamish environmental audit deployments",
      "100m depth-rated system at $2-5K vs $10-50K commercial alternatives",
      "Custom MOSFET power distribution board for 6S Li-ion packs",
      "Real-time HD video streaming via tethered Ethernet with <100ms latency",
      "$2,000 Buerk Center prototype funding secured",
    ],
    tech: [
      "Pixhawk/ArduSub",
      "Power Electronics",
      "KiCad PCB Design",
      "Raspberry Pi",
    ],
  },
  {
    id: "atticus",
    filename: "AtticusAI",
    extension: "exe",
    title: "Atticus AI",
    role: "Founder & Technical Lead",
    date: "Jan 2026 – Present",
    description:
      "Built a multi-LLM orchestration platform that ingests 50-page commercial insurance policies and delivers a plain-English coverage audit with broker negotiation strategies in under 60 seconds. 4-stage PDF extraction pipeline, cross-references exclusions across multiple AI models, and generates actionable Protection Score reports targeting the $294.6B U.S. commercial insurance market.",
    metrics: [
      "Full policy audit with broker negotiation playbook in under 60 seconds",
      "Targeting $294.6B U.S. commercial insurance market",
      "Multi-model AI orchestration with Protection Score\u2122",
      "4-stage PDF extraction pipeline with OCR and vector search",
    ],
    tech: ["Next.js", "Claude/GPT-4 Orchestration", "PDF Extraction + OCR", "Vector Search"],
  },
  {
    id: "forge",
    filename: "Forge",
    extension: "pkg",
    title: "Forge - Open-Source AI Agent Runtime",
    role: "Creator",
    date: "Feb 2026",
    description:
      "Open-source AI agent runtime supporting 8 LLM providers with automatic tool-calling schema translation, multi-agent orchestration, and a real-time observability dashboard. Define agents in YAML, route to OpenAI, Anthropic, Google, Ollama, or 4 others automatically. Hit 150+ clones in week one.",
    metrics: [
      "150+ unique clones in first week, 8 LLM providers supported out of the box",
      "Multi-agent orchestration (sequential, parallel, supervisor patterns)",
      "Provider-agnostic tool-calling with automatic schema translation",
      "Real-time observability dashboard with WebSocket streaming",
    ],
    tech: [
      "Python",
      "TypeScript/Next.js",
      "FastAPI + WebSocket",
      "LLM Orchestration",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala" }],
  },
  {
    id: "seal-lab",
    filename: "SEAL_Lab",
    extension: "log",
    title: "SEAL Lab - University of Washington",
    role: "Research Associate",
    date: "Mar \u2013 Nov 2025",
    description:
      "Built real-time embedded sensing systems under Prof. Mamishev across two funded research proposals, including a PPG-based drowsiness detection wearable with 95% motion artifact rejection and a non-intrusive breakage sensor designed for U.S. Navy hull integrity monitoring. Custom Butterworth bandpass filter pipeline at 0.5-5Hz, authored grant sections and technical abstracts across a 7-person research team.",
    metrics: [
      "95% motion artifact rejection on real-time PPG drowsiness detection (0.5-5Hz Butterworth pipeline)",
      "Non-intrusive breakage sensor designed for U.S. Navy hull integrity monitoring",
      "Authored grant sections and technical abstracts across 7-person research team",
    ],
    tech: [
      "Embedded Systems (STM32)",
      "Signal Processing",
      "Sensor Design",
      "Technical Writing",
    ],
  },
  {
    id: "niist",
    filename: "NIIST_Solar",
    extension: "dat",
    title: "NIIST (CSIR) India - Solar Cell Research",
    role: "Research Intern",
    date: "Jun 2024 \u2013 Mar 2025",
    description:
      "Fabricated dye-sensitized and perovskite solar cells in a world-record-holding DSC efficiency lab, engineering ruthenium-TiO\u2082 photoanode interfaces across 20+ device architectures and achieving 7.2% power conversion efficiency. Hands-on cleanroom work under Dr. Suraj Soman, optimizing dye-loading protocols and characterizing devices via PIA, IPCE, and XRD spectroscopy.",
    metrics: [
      "7.2% power conversion efficiency on N719-sensitized TiO\u2082 photoanode",
      "20+ device architectures characterized across DSC and perovskite platforms",
      "Engineered ruthenium-TiO\u2082 photoanode interfaces with optimized dye-loading protocols",
    ],
    tech: [
      "Solar Cell Fabrication",
      "Spectroscopy (PIA/IPCE/XRD)",
      "Cleanroom Processing",
      "Materials Characterization",
    ],
  },
];
