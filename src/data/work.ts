export interface WorkConcept {
  id: string;
  title: string;
  category: string;
  status: string;
  isPlaceholder: true;
  problemOrOpportunity: string;
  proposedSolution: string;
  technologyStack: string[];
  teamContribution: string;
  outcomeNote: string;
}

/**
 * Per the Eagle Technology Company Blueprint (Part 3 Section 14.4 & Part 6 Month 2-3):
 * Never invent clients, testimonials, project results, or partnerships.
 * These entries represent honest pre-launch demonstration slots aligned with the
 * 90-day roadmap goal of preparing 2-3 credible internal demonstration projects.
 */
export const WORK_DEMONSTRATIONS: WorkConcept[] = [
  {
    id: "demo-official-web",
    title: "Eagle Technology Digital Identity Platform",
    category: "Web Development & Brand System",
    status: "Internal Build · Active Foundation",
    isPlaceholder: true,
    problemOrOpportunity:
      "Establish Eagle Technology's primary digital identity with transparent positioning, centralized design tokens, and accessible multi-page navigation.",
    proposedSolution:
      "A responsive Next.js and Tailwind CSS web platform reflecting the official Dark Brown, Brown Gold, and White identity with clear inquiry flows.",
    technologyStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons"],
    teamContribution:
      "Jointly structured across CEO direction, Frontend engineering, Backend inquiry validation, Brand Design, and documentation.",
    outcomeNote:
      "Internal foundation project — no external client metrics claimed.",
  },
  {
    id: "demo-operations-portal",
    title: "SME Operations & Inventory Demonstration Concept",
    category: "Software Development · Placeholder Slot",
    status: "Demonstration Placeholder · Roadmap Month 2–3",
    isPlaceholder: true,
    problemOrOpportunity:
      "[Placeholder] Many growing businesses manage daily requests, stock, and reporting in disconnected spreadsheets, causing delays and inconsistent records.",
    proposedSolution:
      "[Placeholder] A clean web-based management portal demonstration showcasing structured data models, role-based access, and clear operational reporting.",
    technologyStack: ["Next.js", "Node.js", "PostgreSQL / MySQL (Planned)", "Tailwind CSS"],
    teamContribution:
      "Planned collaboration between Backend architecture, Frontend interface engineering, and UI/UX design.",
    outcomeNote:
      "Pre-launch demonstration concept — awaiting team build and verification. Not a claimed client deployment.",
  },
  {
    id: "demo-workflow-automation",
    title: "Inquiry & Document Workflow Automation Prototype",
    category: "AI & Automation · Placeholder Slot",
    status: "Demonstration Placeholder · Roadmap Month 2–3",
    isPlaceholder: true,
    problemOrOpportunity:
      "[Placeholder] Repetitive administrative sorting, inquiry routing, and status updates consume valuable time for small teams.",
    proposedSolution:
      "[Placeholder] A lightweight workflow automation prototype demonstrating structured intake, categorization, and human-in-the-loop review.",
    technologyStack: ["TypeScript", "API Integrations", "Workflow Automation"],
    teamContribution:
      "Led by the AI & Automation Specialist alongside Backend and Frontend engineering.",
    outcomeNote:
      "Experimental prototype slot — outcomes will only be published after real testing and verification.",
  },
];
