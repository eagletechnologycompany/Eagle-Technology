export interface SolutionArea {
  id: string;
  name: string;
  shortExplanation: string;
  problemAddressed: string;
  deliverables: string[];
  capabilities: string[];
  statusNote: string;
}

export const SOLUTION_AREAS: SolutionArea[] = [
  {
    id: "software",
    name: "Software Development",
    shortExplanation:
      "Custom business applications and management systems designed around how your organization actually works.",
    problemAddressed:
      "Manual record-keeping, fragmented spreadsheets, and disconnected operational workflows that slow teams down.",
    deliverables: [
      "Custom business applications",
      "Internal management systems",
      "Web-based operational platforms",
      "Structured business process solutions",
    ],
    capabilities: [
      "Full-stack architecture (React, Next.js, Node.js)",
      "Relational database design & API engineering",
      "Role-based access and authentication",
    ],
    statusNote: "Proposed initial focus area — scoped per discovery with the founding team.",
  },
  {
    id: "web",
    name: "Web Development & Digital Platforms",
    shortExplanation:
      "Modern, responsive websites and web applications built for clarity, speed, and reliable accessibility.",
    problemAddressed:
      "Limited digital visibility, outdated websites, or hard-to-use online service interfaces.",
    deliverables: [
      "Official company & organization websites",
      "Interactive web applications",
      "Online service portals & platforms",
      "Accessible, responsive digital interfaces",
    ],
    capabilities: [
      "Responsive mobile, tablet, and desktop layouts",
      "SEO metadata and performance optimization",
      "Maintainable component systems",
    ],
    statusNote: "Proposed initial focus area — scoped per discovery with the founding team.",
  },
  {
    id: "design",
    name: "UI/UX & Creative Design",
    shortExplanation:
      "User-centered interface design, visual brand systems, and digital media that communicate with clarity.",
    problemAddressed:
      "Confusing user journeys, inconsistent visual branding, and unclear digital communication.",
    deliverables: [
      "User interface (UI) & user experience (UX) design",
      "Brand identity & graphic design assets",
      "Marketing & social visual communication",
      "Video editing & digital media production",
    ],
    capabilities: [
      "Figma wireframing & design systems",
      "Consistent color, typography, and layout craft",
      "Visual storytelling & motion assets",
    ],
    statusNote: "Proposed initial focus area — aligned with approved brand guidelines.",
  },
  {
    id: "ai",
    name: "AI & Automation",
    shortExplanation:
      "Practical AI integrations and workflow automation aimed at reducing repetitive manual tasks.",
    problemAddressed:
      "Time-consuming repetitive tasks, manual data routing, and missed productivity improvements.",
    deliverables: [
      "Workflow automation pipelines",
      "Practical AI-powered application features",
      "API & tool integrations",
      "Process productivity evaluations",
    ],
    capabilities: [
      "Automation tool evaluation & integration",
      "AI-assisted search, triage, and summarization workflows",
      "Collaboration between AI, frontend, and backend engineering",
    ],
    statusNote: "Proposed initial focus area — focused on practical, verifiable use cases.",
  },
  {
    id: "digital",
    name: "Digital Transformation Solutions",
    shortExplanation:
      "Step-by-step business digitization and technology adoption tailored to real organizational readiness.",
    problemAddressed:
      "Organizations wanting to modernize operations without adopting overly complex or unsustainable tools.",
    deliverables: [
      "Digital process assessment & improvement plans",
      "Practical technology adoption roadmaps",
      "Business digitization implementation",
      "Team onboarding & maintainability documentation",
    ],
    capabilities: [
      "Problem-first discovery workshops",
      "Incremental, sustainable system rollouts",
      "Clear documentation & handover",
    ],
    statusNote: "Proposed initial focus area — tailored to Ethiopian organizational contexts.",
  },
];

export const LONG_TERM_OPPORTUNITIES = [
  "Proprietary software products",
  "SaaS platforms tailored for regional needs",
  "AI-powered productivity products",
  "Enterprise technology solutions",
  "Advanced workflow automation systems",
] as const;

export const INTENDED_TARGET_SECTORS = [
  "Small and medium-sized businesses (SMEs)",
  "Startups and entrepreneurs",
  "Private companies",
  "Educational institutions",
  "NGOs and development organizations",
  "Government and public institutions",
] as const;
