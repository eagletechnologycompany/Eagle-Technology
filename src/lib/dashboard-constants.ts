export type RoleId = "ceo" | "frontend" | "backend" | "design" | "ai_automation" | "client";

export const PERMISSIONS = [
  "project.view",
  "project.create",
  "project.edit",
  "project.archive",
  "task.view",
  "task.create",
  "task.assign",
  "task.edit",
  "task.delete",
  "comment.create",
  "document.view",
  "document.upload",
  "document.delete",
  "decision.create",
  "decision.approve",
  "team.view",
  "goal.create",
  "goal.edit",
  "audit.view",
  "settings.manage",
  "portal.view",
  "portal.deliverables",
  "portal.requests",
  "developer.access",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export interface RoleDefinition {
  id: RoleId;
  title: string;
  shortTitle: string;
  username: string;
  placeholderLabel: string;
  responsibilities: string[];
  permissions: Permission[];
}

const CONTRIBUTOR_PERMISSIONS: Permission[] = [
  "project.view",
  "task.view",
  "task.create",
  "task.edit",
  "comment.create",
  "document.view",
  "document.upload",
  "decision.create",
  "team.view",
];

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  ceo: {
    id: "ceo",
    title: "Founder & Chief Executive Officer",
    shortTitle: "Founder & CEO",
    username: "ceo",
    placeholderLabel: "Role Profile · Founder & CEO (Name Pending)",
    responsibilities: [
      "Company direction",
      "Strategy",
      "Business development",
      "Customer relationships",
      "Team coordination",
      "Project priorities",
      "Project management",
      "Social media coordination",
      "Company performance review",
      "Key decision-making",
    ],
    permissions: [...PERMISSIONS],
  },
  frontend: {
    id: "frontend",
    title: "Frontend Developer",
    shortTitle: "Frontend Dev",
    username: "frontend",
    placeholderLabel: "Role Profile · Frontend Developer (Name Pending)",
    responsibilities: [
      "Responsive user interfaces",
      "Reusable frontend components",
      "UI implementation",
      "Frontend API integration",
      "Accessibility",
      "Usability",
      "Frontend code quality",
    ],
    permissions: [...CONTRIBUTOR_PERMISSIONS],
  },
  backend: {
    id: "backend",
    title: "Backend Developer",
    shortTitle: "Backend Dev",
    username: "backend",
    placeholderLabel: "Role Profile · Backend Developer (Name Pending)",
    responsibilities: [
      "Server-side applications",
      "Database architecture",
      "APIs",
      "Integrations",
      "Authentication",
      "Authorization",
      "Security",
      "Backend performance",
      "Reliability",
      "Deployment support",
    ],
    permissions: [...CONTRIBUTOR_PERMISSIONS],
  },
  design: {
    id: "design",
    title: "Graphic Designer & Video Editor",
    shortTitle: "Design & Video",
    username: "design",
    placeholderLabel: "Role Profile · Graphic Designer & Video Editor (Name Pending)",
    responsibilities: [
      "Graphic design",
      "Brand assets",
      "Marketing materials",
      "Video production",
      "Video editing",
      "Social media content",
      "Website visual assets",
      "Creative direction",
    ],
    permissions: [...CONTRIBUTOR_PERMISSIONS],
  },
  ai_automation: {
    id: "ai_automation",
    title: "AI & Automation Specialist",
    shortTitle: "AI & Automation",
    username: "ai-automation",
    placeholderLabel: "Role Profile · AI & Automation Specialist (Name Pending)",
    responsibilities: [
      "AI research",
      "AI integrations",
      "Automation opportunities",
      "Intelligent workflows",
      "Productivity systems",
      "AI-powered features",
      "Technology evaluation",
      "Collaboration with developers",
    ],
    permissions: [...CONTRIBUTOR_PERMISSIONS],
  },
  client: {
    id: "client",
    title: "Registered Customer & Project Participant",
    shortTitle: "Customer Portal",
    username: "client",
    placeholderLabel: "Client Account · Alpha Project Participant",
    responsibilities: [
      "Project requirements and milestone feedback",
      "Deliverables review and sign-off",
      "Change request submissions",
      "Developer API and sandbox integration testing",
    ],
    permissions: [
      "project.view",
      "task.view",
      "document.view",
      "portal.view",
      "portal.deliverables",
      "portal.requests",
      "developer.access",
    ],
  },
};

export const FOUNDER_ROLE_IDS: RoleId[] = [
  "ceo",
  "frontend",
  "backend",
  "design",
  "ai_automation",
];

export const ROLE_LIST: RoleDefinition[] = Object.values(ROLE_DEFINITIONS);

export const TASK_STATUSES = [
  "Backlog",
  "Ready",
  "In Progress",
  "In Review",
  "Blocked",
  "Completed",
  "Archived",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_TYPES = [
  "Strategy",
  "Business Development",
  "Development",
  "Design",
  "AI & Automation",
  "Content",
  "Marketing",
  "Administration",
  "Research",
  "Documentation",
  "Bug",
  "Maintenance",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const PROJECT_STATUSES = [
  "Idea",
  "Discovery",
  "Planning",
  "Active",
  "On Hold",
  "In Review",
  "Delivered",
  "Archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PHASES = [
  "Identify",
  "Define",
  "Plan",
  "Assign",
  "Execute",
  "Review",
  "Deliver",
  "Evaluate",
] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

export const GOAL_STATUSES = [
  "Not started",
  "In progress",
  "At risk",
  "Completed",
  "Archived",
] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const DECISION_STATUSES = [
  "Proposed",
  "Under discussion",
  "Approved",
  "Rejected",
  "Deferred",
  "Superseded",
] as const;
export type DecisionStatus = (typeof DECISION_STATUSES)[number];

export const MEETING_TYPES = [
  "Weekly team meeting",
  "Project review meeting",
  "Monthly company review",
] as const;
export type MeetingType = (typeof MEETING_TYPES)[number];

export const DOCUMENT_CATEGORIES = [
  "Company Foundation",
  "Brand Guidelines",
  "Company Profile",
  "Service Portfolio",
  "Project Management",
  "Technical Documentation",
  "Proposals",
  "Contracts",
  "Finance",
  "Legal",
  "Creative Assets",
  "Meeting Notes",
  "Research",
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const DOCUMENT_ACCESS_LEVELS = [
  { value: "all_founders", label: "All founders" },
  { value: "ceo_only", label: "CEO only" },
  { value: "project_members", label: "Project members" },
  { value: "selected_roles", label: "Selected roles" },
] as const;
export type DocumentAccessLevel =
  (typeof DOCUMENT_ACCESS_LEVELS)[number]["value"];

export const INITIAL_COMPANY_FOCUS_AREAS = [
  "Establish a clear company foundation",
  "Finalize brand identity",
  "Define deliverable services",
  "Build the official website",
  "Prepare a company profile",
  "Prepare a service portfolio",
  "Create credible demonstrations",
  "Conduct customer discovery",
  "Establish project-management habits",
  "Prepare for first customer opportunities",
] as const;
