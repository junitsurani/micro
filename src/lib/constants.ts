export const SITE_TITLE = "Micro by The Fix";
export const SITE_TAGLINE = "Chelsea Wellness Space";
export const SITE_DESCRIPTION =
  "A sensory movement space in Chelsea, London, architected to settle the nervous system before the body moves.";

export const NAV_LINKS = [
  { label: "Access", href: "/access" },
] as const;

export const SECONDARY_NAV = [] as const;

export const CONTACT_INFO = {
  phone: { display: "+44 7500 805226", href: "tel:+447500805226" },
  email: { display: "hello@microbythefix.com", href: "mailto:hello@microbythefix.com" },
} as const;

export const SOCIAL_LINKS = [] as const;

export const MINDBODY_BOOKING_URL =
  process.env.NEXT_PUBLIC_MINDBODY_BOOKING_URL?.trim() ?? "";

export const MINDBODY_BOOKING_LABEL = "Book Cannes activation";

export const SERVICE_CATEGORIES = [
  {
    title: "Movement",
    image: "/images/variants/ecosystem-movement-v1.png",
    alt: "Abstract warm silk folds suggesting movement and controlled strength",
    href: "/access",
  },
  {
    title: "Recovery",
    image: "/images/variants/ecosystem-recovery-v1.png",
    alt: "Abstract dark water ripple with warm amber reflection",
    href: "/access",
  },
  {
    title: "Nutrition",
    image: "/images/variants/ecosystem-nutrition-v2.png",
    alt: "Abstract clay and plaster texture in warm raking light",
    href: "/access",
  },
] as const;

export const FEATURED_PROJECTS = [
  {
    title: "The Studio",
    slug: "",
    image: "/micro-generated/featured-the-studio.png",
    products: [
      "Lagree Microformer",
      "Controlled strength",
      "Low impact",
      "Precision",
    ],
  },
  {
    title: "The Method",
    slug: "the-method",
    image: "/micro-generated/featured-the-method.png",
    products: [
      "Nervous system",
      "Recovery",
      "Longevity",
      "Internal shift",
    ],
  },
  {
    title: "The Community",
    slug: "the-community",
    image: "/micro-generated/featured-the-community.png",
    products: [
      "Founding access",
      "Member journeys",
      "Connection",
    ],
  },
  {
    title: "The Digital Layer",
    slug: "digital-layer",
    image: "/micro-generated/featured-digital-layer.png",
    products: [
      "CRM journeys",
      "Bookings",
      "Digital products",
    ],
  },
] as const;

export const TESTIMONIALS: readonly { name: string; role: string; quote: string; image: string }[] = [];

export const BUSINESS_HOURS = "Monday – Sunday, 9am – 5pm";

export const SERVICE_AREAS =
  "Chelsea, SW3";

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Ground",
    description: "Architected to settle the nervous system before the body moves.",
  },
  {
    step: 2,
    title: "Ignite",
    description: "Strength through precision, not force. Structure beneath the surface.",
  },
  {
    step: 3,
    title: "Restore",
    description: "Strength built, the nervous system settled, the kind of change that holds.",
  },
  {
    step: 4,
    title: "Circle 001",
    description: "Sixty founding memberships. By invitation only.",
  },
  {
    step: 5,
    title: "More life",
    description: "Built for a life lived well, not only a life lived longer.",
  },
] as const;
