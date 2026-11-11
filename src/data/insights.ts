export interface InsightTopic {
  id: string;
  category: string;
  title: string;
  summary: string;
  status: string;
  isPlaceholder: true;
}

/**
 * Per Blueprint Part 3 Section 14.5:
 * "This section can be introduced after the initial website launch if content
 * production is not yet sustainable."
 * No fabricated publication dates, fake authors, or pretend readership metrics.
 */
export const PLANNED_INSIGHTS: InsightTopic[] = [
  {
    id: "problem-first-digital-adoption",
    category: "Digital Transformation",
    title: "Why Problem-First Thinking Matters Before Choosing Software",
    summary:
      "Planned editorial outline examining how Ethiopian SMEs and organizations can evaluate operational bottlenecks before investing in custom software.",
    status: "Editorial Placeholder · Post-Launch",
    isPlaceholder: true,
  },
  {
    id: "practical-ai-for-small-teams",
    category: "AI & Automation",
    title: "Practical Workflow Automation for Small Founding & Business Teams",
    summary:
      "Planned technical note exploring realistic, maintainable ways to reduce repetitive manual work without over-engineering.",
    status: "Editorial Placeholder · Post-Launch",
    isPlaceholder: true,
  },
  {
    id: "accessible-web-engineering",
    category: "Software & Web Engineering",
    title: "Designing Fast, Accessible Web Platforms for Diverse Connectivity",
    summary:
      "Planned engineering guide covering responsive layout discipline, asset optimization, and clean frontend-backend integration.",
    status: "Editorial Placeholder · Post-Launch",
    isPlaceholder: true,
  },
];
