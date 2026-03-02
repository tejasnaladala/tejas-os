import { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages & Frameworks",
    icon: "code",
    skills: [
      { name: "Python", level: "Expert", barFill: 12 },
      { name: "TypeScript/JS", level: "Expert", barFill: 12 },
      { name: "C/C++", level: "Advanced", barFill: 10 },
      { name: "Java", level: "Proficient", barFill: 8 },
      { name: "SQL", level: "Proficient", barFill: 8 },
      { name: "MATLAB/Simulink", level: "Capable", barFill: 6 },
      { name: "Next.js / React", level: "Expert", barFill: 12 },
      { name: "FastAPI / Node.js", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "Embedded & Hardware",
    icon: "cpu",
    skills: [
      { name: "Circuit Design (Analog/Digital)", level: "Expert", barFill: 12 },
      { name: "PCB Design (KiCad)", level: "Advanced", barFill: 10 },
      { name: "STM32 / Arduino / RPi", level: "Expert", barFill: 12 },
      { name: "Pixhawk / ArduSub", level: "Advanced", barFill: 10 },
      { name: "MOSFET Power Electronics", level: "Advanced", barFill: 10 },
      { name: "Oscilloscope / Logic Analyzer", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "AI & Machine Learning",
    icon: "brain",
    skills: [
      { name: "LLM Orchestration", level: "Expert", barFill: 12 },
      { name: "Multi-Agent Systems", level: "Expert", barFill: 12 },
      { name: "RAG Pipelines", level: "Advanced", barFill: 10 },
      { name: "TensorFlow / OpenCV", level: "Proficient", barFill: 8 },
      { name: "Document AI / PDF Parsing", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "Design & Fabrication",
    icon: "wrench",
    skills: [
      { name: "Fusion360 / SolidWorks / Rhino", level: "Expert", barFill: 12 },
      { name: "3D Printing", level: "Advanced", barFill: 10 },
      { name: "CNC / Lathe / Laser Cutting", level: "Advanced", barFill: 10 },
      { name: "Soldering", level: "Expert", barFill: 12 },
    ],
  },
  {
    name: "DevOps & Tools",
    icon: "terminal",
    skills: [
      { name: "Git / GitHub", level: "Expert", barFill: 12 },
      { name: "Docker", level: "Advanced", barFill: 10 },
      { name: "Linux", level: "Advanced", barFill: 10 },
      { name: "ROS / Gazebo", level: "Proficient", barFill: 8 },
    ],
  },
];
