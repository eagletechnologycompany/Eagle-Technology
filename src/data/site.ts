export interface NavItem {
  href: string;
  label: string;
}

export const SITE_CONFIG = {
  name: "Eagle Technology",
  shortName: "EAGLE",
  slogan: "See Further. Build Smarter.",
  origin: "Ethiopian-founded technology company",
  initialMarket: "Ethiopia",
  longTermAmbition: "Africa and international markets",
  teamSizeLabel: "5-person founding team",
  stageLabel: "Early-stage foundation · Honest & capability-driven",
  description:
    "Eagle Technology is an Ethiopian-founded technology company focused on software development, web development, digital platforms, UI/UX design, AI and automation, and digital transformation solutions.",
  heroSupportingMessage:
    "We turn ideas and real-world challenges into meaningful digital solutions through technology, creativity, and innovation.",
  contact: {
    emailPlaceholder: "hello@eagle-technology.placeholder",
    emailNotice: "Placeholder — replace once official company email is provisioned",
    location: "Ethiopia (Official office address pending confirmation)",
    socialNotice: "Official social media accounts pending setup (Roadmap Month 2)",
  },
} as const;

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Solutions" },
  { href: "/work", label: "Our Work" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const BRAND_COLORS = [
  { name: "Dark Brown", hex: "#4B2E0F", role: "Primary brand & headings", token: "--color-dark-brown" },
  { name: "Brown Gold", hex: "#B87333", role: "Primary accent & CTAs", token: "--color-brown-gold" },
  { name: "White", hex: "#FFFFFF", role: "Clean surfaces & dark-mode text", token: "--color-white" },
  { name: "Deep Brown", hex: "#241507", role: "Dark sections & body ink", token: "--color-deep-brown" },
  { name: "Warm Off-White", hex: "#FBF8F3", role: "Primary page canvas", token: "--color-warm-off-white" },
  { name: "Soft Sand", hex: "#EADCCB", role: "Hairline borders & dividers", token: "--color-soft-sand" },
  { name: "Muted Brown", hex: "#765B40", role: "Secondary text & captions", token: "--color-muted-brown" },
  { name: "Pale Gold", hex: "#F4E7D6", role: "Subtle surface highlights", token: "--color-pale-gold" },
] as const;
