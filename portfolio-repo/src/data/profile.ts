// ─────────────────────────────────────────────────────────────
// All your personal content lives in this one file.
// Edit it and the whole site updates. Empty strings are hidden.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: "Suhruth",
  lastName: "Sai",
  fullName: "K. Suhruth Sai",
  initials: "KSS",
  role: "AI/ML Engineer",
  roles: ["AI/ML Engineer", "Multi-Agent AI Builder", "Digital Twin Developer"],
  tagline:
    "I build digital twins and multi-agent AI systems — from a 3D twin of an entire campus to research agents that critique and fact-check their own work.",
  photo: "portrait.webp", // background-removed portrait in /public
  location: "Hyderabad, India",
  status: "Open to AI/ML internships & 2027 roles",

  links: {
    github: "https://github.com/suhruthsai",
    linkedin: "", // e.g. https://www.linkedin.com/in/your-handle
    email: "", // e.g. you@example.com
    resume: "", // public link to your résumé PDF (Google Drive, etc.)
  },

  about:
    "I'm an Information Technology student at MVSR Engineering College who likes problems where software meets the physical world. I turn real places and machines into live 3D digital twins, and I build teams of AI agents that search, reason, critique and write together. Hackathons are where I do my best work: fast, with a team, against a real problem.",
};

export const services = [
  {
    title: "Multi-Agent AI",
    blurb:
      "Pipelines of specialised LLM agents that search, critique, reflect and write — with vector memory and knowledge graphs underneath.",
    tags: ["LangGraph", "LangChain", "ChromaDB", "Neo4j", "Ollama", "FastAPI"],
  },
  {
    title: "Digital Twins",
    blurb:
      "Live 3D replicas of real systems: a GPS-anchored campus with timetable-aware rooms, and an aero engine's health in real time.",
    tags: ["Three.js", "React", "Zustand", "SQLAlchemy", "Real-time data"],
  },
  {
    title: "Applied ML & NLP",
    blurb:
      "Turning messy documents and data into structured, validated information people can act on.",
    tags: ["Python", "spaCy", "Tesseract OCR", "Sentence-transformers", "Streamlit"],
  },
];

export type Project = {
  code: string;
  name: string;
  kind: string;
  summary: string;
  detail: string;
  status: string;
  team?: string;
  link?: string;
};

export const projects: Project[] = [
  {
    code: "CS-10",
    name: "CampusSphere",
    kind: "3D digital twin · React · Three.js · FastAPI",
    summary: "A real-time 3D twin of the campus with timetable-aware classrooms and an AI campus assistant.",
    detail:
      "29 structures anchored to real GPS coordinates, 466 timetable entries driving live free/occupied rooms, 3D classroom walkthroughs with student and faculty avatars, and a multi-camera CCTV wall.",
    status: "Major project",
    team: "with M. Ritesh & V. Chanti · guide D. Muninder",
    link: "https://github.com/suhruthsai/campusSphere",
  },
  {
    code: "MARA",
    name: "Multi-Agent Research Assistant",
    kind: "LangGraph · ChromaDB · Neo4j · Next.js",
    summary: "A team of AI agents that finds papers, critiques them, and writes a fact-checked literature review.",
    detail:
      "Search, critic, synthesis, writer and hypothesis agents run as a LangGraph graph with a self-reflection loop that re-searches when confidence is low. An earlier version adds a Neo4j knowledge graph, a verification agent and live agent status over WebSockets.",
    status: "Agentic AI",
    link: "https://github.com/suhruthsai/mara",
  },
  {
    code: "SIH26054",
    name: "GarudaAstra",
    kind: "Digital twin · aero piston engines · MALE UAVs",
    summary: "Real-time engine health monitoring and fault prediction for long-endurance drones.",
    detail:
      "Smart India Hackathon 2026. Our team cleared the college internal round — top 50 of 150 teams — and is aiming for the Grand Finale.",
    status: "Top 50 / 150",
    team: "Team GarudaAstra · 6 members",
  },
  {
    code: "DEET",
    name: "DEET Smart Registration",
    kind: "OCR · NLP · Streamlit",
    summary: "An AI résumé parser for Telangana's Digital Employment Exchange.",
    detail:
      "Reads PDF and image résumés with Tesseract OCR, extracts details with spaCy, flags suspicious entries, scores résumé completeness from 0–100, supports voice input, and outputs a DEET-ready JSON payload.",
    status: "Hackathon",
    link: "https://github.com/suhruthsai/hackathon",
  },
  {
    code: "SIH26130",
    name: "AnumatiOne",
    kind: "GovTech · approvals & compliance",
    summary: "One window for industrial approvals, compliance and government support services.",
    detail:
      "Smart India Hackathon 2026. Replaces chasing each department separately with a single streamlined process.",
    status: "SIH 2026",
  },
];

export const timeline = [
  {
    when: "2025 — 2027",
    title: "Event Coordinator",
    place: "AIMERS",
    text: "Planning and running events for AIMERS.",
  },
  {
    when: "Sep 2026",
    title: "SIH 2026 — Internal Round Cleared",
    place: "Team GarudaAstra",
    text: "Selected in the top 50 of 150 teams for the UAV engine digital-twin problem. Built two SIH projects this season.",
  },
  {
    when: "Mar 2026",
    title: "KLH Hackathon — Top 37",
    place: "Hackathon",
    text: "Finished in the top 37 out of 247 teams.",
  },
  {
    when: "2023 — 2027",
    title: "B.Tech, Information Technology",
    place: "MVSR Engineering College, Hyderabad",
    text: "Department of Information Technology. CGPA 7.5. Major project: CampusSphere.",
  },
  {
    when: "2021 — 2023",
    title: "Intermediate",
    place: "Narayana Junior College, Banjara Hills, Hyderabad",
    text: "Scored 872.",
  },
  {
    when: "2012 — 2020",
    title: "Schooling · CBSE",
    place: "P. Obul Reddy Public School, Hyderabad",
    text: "Scored 80% in the CBSE board exams. Rose to the rank of Sergeant in the NCC.",
  },
];
