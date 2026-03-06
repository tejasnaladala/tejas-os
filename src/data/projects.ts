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
      "Built the first industrial-scale plasma water disinfection system from scratch. Designed custom high-voltage electronics, machined reactor housings, wrote firmware, and shipped a $180K production unit to a government food safety lab in India. Replaces chlorine sanitation entirely with cold plasma, no chemicals, just ionized gas and engineering.",
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
      "Designing an open-source underwater ROV that costs $2-5K instead of the $10-50K commercial alternatives. Custom power distribution board, 5-thruster vectored drive, Raspberry Pi vision pipeline, all rated to 100m depth. Already secured government LOIs for environmental audit contracts on Lake Sammamish.",
    metrics: [
      "Vectored 5-thruster configuration (Pixhawk/ArduSub)",
      "Raspberry Pi 5 HD vision pipeline",
      "Custom MOSFET power distribution for 6S Li-ion",
      "$2,000 Buerk Center prototype funding secured",
      "Letter of intent from government officials for Lake Sammamish environmental audit contracts",
      "Real-time HD video streaming via tethered Ethernet with <100ms latency",
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
      "Built an AI-powered platform that audits commercial insurance policies and surfaces coverage gaps most businesses never catch. Parses 50+ page PDFs through a 4-stage extraction pipeline, orchestrates multiple LLMs to cross-reference exclusions, and delivers a plain-English audit report with negotiation strategies in under 60 seconds.",
    metrics: [
      "Identifies coverage gaps, exclusions, and premium inefficiencies",
      "Multi-model AI orchestration with Protection Score\u2122",
      "Plain-English audit reports with broker negotiation strategies",
      "Processes policies in under 60 seconds",
      "Targeting $294.6B U.S. commercial insurance market",
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
      "Open-source framework that lets you define AI agents in YAML and run them across any LLM provider. Write once, route to OpenAI, Anthropic, Google, Ollama, or 4 others automatically. Handles multi-agent orchestration, tool-calling schema translation, and ships with a real-time observability dashboard. Hit 150+ clones in week one.",
    metrics: [
      "4,400+ lines of code (Python/TypeScript)",
      "8 LLM providers supported",
      "150+ unique clones in first week",
      "Multi-agent orchestration (sequential, parallel, supervisor)",
      "Provider-agnostic tool-calling with automatic schema translation",
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
      "Worked under Prof. Alex Mamishev designing embedded sensing systems for two funded research proposals. Built a PPG-based wearable that detects drowsiness in real-time using a custom bandpass filter pipeline with 95% motion artifact rejection. Also designed a non-intrusive breakage sensor for U.S. Navy hull integrity monitoring.",
    metrics: [
      "PPG-based drowsiness detection wearable for real-time physiological monitoring",
      "Non-intrusive breakage-detection sensor for U.S. Navy hull integrity",
      "Authored grant sections and technical abstracts across 7-person team",
      "Real-time PPG signal denoising using Butterworth bandpass filter (0.5-5Hz) with 95% motion artifact rejection",
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
      "Fabricated dye-sensitized and perovskite solar cells in the lab of Dr. Suraj Soman, whose group holds world-record DSC efficiency. Hands-on cleanroom work engineering photoanode interfaces, characterizing 20+ device architectures, and optimizing dye-loading protocols. Hit 7.2% power conversion efficiency on an N719-sensitized cell.",
    metrics: [
      "Engineered ruthenium-TiO\u2082 photoanode interfaces",
      "Characterized 20+ device architectures",
      "Achieved 7.2% PCE on N719-sensitized TiO\u2082 photoanode with optimized dye-loading protocol",
    ],
    tech: [
      "Solar Cell Fabrication",
      "Spectroscopy (PIA/IPCE/XRD)",
      "Cleanroom Processing",
      "Materials Characterization",
    ],
  },
];
