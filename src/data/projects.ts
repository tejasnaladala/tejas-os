import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "r0-systems",
    filename: "R0Systems",
    extension: "hw",
    title: "R0 Systems",
    role: "Founder & CEO",
    date: "2026 - Present",
    category: "venture",
    summary:
      "Plasma sanitization equipment for post-harvest agricultural produce. $30K validation deployment sold; commercial packhouse pilots targeted 2026.",
    description:
      "Building plasma sanitization equipment for post-harvest agricultural produce. Iterating on plasma reactor geometry, gas-flow control, and food-contact electrode design. Sold a $30K validation deployment; first commercial reactor unit and packhouse pilots targeted 2026.",
    metrics: [
      "$30K validation deployment sold",
      "Plasma reactor design + bench-validation in progress",
      "Commercial packhouse pilots targeted 2026",
    ],
    tech: [
      "Plasma Physics",
      "High-Voltage Electronics",
      "Embedded C",
      "PID Control",
      "CAD",
    ],
  },
  {
    id: "parchment",
    filename: "ParchmentLabs",
    extension: "ai",
    title: "Parchment Labs",
    role: "Project Lead",
    date: "Dec 2025 - Present",
    category: "venture",
    summary:
      "Autonomous research discovery engine that turns literature into experiment plans, GPU runs, and LaTeX manuscripts.",
    description:
      "Built a 9-stage autonomous research pipeline: multi-source ingestion from ArXiv, bioRxiv, and Semantic Scholar across 50+ categories and 5,000+ papers/day; vector embedding via a local 32B-parameter model with HNSW indexing; novelty and relevance scoring with cosine deduplication; knowledge-graph gap detection; multi-agent adversarial peer review with 150 agents, weighted endorsement voting, and an 85% consensus threshold; experiment design; GPU execution; and LaTeX manuscript generation.",
    metrics: [
      "Connectome Architecture Benchmark submitted to Nature Communications: 10 published connectomes, 6 downstream tasks, 900 training runs, bootstrap CIs",
      "Degree-preserving nulls recover most connectome advantage; residual +7.4% on mushroom-body tasks and 14.7% faster training",
      "Replayable research pipeline: every run reproducible from commit hash plus config",
      "Proprietary review layer with 1,100+ self-learning calibration patterns",
      "Zero-API local inference on a 32B open model at 93%+ gross margins",
    ],
    tech: [
      "Python/FastAPI",
      "Local 32B LLM",
      "HNSW Retrieval",
      "Knowledge Graphs",
      "Multi-Agent Review",
    ],
    links: [{ label: "Website", url: "https://parchmentlabs.com" }],
  },
  {
    id: "delphi",
    filename: "delphi",
    extension: "quant",
    title: "delphi",
    role: "Project Lead",
    date: "Jan 2026 - Present",
    category: "venture",
    summary:
      "Verification pipeline for LLM-generated quantitative strategies, built around pre-registered gates and structured rejection logs.",
    description:
      "Built a multi-stage verification system for LLM-generated quantitative strategies using a medallion-architecture data plane and a pre-registered promotion pipeline. Candidate strategies move through statistical screening, out-of-sample validation, and paper-trading stages, each with explicit acceptance criteria. Every rejection records the failed check, threshold, and realized statistic, creating an auditable dataset of LLM-generated artifact failure modes.",
    metrics: [
      "Bronze/silver/gold data plane with pre-specified promotion criteria",
      "Phase-2 validation infrastructure operational",
      "Structured rejection logging for every failed strategy",
      "Generalizes to AI-safety evaluation where models propose high-stakes actions",
    ],
    tech: [
      "Python",
      "Quant Research",
      "LLM Evaluation",
      "Audit Trails",
      "Data Pipelines",
    ],
  },
  {
    id: "agentbreed",
    filename: "agentbreed",
    extension: "study",
    title: "agentbreed",
    role: "Lead Author",
    date: "Mar 2026 - Present",
    category: "research",
    summary:
      "Pre-registered empirical study of multi-agent LLM configuration optimization across ForecastBench, LiveCodeBench, and GPQA Diamond.",
    description:
      "Designed a timestamped, git-pinned protocol before any real-model run. The study benchmarks Qwen3-32B-Instruct and Llama-3.3-70B-Instruct across ForecastBench, LiveCodeBench v6, and GPQA Diamond with an 8-method optimization ladder including random search, coordinate descent, Bayesian optimization, successive halving, and genetic variants. The analysis plan uses linear mixed-effects models with equivalence bounds and Sobol-based sensitivity decomposition.",
    metrics: [
      "509 unit and fuzz tests surfaced 23 issues before data collection",
      "Detected a parse-failure bias equal to 0.021 absolute score, 40% of the primary-hypothesis decision threshold",
      "Published a deviation log after a pilot variance-decomposition bug before launching the main study",
      "Deployed on 2x H200 via vast.ai",
    ],
    tech: [
      "LLM Evaluation",
      "Pre-registration",
      "Fuzz Testing",
      "Mixed-Effects Models",
      "H200",
    ],
  },
  {
    id: "maze-rl-baselines",
    filename: "MazeRLBaselines",
    extension: "py",
    title: "Maze RL Baselines",
    role: "Lead Author",
    date: "Feb 2026 - Apr 2026",
    category: "research",
    summary:
      "Empirical study showing reward-driven deep RL fails to discover simple maze policies that behavioral cloning and a 5-line heuristic solve.",
    description:
      "Ran a reproducible study on reward-driven discovery failure in deep RL on procedural mazes. DQN, DRQN, PPO, and A2C with matched hyperparameter sweeps perform near a uniform random walk on 9x9 mazes, while a behavior-cloning MLP with identical architecture, observation, and optimizer reaches 97.4% test success. Initializing DQN from the BC-distilled weights and fine-tuning with the same shaped reward collapses test success from 97.2% to 13.6% across all 5 seeds.",
    metrics: [
      "5-line egocentric wall-following heuristic solves 100% of unseen 9x9 mazes",
      "Best of seven HP-tuned reward-driven baselines reaches 31.4%, statistically tied with Random at 32.7%",
      "Replicated on MiniGrid DoorKey, FourRooms, MultiRoom, and Unlock",
      "3,500+ runs, about 40 GPU-hours plus H200 cluster time, public regenerable data",
    ],
    tech: [
      "PyTorch",
      "Stable-Baselines3",
      "Gymnasium",
      "MiniGrid",
      "Behavioral Cloning",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/maze-rl-baselines" }],
  },
  {
    id: "seal-lab",
    filename: "SEAL_Lab",
    extension: "log",
    title: "SEAL Lab, University of Washington",
    role: "Research Associate",
    date: "Mar 2025 - Nov 2025",
    category: "research",
    summary:
      "Embedded sensing work across PPG drowsiness detection and piezoelectric hull-integrity sensing.",
    description:
      "Worked under Prof. Alex Mamishev in the Sensors, Energy, and Automation Laboratory. Built a PPG drowsiness-detection wearable with a transimpedance front-end, 4th-order Butterworth filter from 0.5-5 Hz, 12-bit ADC at 100 Hz, and adaptive noise cancellation. Built piezoelectric hull-integrity sensing for a U.S. Navy program using PZT arrays, charge amplification, real-time 512-point FFT at 10 kHz, and acoustic-emission classification.",
    metrics: [
      "95% motion-artifact rejection on the PPG wearable",
      "Impact vs fatigue-crack propagation classification for Navy hull sensing",
      "Co-authored technical sections of 2 funded grant proposals across a 7-person team",
      "Surveyed 40+ papers on PPG signal processing and embedded anomaly detection",
    ],
    tech: [
      "Embedded C/C++",
      "Analog Front Ends",
      "DSP",
      "PZT Sensors",
      "Python",
    ],
  },
  {
    id: "niist",
    filename: "NIIST_Solar",
    extension: "dat",
    title: "NIIST-CSIR, India",
    role: "Research Intern",
    date: "Jun 2024 - Mar 2025",
    category: "research",
    summary:
      "Solar-cell fabrication and characterization in Dr. Suraj Soman's world-record DSC efficiency group.",
    description:
      "Fabricated and characterized dye-sensitized and perovskite solar cells at the Centre for Sustainable Energy Technologies. Work included N719 on mesoporous TiO2, iodide/triiodide electrolyte, spiro-OMeTAD over MAPbI3, IV curves with Dyenamo Toolbox, photo-induced absorption spectroscopy for recombination kinetics, IPCE for spectral response, and XRD with Scherrer grain-size analysis.",
    metrics: [
      "20+ DSC and perovskite device architectures fabricated and characterized",
      "PIA, IPCE, IV, and XRD characterization workflows",
      "Worked under Dr. Suraj Soman in a world-record DSC efficiency group",
    ],
    tech: [
      "Solar Cells",
      "Spectroscopy",
      "XRD",
      "Materials Characterization",
      "Cleanroom Processing",
    ],
  },
  {
    id: "plasmafx",
    filename: "PlasmaX",
    extension: "sys",
    title: "PlasmaX",
    role: "Founder & CTO",
    date: "",
    category: "industry",
    summary:
      "Decentralised on-site nitrogen production for ammonia synthesis. $2M seed; first $180K production unit shipped; 13 deployments contracted.",
    description:
      "Engineered an industrial plasma system for decentralised on-site nitrogen production used in ammonia synthesis. Designed a custom 18 kV AC flyback driver at 23 kHz with under 2 W quiescent draw, plus an STM32-based PID control loop for gas flow, voltage regulation, thermal management, and MOSFET-driven power stages with real-time ADC feedback. Shipped $180K first production unit, contracted 13 deployments, filed 2 provisional patents, co-authored 3 peer-reviewed publications.",
    metrics: [
      "$2M seed closed at $8M post-money valuation",
      "$180K first production unit sold to CSIR-CFTRI India",
      "13 revenue-generating deployments contracted across Indian commercial packhouses",
      "2 provisional patents filed on venturi-plasma integration architecture",
      "3 peer-reviewed publications on RONS kinetics and antimicrobial efficacy",
    ],
    tech: [
      "Deep Tech",
      "Plasma Hardware",
      "Agriculture",
      "Nitrogen",
    ],
    links: [
      { label: "Website", url: "https://plasmax.in" },
      { label: "DOI: 10.1088/1361-6463/ad77de", url: "https://doi.org/10.1088/1361-6463/ad77de" },
    ],
  },
  {
    id: "parameter-golf",
    filename: "ParameterGolf",
    extension: "pt",
    title: "OpenAI Parameter Golf",
    role: "Model Craft Challenge",
    date: "Apr 2026 - Present",
    category: "competition",
    summary:
      "Building a compact transformer for track_10min_16mb under the competition's 10-minute wallclock and 16 MB parameter constraints. Result in progress.",
    description:
      "The current experiment uses a 3.7M-parameter decoder-only transformer, a custom BPE pipeline, bounded run orchestration, and configuration comparisons across architecture, optimization, scheduling, batching, and data order. The code and experiment design are public; no immutable competition result is published yet.",
    metrics: [
      "Competition result in progress",
      "10-minute training wallclock and 16 MB parameter budget",
      "3.7M-parameter candidate architecture",
      "Reproducible backend and run logging",
    ],
    tech: [
      "PyTorch",
      "Transformers",
      "Custom BPE",
      "H100/Slurm",
      "Welch's t",
    ],
  },
  {
    id: "forge",
    filename: "Forge",
    extension: "pkg",
    title: "Forge",
    role: "Creator",
    date: "Feb 2026",
    category: "open-source",
    summary:
      "Provider-agnostic multi-agent LLM runtime with YAML agents, 8 providers, memory, tools, and observability.",
    description:
      "Open-source multi-agent LLM runtime with 4,400+ LOC across Python and TypeScript. It supports declarative YAML agents, LiteLLM routing across 8 providers, pluggable memory with SQLite and ChromaDB, 6 built-in tools, sequential/parallel/supervisor patterns, and FastAPI plus WebSocket observability with a Next.js dashboard.",
    metrics: [
      "4,400+ LOC across Python and TypeScript",
      "8 LLM providers via LiteLLM",
      "150+ clones in week one",
      "FastAPI + WebSocket observability with a Next.js dashboard",
    ],
    tech: [
      "Python",
      "TypeScript",
      "FastAPI",
      "LiteLLM",
      "ChromaDB",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/Forge" }],
  },
  {
    id: "engram",
    filename: "Engram",
    extension: "rs",
    title: "Engram",
    role: "Creator",
    date: "Apr 2026",
    category: "open-source",
    summary:
      "Continuous-learning framework with biologically inspired local learning, persistent memory, and a safety kernel.",
    description:
      "Open-source continuous-learning framework across Rust, TypeScript, and Python implementing biologically inspired neural regions with local Hebbian learning rules and neuromodulatory reward signals. It uses no backprop, optimizer, or training loop. The system includes prioritized experience replay with TD-error-weighted sampling, associative and episodic memory with persistent cross-session state, and a safety kernel that gates dangerous actions before execution.",
    metrics: [
      "300K+ LOC across Rust core, Python bindings, and TypeScript dashboard",
      "No backprop, optimizer, or retraining loop",
      "Online adaptation in real time on edge hardware",
      "Safety kernel gates dangerous actions before execution",
    ],
    tech: [
      "Rust",
      "TypeScript",
      "Python",
      "Hebbian Learning",
      "Edge AI",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/engram" }],
  },
  {
    id: "wireml",
    filename: "WireML",
    extension: "ts",
    title: "WireML",
    role: "Creator",
    date: "Apr 2026",
    category: "open-source",
    summary:
      "Node-graph workbench for foundation models, browser-first through WebGPU with portable local-runtime graphs.",
    description:
      "Teachable Machine re-imagined for modern foundation models. WireML runs browser-first via WebGPU with zero-backend hosted mode, while the Python runtime auto-detects CUDA, MPS, MLX, ROCm, DirectML, XPU, or CPU. Data sources, backbones, training heads, evaluators, and deployers are draggable nodes. CLIP, DINOv2, SigLIP, Whisper, and MediaPipe ship out of the box with Hugging Face Hub support.",
    metrics: [
      "Zero-backend hosted mode running entirely on WebGPU in-browser",
      "Portable graphs serialize to single JSON files",
      "Same graph runs in-browser and on the local runtime",
      "Foundation models out of the box: CLIP, DINOv2, SigLIP, Whisper, MediaPipe",
    ],
    tech: [
      "TypeScript",
      "WebGPU",
      "Python",
      "Hugging Face",
      "Foundation Models",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/wireml" }],
  },
  {
    id: "knowledge-engine",
    filename: "KnowledgeEngine",
    extension: "py",
    title: "Knowledge Engine",
    role: "Creator",
    date: "Apr 2026",
    category: "open-source",
    summary:
      "Personal knowledge graph that converts saved content into searchable, compounding technical leverage.",
    description:
      "Platform for converting saved content into compounding technical leverage. It ingests bookmarks, highlights, articles, and notes into a queryable knowledge graph with semantic search, enabling reasoning across disparate sources.",
    metrics: [
      "Multi-platform ingestion from bookmarks, highlights, articles, and notes",
      "Queryable knowledge graph with semantic search",
      "Designed for reasoning across disconnected technical context",
    ],
    tech: [
      "Python",
      "Knowledge Graphs",
      "Vector Search",
      "Ingestion Pipelines",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/knowledge-engine" }],
  },
  {
    id: "claude-nexus",
    filename: "ClaudeNexus",
    extension: "ts",
    title: "claude-nexus",
    role: "Creator",
    date: "Mar 2026",
    category: "open-source",
    summary:
      "Real-time coordination layer for Claude Code agents with shared context, task queues, and adversarial review.",
    description:
      "Real-time multi-agent coordination in TypeScript: WebSocket relay with automatic peer discovery, shared context store with causal ordering, priority task queue with work-stealing, adversarial code-review protocol, sandboxed remote command execution, and cross-network auto-tunneling.",
    metrics: [
      "About 3K LOC in TypeScript",
      "Auto peer discovery and causal shared context",
      "Priority work-stealing queue",
      "Adversarial code-review protocol",
    ],
    tech: [
      "TypeScript",
      "WebSocket",
      "Multi-Agent Coordination",
      "Remote Execution",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/claude-nexus" }],
  },
  {
    id: "ai-agent-city",
    filename: "AIAgentCity",
    extension: "py",
    title: "ai-agent-city",
    role: "Creator",
    date: "Mar 2026",
    category: "open-source",
    summary:
      "Autonomous AI civilization simulator with persistent agents, economy, relationships, and organizations.",
    description:
      "Persistent multi-agent simulation with a real economy, trading, resource management, emergent social dynamics, and simulated urban interaction. Agents develop relationships, trade, form organizations, and evolve behavior over time.",
    metrics: [
      "Persistent agents with evolving social state",
      "Trading and resource-management economy",
      "Emergent organizations and relationship dynamics",
    ],
    tech: [
      "Python",
      "Agent Simulation",
      "Economics Engine",
      "Emergent Behavior",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/ai-agent-city" }],
  },
  {
    id: "mimic",
    filename: "Mimic",
    extension: "py",
    title: "Mimic",
    role: "Creator",
    date: "Mar 2026",
    category: "open-source",
    summary:
      "Robotics imitation-learning pipeline around MuJoCo Franka control, LeRobot recording, and dual-policy training.",
    description:
      "End-to-end robotics imitation-learning pipeline with 41 modules and 103 tests. It streams a MuJoCo Franka Panda 7-DOF simulation at 60 FPS via FastAPI and aiortc WebRTC, uses damped Jacobian pseudoinverse IK, records with LeRobot v3 to Parquet and MP4, trains Action Chunking Transformer and DDPM Diffusion Policy with cosine noise, exports ONNX, and integrates with Hugging Face Hub.",
    metrics: [
      "41 modules and 103 tests",
      "MuJoCo Franka Panda streamed at 60 FPS over WebRTC",
      "ACT and DDPM Diffusion Policy training",
      "ONNX export and Hugging Face Hub integration",
    ],
    tech: [
      "MuJoCo",
      "FastAPI",
      "WebRTC",
      "LeRobot",
      "PyTorch",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/mimic" }],
  },
  {
    id: "icordion",
    filename: "iCordion",
    extension: "app",
    title: "iCordion",
    role: "Creator",
    date: "Mar 2026",
    category: "open-source",
    summary:
      "iPhone-to-virtual-accordion instrument using accelerometer bellows and Web Audio synthesis.",
    description:
      "Real-time accelerometer-to-bellows mapping with dynamic filter sweep, musette tuning via three detuned oscillators per note, two octaves of chromatic treble keys, six bass/chord buttons, and a self-signed HTTPS local server for iOS accelerometer access.",
    metrics: [
      "DeviceMotion API maps phone motion to bellows pressure",
      "Three detuned oscillators per note via Web Audio API",
      "Self-signed HTTPS local server for iOS sensor permission",
    ],
    tech: [
      "JavaScript",
      "Web Audio API",
      "DeviceMotion API",
      "Node.js",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/icordion" }],
  },
  {
    id: "delulu",
    filename: "DeluluIsNotTheSolulu",
    extension: "app",
    title: "deluluisnotthesolulu",
    role: "Creator",
    date: "Feb 2026",
    category: "open-source",
    summary:
      "Local-first relationship analytics from chat screenshots with privacy as a hard constraint.",
    description:
      "100% local relationship analytics engine. No data leaves the device. On-device ML analyzes communication patterns, attachment styles, and relationship dynamics from chat screenshots while preserving privacy.",
    metrics: [
      "100% local processing",
      "No cloud uploads or server-side analysis",
      "On-device ML inference for communication patterns",
    ],
    tech: [
      "React Native",
      "On-Device ML",
      "Privacy",
      "Local Storage",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/deluluisnotthesolulu" }],
  },
  {
    id: "cerulean",
    filename: "CeruleanROV",
    extension: "hw",
    title: "Cerulean Robotics",
    role: "Project Lead",
    date: "Nov 2025 - Present",
    category: "venture",
    summary:
      "Open-source underwater robots for lake-health monitoring with Pixhawk, ArduSub, and custom power electronics.",
    description:
      "Built open-source underwater robots for lake-health monitoring: vectored 5-thruster configuration on Pixhawk 4 and ArduSub with MAVLink, RPi 5 H.264 video via GStreamer over CAT6 tether under 100 ms latency, custom KiCad MOSFET power distribution with 4x IRF3205, 6S Li-ion 22.2 V / 5 Ah battery, current sensing, over-current protection, and waterproofed acrylic housings rated to 100 m with dual O-ring seals.",
    metrics: [
      "28 units deployed across Washington",
      "4-figure MRR",
      "King County LOI for Lake Sammamish environmental auditing",
      "100 m-rated dual O-ring acrylic housings",
    ],
    tech: [
      "Pixhawk/ArduSub",
      "MAVLink",
      "GStreamer",
      "KiCad",
      "Power Electronics",
    ],
  },
  {
    id: "tejas-os",
    filename: "tejas-os",
    extension: "site",
    title: "tejas-os",
    role: "Creator",
    date: "Apr 2026",
    category: "open-source",
    summary:
      "Personal portfolio site for showing the work a one-page resume cannot carry cleanly.",
    description:
      "Personal portfolio site for showing the systems, research, and stories that a traditional resume falls too short for. Built with Next.js, TypeScript, structured content data, and an editorial profile surface.",
    metrics: [
      "Public portfolio at tejasnaladala.com",
      "Next.js App Router and TypeScript",
      "Curated CV surfaces for recruiters, researchers, and collaborators",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "Content Design",
    ],
  },
];
