# Research - Tejas Naladala

> I wrote down the answers that held up.

Canonical profile: https://tejasnaladala.com/profile.json
Last updated: 2026-09-01

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
