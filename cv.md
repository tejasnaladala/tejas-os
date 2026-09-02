# Tejas Naladala - CV

> i'm an engineer, researcher, entrepreneur, and angel investor based in Seattle, WA.

Tejas Naladala is a 19-year-old Engineering student at the University of Washington, founder of R0 Systems, and an empirical machine-learning researcher.

- Location: Seattle, Washington, United States
- Email: [naladala@uw.edu](mailto:naladala@uw.edu?subject=Hello%20Tejas)
- GitHub: https://github.com/tejasnaladala
- LinkedIn: https://www.linkedin.com/in/tejasnaladala
- Google Scholar: https://scholar.google.com/citations?user=7901XFQAAAAJ
- Canonical machine record: https://tejasnaladala.com/profile.json
- Last updated: 2026-09-02

## Current work

- Founder & CEO, [R0 Systems](https://fuckchlorine.com/) (Jun 2024 - Present): Plasma-activated-water equipment for produce wash lines.
- Engineering student, [University of Washington](https://www.washington.edu/) (Aug 2025 - Jun 2028, expected)
- MTEB-Gym: label-free embedding evaluation (in progress): When can label-free embedding evaluation produce a trustworthy model ranking?
- Regional Cabled Array expedition RR2607 (in progress): Can methane-bubble flux be estimated while the experiment is 2,900 meters underwater?

## Education

- Engineering, [University of Washington](https://www.washington.edu/) (Aug 2025 - Jun 2028, expected)

## Research interests

- machine-learning engineering
- AI evaluation research
- AI safety and alignment evaluation
- embedded systems
- robotics
- hardware product development
- technical founding

## Evidence policy

Claims in profile.json identify their evidence, evidence tier, confidence, and current status. In-progress research keeps its limitations in the record. Missing evidence is not treated as proof.

## Experience

## [R0 Systems](https://fuckchlorine.com/)
**Founder & CEO**
Jun 2024 - Present

- I founded R0 to replace chlorine on produce wash lines with plasma-activated water generated on demand from air, water, and electricity, and bootstrapped it to 6-figure revenue.
- I designed every part of the machine, including the patent-pending plasma reactor and microbubble generator, Venturi gas transfer at 22 L/min, drive electronics, and an STM32 hard real-time dosing loop in C/C++. The full system runs on 44 watts.
- In validation, R0 outperformed chlorine on disinfection without chlorate or perchlorate residue, kept produce fresh 3x longer, and ran cheaper than incumbent chemistry. Three peer-reviewed papers, two pending patents, and independent national food-safety laboratory studies back the work.

## [OpenTrade](https://opentrade.live/)
**Machine Learning Engineer**
Jun 2026 - Sep 2026

- I joined as OpenTrade's first ML hire and owned the decision path from live market data to grounded LLM-generated trade cards to the personalized ranking determining what each user saw.
- Replaced hand-tuned feed ordering with a learned ranking model built from user interaction, content, recency, and market-context signals and evaluated releases through offline replay and product behavior.
- Built a factual-accuracy and regression harness for generated financial content, checking grounding against live market data, numerical consistency, temporal validity, unsupported claims, and structured-output compliance across model and prompt releases.
- Closed the model-data loop by turning impressions and downstream user behavior into evaluation and training signals, with pre-registered launch hypotheses, primary metrics, and guardrails before shipping to production.
- Built backend and serverless API routes serving model outputs, integrated external market-data providers, and owned testing, deployment, and CI for a product that grew from launch to roughly 150,000 monthly users in two months.

## [Sensors, Energy, and Automation Laboratory](https://www.uwseal.org/)
**Research Associate**
Mar 2025 - Nov 2025

- Engineered a real-time PPG drowsiness wearable from sensor to signal pipeline, including a transimpedance front end, fourth-order Butterworth filtering, 100 Hz 12-bit acquisition, and adaptive noise cancellation rejecting 95% of motion artifact.
- Built a PZT-array acoustic-emission system for U.S. Navy hull-integrity monitoring, using charge amplification, 10 kHz acquisition, and a real-time 512-point FFT pipeline to separate impacts from fatigue-crack signatures.
- Took sensing systems through analog design, prototype bring-up, embedded acquisition, signal processing, bench characterization, and failure analysis.
- Authored the sensing architecture, signal-processing methodology, and validation sections of two funded proposals across a seven-person research team.

## [CSIR-National Institute for Interdisciplinary Science and Technology](https://www.niist.res.in/)
**Research Associate**
Jun 2024 - Mar 2025

- Researched dye-sensitized and perovskite photovoltaics within CSIR-NIIST's indoor-light energy-harvesting program, whose dye-sensitized-cell work later reached a 40% indoor-light conversion-efficiency record.
- Fabricated complete solar cells using FTO substrates, TiO2 photoanodes, thermal processing, ruthenium sensitizers, electrolytes, counter electrodes, and sealed device assemblies.
- Ran the full optoelectronic and structural characterization stack, including J-V curves, IPCE, photoinduced absorption spectroscopy, and XRD with Scherrer crystallite-size analysis.
- Connected spectral response, charge-recombination behavior, crystallite structure, and fabrication parameters to device-level efficiency and failure modes.
- Designed controlled experiments across photoanode architecture and processing conditions, then analyzed batch variation and reproducibility across fabricated devices.

## Ingenium Naturae
**Research Engineer**
May 2023 - Jun 2024

- Delivered custom plasma and automation equipment for agri-food clients, turning incomplete requirements into commissioned machines spanning power electronics, embedded control, fluidics, reactor design, and industrial mechanics.
- Designed 20 kV discharge drivers, MOSFET switching stages, PID control loops, STM32 firmware, electrode and reactor geometries, Venturi injectors, and production CAD assemblies.
- Owned the full build cycle from client specification and system architecture through component selection, fabrication, wiring, firmware, validation, acceptance testing, documentation, and handoff.
- Debugged coupled electrical, thermal, fluidic, and mechanical failure modes on the shop floor until each machine met its operating requirements.

## Research and publications

## Research

### MTEB-Gym: label-free embedding evaluation
**Question:** When can label-free embedding evaluation produce a trustworthy model ranking?
**Dates:** Jun 2026 - Present
**Status:** in progress

- Co-developed MTEB-Gym, a label-free framework for ranking embedding models on datasets without human relevance annotations.
- Designed the judge-reliability study across 16 retrieval datasets and identified when LLM-based evaluation could and could not be trusted.
- Diagnosed task-definition mismatch as the framework's main failure mode and improved ranking quality by adding dataset-specific evaluation criteria.
- Contributed production-grade tooling to the MTEB ecosystem and built a public leaderboard that reports reliability alongside every model ranking.

**Current result:** Nine merged upstream changes cover validation, uncertainty estimates, cache behavior, deterministic parallelism, and failure handling.
**Boundary:** The active reliability study still needs a public result artifact.

Evidence: [Merged MTEB-Gym contributions by Tejas Naladala](https://github.com/embeddings-benchmark/MTEB-gym-v2/pulls?q=is%3Apr+author%3Atejasnaladala+is%3Amerged); [MTEB pull request 4790](https://github.com/embeddings-benchmark/mteb/pull/4790)

### RSNA Knee Abnormality Detection
**Question:** Which validation choices materially change a knee-MRI model's reported AUC?
**Dates:** Jul 2026 - Aug 2026
**Status:** completed

- Built a complete ML platform for the Radiological Society of North America's Knee Abnormality Detection competition, predicting 12 study-level findings from multi-plane MRI across 4,407 studies and 24,371 imaging series. I also completed an exact census of 819,078 DICOM files.
- Advanced the project's authenticated Kaggle public macro ROC-AUC from 0.618 to 0.912 across seven tracked submissions. A controlled ablation improved AUC from 0.618 to 0.764 by changing only report-derived supervision, identifying label quality as a primary modeling bottleneck.
- Implemented deterministic 2.5D ResNet-18 MIL and five-fold, three-plane EfficientNet-B3 training systems, then integrated DINO- and RadImageNet-based inference branches using rank fusion, label-specific fallback policies, and cross-label stacking.
- Engineered reproducible offline GPU execution with geometrically ordered MRI slices, hash-bound caches, mixed-precision training, RNG-complete checkpoint and resume, fresh-checkpoint inference replay, and atomic artifact publication. A private Kaggle T4 run featurized all 4,407 studies with zero failures.

**Current result:** The authenticated Kaggle public macro ROC-AUC improved from 0.618 to 0.912 across seven tracked submissions.
**Boundary:** The completed study used competition data and public leaderboard evaluation.

Evidence: [Radiological Society of North America](https://www.rsna.org/); [Tejas Naladala complete CV](https://tejasnaladala.com/assets/resume.pdf?v=20260901.15)

### AgentBreed
**Question:** How much agent performance comes from the configuration space, and how much from the search operator?
**Dates:** Mar 2026 - Jul 2026
**Status:** completed

- Designed a pre-registered study testing whether multi-agent performance depends more on the available configuration space or the search algorithm.
- Ran 700 reproducible evaluations across three domains using a deterministic simulator to separate true effects from LLM sampling noise.
- Used equivalence testing and sensitivity analysis to identify which agent-design choices meaningfully affected performance.
- Built a heavily tested research codebase and kept the study's conclusions explicitly limited to the deterministic simulator.

**Current result:** In the 700-run deterministic synthetic pilot, pairwise differences among the tested search operators did not reach Holm-corrected significance.
**Boundary:** The reported conclusions apply to the deterministic simulator used in the completed study.

Evidence: [AgentBreed repository](https://github.com/tejasnaladala/agentbreed)

### Procedural-Maze RL Baselines
**Question:** Why did modern reward-driven RL miss a policy a five-line heuristic could see?
**Dates:** Feb 2026 - Apr 2026
**Status:** completed

- Benchmarked PPO, DQN, and A2C on procedurally generated mazes against simple heuristics and behavior cloning.
- Found that the learned agents had sufficient capacity but failed because of exploration and credit-assignment limitations.
- Built a reproducible experiment pipeline with roughly 3,500 traceable run artifacts.
- Corrected the original study's validation flaw by rebuilding the evaluation around a proper held-out protocol.

**Current result:** The learned agents had sufficient capacity but failed because of exploration and credit-assignment limitations.
**Boundary:** The final evaluation uses the corrected held-out protocol.

Evidence: [Procedural-Maze RL Baselines repository](https://github.com/tejasnaladala/maze-rl-baselines)

### Connectome Architecture Benchmark
**Question:** Does biological wiring still help after density, weights, graph realizations, and trainable components are controlled?
**Dates:** Dec 2025 - Aug 2026
**Status:** completed

- Built a controlled benchmark testing whether biological connectomes provide better neural-network architectures than matched random graphs.
- Evaluated ten connectomes across six tasks while keeping the biological wiring fixed and training only the output layer.
- Found that biological structure sometimes helped, but degree distribution explained much of the advantage while exact biological wiring explained less.
- Tested the result against matched random graphs and controls for graph density, edge weights, and trainable components.

**Current result:** Biological structure sometimes helped, but degree distribution explained much of the advantage while exact biological wiring explained less.
**Boundary:** The completed analysis controlled graph density, edge weights, graph realizations, and trainable components.

Evidence: [Connectome Architecture Benchmark repository](https://github.com/tejasnaladala/connectome-bpu)

### Regional Cabled Array expedition RR2607
**Question:** Can methane-bubble flux be estimated while the experiment is 2,900 meters underwater?
**Dates:** Aug 2026 - Present
**Status:** in progress

- Building a field-to-analysis system for methane-bubble flux estimation from ROV video, sonar, hydrophone, CTD, and navigation data.
- The provenance layer keeps shipboard sources read-only and traces every derived artifact to source paths, hashes, and code versions.
- Current work covers computer vision, acoustic alignment, calibration, and held-out validation.
- Work in progress.

**Current result:** Building a provenance-aware pipeline that aligns computer vision, sonar, and field metadata.
**Boundary:** Work in progress; no final scientific result is claimed.

Evidence: [VISIONS '26](https://interactiveoceans.washington.edu/about-visions-26/); [ROV Jason](https://www.whoi.edu/what-we-do/explore/underwater-vehicles/ndsf-jason/)

## Technical notes

### VLM Inference Optimization
[Professor Zhuang Liu](https://www.cs.princeton.edu/~zhuangl/), Princeton University.
Jun 2026 - Jul 2026. technical report.

- An AlphaEvolve-style search loop produced a best single-prompt Qwen3-VL configuration at 63.25% held-out accuracy on CharXiv chart QA; its difference from the 60.5% manual prompt was not significant (p = .42).
- MAP-Elites searched prompt, parsing, formatting, and inference-code variants across a behavioral archive.
- A separately designed per-question router reached 73.0%, compared with the 29.5% naive baseline.
- The router-to-naive paired comparison gave p = 2.4e-6, and every accepted mutation retained inspectable lineage.

### Single-GPU Model Serving
[Professor Juncheng Yang](https://seas.harvard.edu/person/juncheng-yang), Harvard University.
Jun 2026 - Jun 2026. technical report.

- An 80-point vLLM matrix compared dense and mixture-of-experts models at roughly equal active-parameter budgets.
- The benchmark swept prompt length, generation length, concurrency, and serving configuration across Qwen3.5-9B and GLM-4.7-Flash.
- The dense/MoE throughput crossover appeared near concurrency three. At 49K-token generation, Qwen admitted 42 concurrent requests versus GLM's 10.
- A hardware audit caught a PCIe-throttled H100 before publication; GPQA accuracy moved by 20 points with token budget.

## Peer-reviewed publications

### [Design of systems for plasma activated water (PAW) for agri-food applications](https://doi.org/10.1088/1361-6463/ad77de)
N. N. Misra, Tejas Naladala, Khalid J. Alzahrani. Journal of Physics D: Applied Physics 57(49), 493003. Published 2024-09-17.

### [Design of a continuous plasma activated water (PAW) disinfection system for fresh produce industry](https://doi.org/10.1016/j.ifset.2024.103845)
N. N. Misra, Tejas Naladala, Khalid J. Alzahrani, V. P. Sreelakshmi, P. S. Negi. Innovative Food Science & Emerging Technologies 97, 103845. Published 2024-10.

### [Design and construction of a continuous industrial scale cold plasma equipment for fresh produce industry](https://doi.org/10.1016/j.ifset.2024.103840)
N. N. Misra, V. P. Sreelakshmi, Tejas Naladala, Khalid J. Alzahrani, P. S. Negi. Innovative Food Science & Emerging Technologies 97, 103840. Published 2024-10.

Citation snapshot: 57 citations and h-index 3 as of 2026-09.

## Other systems

- [Mimic](https://github.com/tejasnaladala/mimic): Browser teleoperation and imitation learning for a simulated Franka arm.
- [Engram](https://github.com/tejasnaladala/engram): An online-learning prototype with local plasticity and persistent memory; experimental efficacy remains unverified.
- [Forge](https://github.com/tejasnaladala/Forge): A provider-agnostic agent runtime with tools, memory, budgets, and observability.
- [WireML](https://github.com/tejasnaladala/wireml): A terminal workbench for training lightweight heads on foundation-model embeddings.
- [delphi-quant](https://github.com/tejasnaladala/delphi-quant): A retrospective verification harness for systematic strategies and legible rejection.

## Awards

- Carnegie Mellon Venture Challenge: Second place, national round (2026-03); 150+ teams; $4,500
- University of Washington Science & Technology Showcase: Grand Prize and Best Pitch (2026-01); $2,750
- Red Bull Basement: Second place (2026)
- Buerk Center Prototype Grant: Recipient (2026); $2,000

PDF: https://tejasnaladala.com/assets/resume.pdf?v=20260901.15
