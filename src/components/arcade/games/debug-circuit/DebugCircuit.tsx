"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type GateType = "AND" | "OR" | "NOT" | "XOR";

interface Gate {
  id: number;
  type: GateType;
  inputs: number[]; // indices into signals array or other gate outputs
  label: string;
}

interface Level {
  inputs: boolean[];
  gates: Gate[];
  connections: number[][]; // for each gate, which signal indices feed into it
  outputGateIndex: number;
  expectedOutput: boolean;
  bugIndex: number;
  correctGateType: GateType;
}

function evalGate(type: GateType, inputs: boolean[]): boolean {
  switch (type) {
    case "AND": return inputs.every(Boolean);
    case "OR": return inputs.some(Boolean);
    case "NOT": return !inputs[0];
    case "XOR": return inputs.reduce((a, b) => a !== b, false);
  }
}

function evalCircuit(level: Level, gateOverrides?: Record<number, GateType>): boolean {
  const signals = [...level.inputs];
  for (let i = 0; i < level.gates.length; i++) {
    const gate = level.gates[i];
    const gType = gateOverrides?.[i] ?? gate.type;
    const gInputs = level.connections[i].map((si) => signals[si]);
    signals.push(evalGate(gType, gInputs));
  }
  return signals[level.inputs.length + level.outputGateIndex];
}

const LEVELS: Level[] = [
  {
    inputs: [true, false],
    gates: [{ id: 0, type: "AND", inputs: [0, 1], label: "G1" }],
    connections: [[0, 1]],
    outputGateIndex: 0,
    expectedOutput: true,
    bugIndex: 0,
    correctGateType: "OR",
  },
  {
    inputs: [true, true],
    gates: [
      { id: 0, type: "AND", inputs: [0, 1], label: "G1" },
      { id: 1, type: "AND", inputs: [0, 1], label: "G2" },
    ],
    connections: [[0, 1], [0, 1]],
    outputGateIndex: 1,
    expectedOutput: false,
    bugIndex: 1,
    correctGateType: "XOR",
  },
  {
    inputs: [false, true, true],
    gates: [
      { id: 0, type: "OR", inputs: [0, 1], label: "G1" },
      { id: 1, type: "AND", inputs: [1, 2], label: "G2" },
      { id: 2, type: "OR", inputs: [], label: "G3" },
    ],
    connections: [[0, 1], [1, 2], [3, 4]],
    outputGateIndex: 2,
    expectedOutput: false,
    bugIndex: 2,
    correctGateType: "AND",
  },
  {
    inputs: [true, false, true],
    gates: [
      { id: 0, type: "XOR", inputs: [0, 1], label: "G1" },
      { id: 1, type: "OR", inputs: [1, 2], label: "G2" },
      { id: 2, type: "AND", inputs: [], label: "G3" },
    ],
    connections: [[0, 1], [1, 2], [3, 4]],
    outputGateIndex: 2,
    expectedOutput: false,
    bugIndex: 1,
    correctGateType: "AND",
  },
  {
    inputs: [true, true, false, true],
    gates: [
      { id: 0, type: "AND", inputs: [0, 1], label: "G1" },
      { id: 1, type: "OR", inputs: [2, 3], label: "G2" },
      { id: 2, type: "XOR", inputs: [], label: "G3" },
      { id: 3, type: "AND", inputs: [], label: "G4" },
    ],
    connections: [[0, 1], [2, 3], [4, 5], [5, 6]],
    outputGateIndex: 3,
    expectedOutput: true,
    bugIndex: 2,
    correctGateType: "AND",
  },
];

const GATE_OPTIONS: GateType[] = ["AND", "OR", "NOT", "XOR"];

export default function DebugCircuit() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());

  const level = LEVELS[levelIdx];
  const actualOutput = evalCircuit(level);

  const handleGateClick = useCallback((gateIdx: number) => {
    if (found) return;
    setSelectedGate(gateIdx);
    setWrong(null);
  }, [found]);

  const handleTypeSelect = useCallback((type: GateType) => {
    if (selectedGate === null || found) return;
    if (selectedGate === level.bugIndex && type === level.correctGateType) {
      setFound(true);
      const elapsed = (Date.now() - startTime.current) / 1000;
      const bonus = Math.max(0, Math.floor(100 - elapsed * 2));
      setScore((s) => s + 50 + bonus);
    } else {
      setWrong(selectedGate);
      setSelectedGate(null);
    }
  }, [selectedGate, found, level]);

  const nextLevel = useCallback(() => {
    if (levelIdx + 1 >= LEVELS.length) {
      setDone(true);
    } else {
      setLevelIdx((l) => l + 1);
      setSelectedGate(null);
      setFound(false);
      setWrong(null);
      startTime.current = Date.now();
    }
  }, [levelIdx]);

  const restart = useCallback(() => {
    setLevelIdx(0);
    setSelectedGate(null);
    setFound(false);
    setWrong(null);
    setScore(0);
    setDone(false);
    startTime.current = Date.now();
  }, []);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  if (done) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent-green)", marginBottom: 12 }}>ALL CIRCUITS DEBUGGED!</div>
        <div style={{ fontSize: 18, marginBottom: 24 }}>Final Score: {score}</div>
        <button onClick={restart} style={{ background: "var(--accent-green)", color: "var(--bg-primary)", border: "none", borderRadius: 4, padding: "8px 24px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>PLAY AGAIN</button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", background: "var(--bg-primary)", fontFamily: "var(--font-mono)", color: "var(--text-primary)", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ color: "var(--accent-amber)", fontWeight: 700 }}>Level {levelIdx + 1}/5</span>
        <span style={{ color: "var(--text-secondary)" }}>Score: {score}</span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Expected: </span>
        <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>{level.expectedOutput ? "1 (TRUE)" : "0 (FALSE)"}</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 13, marginLeft: 20 }}>Actual: </span>
        <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>{actualOutput ? "1 (TRUE)" : "0 (FALSE)"}</span>
      </div>

      {/* Inputs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: 12, marginRight: 8 }}>INPUTS:</span>
        {level.inputs.map((v, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, padding: "6px 12px", fontSize: 14, fontWeight: 700, color: v ? "var(--accent-green)" : "var(--accent-red)" }}>
            {v ? "1" : "0"}
          </div>
        ))}
      </div>

      {/* Gates */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {level.gates.map((gate, idx) => {
          const isBug = found && idx === level.bugIndex;
          const isWrong = wrong === idx;
          const isSelected = selectedGate === idx;
          const inputLabels = level.connections[idx].map((si) =>
            si < level.inputs.length ? `IN${si}` : `G${si - level.inputs.length + 1}`
          );
          return (
            <div key={idx} onClick={() => handleGateClick(idx)} style={{
              background: "var(--bg-elevated)",
              border: `2px solid ${isBug ? "var(--accent-green)" : isWrong ? "var(--accent-red)" : isSelected ? "var(--accent-amber)" : "var(--border)"}`,
              borderRadius: 8,
              padding: "12px 18px",
              cursor: found ? "default" : "pointer",
              minWidth: 100,
              textAlign: "center",
              transition: "border-color 0.2s",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{gate.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: isBug ? "var(--accent-red)" : "var(--text-primary)" }}>
                {isBug ? (
                  <><s>{gate.type}</s> <span style={{ color: "var(--accent-green)" }}>{level.correctGateType}</span></>
                ) : gate.type}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>
                ({inputLabels.join(", ")})
                {idx === level.outputGateIndex && <span style={{ color: "var(--accent-amber)" }}> [OUT]</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gate type selector */}
      {selectedGate !== null && !found && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 8 }}>Select correct gate type for {level.gates[selectedGate].label}:</div>
          <div style={{ display: "flex", gap: 8 }}>
            {GATE_OPTIONS.map((type) => (
              <button key={type} onClick={() => handleTypeSelect(type)} style={{
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "6px 16px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {wrong !== null && <div style={{ color: "var(--accent-red)", fontSize: 13, marginBottom: 12 }}>Wrong gate or type! Try again.</div>}

      {found && (
        <div style={{ marginTop: 8 }}>
          <div style={{ color: "var(--accent-green)", fontSize: 14, marginBottom: 12 }}>Bug found! The {level.gates[level.bugIndex].label} gate should be {level.correctGateType}.</div>
          <button onClick={nextLevel} style={{ background: "var(--accent-green)", color: "var(--bg-primary)", border: "none", borderRadius: 4, padding: "8px 20px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {levelIdx + 1 >= LEVELS.length ? "FINISH" : "NEXT LEVEL"}
          </button>
        </div>
      )}
    </div>
  );
}
