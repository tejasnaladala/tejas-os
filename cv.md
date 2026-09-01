# Tejas Naladala - CV

> i'm an engineer, researcher, entrepreneur, and angel investor based in Seattle, WA.

Tejas Naladala is a 19-year-old Engineering student at the University of Washington, founder of R0 Systems, and an empirical machine-learning researcher.

- Location: Seattle, Washington, United States
- Email: [naladala@uw.edu](mailto:naladala@uw.edu?subject=Hello%20Tejas)
- GitHub: https://github.com/tejasnaladala
- LinkedIn: https://www.linkedin.com/in/tejasnaladala
- Google Scholar: https://scholar.google.com/citations?user=7901XFQAAAAJ
- Canonical machine record: https://tejasnaladala.com/profile.json
- Last updated: 2026-09-01

## Current work

- Founder & CEO, [R0 Systems](https://fuckchlorine.com/) (Jun 2024 - Present): Founded and commercialized continuous-flow plasma-activated-water equipment for post-harvest produce sanitation.
- Engineering student, [University of Washington](https://www.washington.edu/) (Aug 2025 - Jun 2028, expected)
- MTEB-Gym: label-free embedding evaluation (in progress): When can label-free embedding evaluation produce a trustworthy model ranking?
- RSNA Knee Abnormality Detection (in progress): Which validation choices materially change a knee-MRI model's reported AUC?
- AgentBreed (in progress): How much agent performance comes from the configuration space, and how much from the search operator?
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

- R0 generates produce sanitizer on site using air, water, and electricity. I bootstrapped it to six figures in revenue.
- I designed the reactor, Venturi transfer stage, water loop, controls, and field hardware.
- The machines now run continuously in customer facilities.
- Three peer-reviewed papers, two pending patents, and independent national food-safety laboratory studies document the system.
- Demonstrated up to 3x shelf-life extension at under $0.50 per ton in energy cost across tomato and leafy-green validation studies.

## [OpenTrade](https://opentrade.live/)
**Machine Learning Engineer**
Jun 2026 - Sep 2026

- As OpenTrade's first ML hire, I built market-data grounding, trade-card generation, and personalized ranking.
- Replaced hand-tuned feed ordering with a learned ranking model built from user interaction, content, recency, and market-context signals and evaluated releases through offline replay and product behavior.
- Built a factual-accuracy and regression harness for generated financial content, checking grounding against live market data, numerical consistency, temporal validity, unsupported claims, and structured-output compliance across model and prompt releases.
- Turned impressions and downstream behavior into evaluation and training signals for subsequent model releases.
- Defined launch hypotheses, primary metrics, and guardrails before each production release.
- Built backend and serverless API routes serving model outputs, integrated external market-data providers, and owned testing, deployment, and CI for a product that grew from launch to roughly 150,000 monthly users in two months.

## [Sensors, Energy, and Automation Laboratory](https://www.uwseal.org/)
**Research Associate**
Mar 2025 - Nov 2025

- Engineered a real-time PPG wearable: transimpedance front end, fourth-order Butterworth filter, 100 Hz 12-bit acquisition, and adaptive motion-artifact cancellation rejecting 95% of motion artifact.
- Built a PZT-array acoustic-emission system for U.S. Navy hull-integrity monitoring, using charge amplification, 10 kHz acquisition, and a real-time 512-point FFT pipeline to separate impacts from fatigue-crack signatures.
- Handled analog design, prototype bring-up, embedded acquisition, signal processing, bench characterization, and failure analysis.
- Authored the sensing architecture, signal-processing methodology, and validation sections of two funded proposals across a seven-person research team.

## [CSIR-National Institute for Interdisciplinary Science and Technology](https://www.niist.res.in/)
**Research Associate**
Jun 2024 - Mar 2025

- Researched dye-sensitized and perovskite photovoltaics within CSIR-NIIST's indoor-light energy-harvesting program, whose dye-sensitized-cell work later reached a 40% indoor-light conversion-efficiency record.
- Fabricated complete solar-cell devices using FTO substrates, TiO2 photoanodes, thermal processing, ruthenium sensitizers, electrolytes, counter electrodes, and sealed assemblies.
- Ran the full optoelectronic and structural characterization stack: J-V curves, IPCE, photoinduced absorption spectroscopy, and XRD with Scherrer crystallite-size analysis.
- Connected spectral response, charge-recombination behavior, crystallite structure, and fabrication parameters to device-level efficiency and failure modes.
- Designed controlled experiments across photoanode architecture and processing conditions, then analyzed batch variation and reproducibility across fabricated devices.

## Ingenium Naturae
**Research Engineer**
May 2023 - Jun 2024

- Delivered custom plasma and automation machines for agri-food clients. Each build combined power electronics, embedded control, fluidics, reactor design, and industrial mechanics.
- Designed 20 kV discharge drivers, MOSFET switching stages, PID control loops, STM32 firmware, electrode and reactor geometries, Venturi injectors, and production CAD assemblies.
- Handled client specifications, system architecture, component selection, fabrication, wiring, firmware, validation, acceptance testing, documentation, and handoff.
- Debugged coupled electrical, thermal, fluidic, and mechanical failure modes on the shop floor until each machine met its operating requirements.

## Research and publications

## Research

### MTEB-Gym: label-free embedding evaluation
**Question:** When can label-free embedding evaluation produce a trustworthy model ranking?
**Dates:** Jun 2026 - Present
**Status:** in progress

- Co-developed MTEB-Gym, a label-free framework for ranking embedding models on datasets without human relevance annotations.
- Worked on bidirectional judging, validation, uncertainty estimates, and failure handling for label-free rankings.
- Merged nine changes covering validation, uncertainty estimates, caching, deterministic parallelism, and failure handling.

**Current result:** Nine merged upstream changes cover validation, uncertainty estimates, cache behavior, deterministic parallelism, and failure handling.
**Boundary:** The active reliability study still needs a public result artifact.

Evidence: [Merged MTEB-Gym contributions by Tejas Naladala](https://github.com/embeddings-benchmark/MTEB-gym-v2/pulls?q=is%3Apr+author%3Atejasnaladala+is%3Amerged); [MTEB pull request 4790](https://github.com/embeddings-benchmark/mteb/pull/4790)

### RSNA Knee Abnormality Detection
**Question:** Which validation choices materially change a knee-MRI model's reported AUC?
**Dates:** Jul 2026 - Present
**Status:** in progress

- Built a knee-MRI evaluation pipeline around ordered slices, hierarchical 2.5D multiple-instance learning, and study-level aggregation.
- Added patient/study splits, fold-integrity checks, leakage audits, label-quality analysis, and metric-consistency tests to the experiment path.
- In progress.

**Current result:** The current artifact covers study-level aggregation, leakage checks, fold audits, and metric-consistency tests.
**Boundary:** In progress.

Evidence: [Radiological Society of North America](https://www.rsna.org/); [Tejas Naladala complete CV](https://tejasnaladala.com/assets/resume.pdf?v=20260901.15)

### AgentBreed
**Question:** How much agent performance comes from the configuration space, and how much from the search operator?
**Dates:** Mar 2026 - Present
**Status:** in progress

- Designed a preregistered study of configuration-space richness and search algorithms in multi-agent systems.
- Ran 700 reproducible evaluations across three domains in a deterministic simulator.
- Compared search operators with Holm-corrected pairwise tests; none reached corrected significance in the synthetic pilot.
- The real-LLM replication is preregistered and pending; current results cover the simulator.

**Current result:** In the 700-run deterministic synthetic pilot, pairwise differences among the tested search operators did not reach Holm-corrected significance.
**Boundary:** This result does not establish equivalence among search operators. The real-LLM replication is preregistered and pending, and the current sensitivity-analysis output is not used for inference.

Evidence: [AgentBreed repository](https://github.com/tejasnaladala/agentbreed)

### Procedural-Maze RL Baselines
**Question:** Why did modern reward-driven RL miss a policy a five-line heuristic could see?
**Dates:** Feb 2026 - Apr 2026
**Status:** artifact reconciliation

- Benchmarked PPO, DQN, and A2C on procedurally generated mazes against simple heuristics and behavior cloning.
- The policy class can express strong maze-solving behavior; reward-driven training struggled to reach it consistently.
- The public repository includes experiment code, run records, manifests, and a result verifier.
- Later runs outgrew the pinned manifest. Artifact reconciliation is in progress before final reporting.

**Current result:** The policy class can express strong maze-solving behavior; reward-driven training struggled to reach it consistently.
**Boundary:** Later runs outgrew the pinned manifest. Artifact reconciliation is in progress before final reporting.

Evidence: [Procedural-Maze RL Baselines repository](https://github.com/tejasnaladala/maze-rl-baselines)

### Connectome Architecture Benchmark
**Question:** Does biological wiring still help after density, weights, graph realizations, and trainable components are controlled?
**Dates:** Dec 2025 - Present
**Status:** corrected run pending

- Built a controlled benchmark for biological connectomes and matched random graphs.
- Audited and invalidated the original 757-row pilot after finding control-density, provenance, optimizer, and evaluation failures.
- Rebuilt CAB v2 around digest-bound measured connectomes, readout-only optimization, and nulls matched on exact edge count and weight distribution.
- CAB v2 is implemented and tested. The full corrected run is pending.

**Current result:** The first pass found confounds in null-graph density, weight distributions, dataset provenance, and what the optimizer was allowed to train.
**Boundary:** The original 757-row artifact is invalidated. CAB v2 awaits a full corrected run.

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
