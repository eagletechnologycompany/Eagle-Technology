export interface FoundingMember {
  id: string;
  order: number;
  roleTitle: string;
  placeholderName: string;
  portraitPlaceholder: string;
  primaryResponsibility: string;
  responsibilities: string[];
  earlyStageNote?: string;
}

export const FOUNDING_TEAM: FoundingMember[] = [
  {
    id: "ceo",
    order: 1,
    roleTitle: "Founder & Chief Executive Officer (CEO)",
    placeholderName: "[Founder Name — Placeholder]",
    portraitPlaceholder: "Portrait Placeholder · 01",
    primaryResponsibility: "Company leadership and overall direction.",
    responsibilities: [
      "Defining the company's direction and priorities",
      "Developing business and growth strategies",
      "Leading and coordinating the founding team",
      "Managing project priorities, timelines, and progress",
      "Representing Eagle in business and partnership discussions",
      "Supporting customer discovery and relationships",
      "Managing company social media presence at this stage",
    ],
    earlyStageNote:
      "At this early stage, the CEO also coordinates project management and social media activities.",
  },
  {
    id: "frontend",
    order: 2,
    roleTitle: "Frontend Developer",
    placeholderName: "[Frontend Lead Name — Placeholder]",
    portraitPlaceholder: "Portrait Placeholder · 02",
    primaryResponsibility: "Frontend engineering and user interfaces.",
    responsibilities: [
      "Developing responsive web interfaces across mobile, tablet, and desktop",
      "Implementing approved UI/UX designs faithfully",
      "Building reusable frontend components",
      "Integrating frontend applications with backend APIs",
      "Improving usability, accessibility, and performance",
      "Maintaining frontend code quality",
    ],
  },
  {
    id: "backend",
    order: 3,
    roleTitle: "Backend Developer",
    placeholderName: "[Backend Lead Name — Placeholder]",
    portraitPlaceholder: "Portrait Placeholder · 03",
    primaryResponsibility: "Backend engineering and system architecture.",
    responsibilities: [
      "Developing reliable server-side applications",
      "Designing and managing structured databases",
      "Building secure APIs and service integrations",
      "Implementing authentication and authorization",
      "Maintaining system security, reliability, and performance",
      "Supporting system deployment and maintenance",
    ],
  },
  {
    id: "design",
    order: 4,
    roleTitle: "Graphic Designer & Video Editor",
    placeholderName: "[Design & Media Name — Placeholder]",
    portraitPlaceholder: "Portrait Placeholder · 04",
    primaryResponsibility: "Visual communication and creative production.",
    responsibilities: [
      "Creating graphic designs and digital brand assets",
      "Maintaining visual consistency with official Eagle brand guidelines",
      "Designing marketing and communication materials",
      "Producing and editing video content",
      "Supporting website visual assets and social media content",
      "Contributing to overall creative direction",
    ],
  },
  {
    id: "ai-automation",
    order: 5,
    roleTitle: "AI & Automation Specialist",
    placeholderName: "[AI & Automation Name — Placeholder]",
    portraitPlaceholder: "Portrait Placeholder · 05",
    primaryResponsibility: "AI integration and automation solutions.",
    responsibilities: [
      "Researching relevant and practical AI technologies",
      "Exploring practical AI applications for business workflows",
      "Developing AI-powered features and integrations",
      "Identifying repetitive tasks suitable for automation",
      "Building workflow automation solutions",
      "Collaborating with developers on intelligent features",
    ],
  },
];
