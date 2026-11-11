import { describe, expect, it } from "vitest";
import { BRAND_COLORS, PRIMARY_NAV, SITE_CONFIG } from "@/data/site";
import { FOUNDING_TEAM } from "@/data/team";
import { SOLUTION_AREAS } from "@/data/solutions";
import { WORK_DEMONSTRATIONS } from "@/data/work";
import { PLANNED_INSIGHTS } from "@/data/insights";

describe("Eagle Technology brand & factual integrity", () => {
  it("uses the exact official slogan and Ethiopian origin", () => {
    expect(SITE_CONFIG.name).toBe("Eagle Technology");
    expect(SITE_CONFIG.slogan).toBe("See Further. Build Smarter.");
    expect(SITE_CONFIG.origin.toLowerCase()).toContain("ethiopian");
  });

  it("includes the three official primary brand colors", () => {
    const hexes = BRAND_COLORS.map((c) => c.hex);
    expect(hexes).toContain("#4B2E0F");
    expect(hexes).toContain("#B87333");
    expect(hexes).toContain("#FFFFFF");
  });

  it("includes all six blueprint navigation sections", () => {
    const labels = PRIMARY_NAV.map((n) => n.label);
    expect(labels).toEqual([
      "Home",
      "About Us",
      "Solutions",
      "Our Work",
      "Insights",
      "Contact",
    ]);
  });

  it("represents strictly the five founding roles without invented employees", () => {
    expect(FOUNDING_TEAM).toHaveLength(5);
    expect(FOUNDING_TEAM.map((m) => m.roleTitle)).toEqual([
      "Founder & Chief Executive Officer (CEO)",
      "Frontend Developer",
      "Backend Developer",
      "Graphic Designer & Video Editor",
      "AI & Automation Specialist",
    ]);
  });

  it("covers the five initial proposed solution areas", () => {
    expect(SOLUTION_AREAS).toHaveLength(5);
  });

  it("labels pre-launch work demonstrations and insights honestly as placeholders", () => {
    expect(WORK_DEMONSTRATIONS.every((w) => w.isPlaceholder)).toBe(true);
    expect(PLANNED_INSIGHTS.every((i) => i.isPlaceholder)).toBe(true);
  });
});
