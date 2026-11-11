import React from "react";
import {
  Code2,
  Globe,
  Palette,
  Cpu,
  Compass,
  type LucideIcon,
} from "lucide-react";

const SOLUTION_ICON_MAP: Record<string, LucideIcon> = {
  software: Code2,
  web: Globe,
  design: Palette,
  ai: Cpu,
  digital: Compass,
};

export function SolutionIcon({
  id,
  className = "h-5 w-5",
}: {
  id: string;
  className?: string;
}) {
  const Icon = SOLUTION_ICON_MAP[id] ?? Code2;
  return <Icon className={className} aria-hidden="true" />;
}
