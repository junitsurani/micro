export const TIMING = {
  fast: 0.3,
  medium: 0.5,
  slow: 0.8,
  xslow: 1.2,
} as const;

export const EASING = {
  inOutQuart: [0.77, 0, 0.175, 1] as const,
  inOutCubic: [0.645, 0.045, 0.355, 1] as const,
  inOutQuad: [0.455, 0.03, 0.515, 0.955] as const,
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  outCubic: [0.215, 0.61, 0.355, 1] as const,
  outQuad: [0.25, 0.46, 0.45, 0.94] as const,
} as const;

export const STAGGER = {
  links: 0.02,
  cards: 0.08,
  text: 0.04,
} as const;
