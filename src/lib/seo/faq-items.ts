/**
 * Shared FAQ copy for UI + FAQPage JSON-LD (AI/search).
 * Keep in sync with Contact FAQ section only through this file.
 */
export const CONTACT_FAQ_ITEMS = [
  {
    q: "Where is MICRO launching?",
    a: "MICRO by The Fix is opening at 60 Sloane Avenue, Chelsea, London SW3 3AP.",
  },
  {
    q: "What is the method?",
    a: "The Lagree Microformer sits at the centre, with proprietary formats built around it. Light, scent and sound do the quiet work before practice begins.",
  },
  {
    q: "Is this only a fitness studio?",
    a: "No. MICRO brings together movement, recovery and nutrition in a sensory movement space architected to settle the nervous system before the body moves.",
  },
  {
    q: "Can I join before opening?",
    a: "Yes. Submit your details to request founding access, membership updates, booking information, and launch announcements.",
  },
  {
    q: "Who is MICRO for?",
    a: "MICRO is for the exhausted and the curious, the first-timer and the lifelong athlete. It meets you where you are.",
  },
  {
    q: "Will there be digital products?",
    a: "The long-term vision includes a scalable digital foundation for CRM journeys, booking flows, member engagement, and wellness experiences beyond the physical studio.",
  },
  {
    q: "When will bookings open?",
    a: "Booking opens to the founding list first, in phases.",
  },
  {
    q: "How will MICRO feel?",
    a: "Experienced, not observed. A space composed to do its own work before practice begins.",
  },
  {
    q: "How do I get updates?",
    a: "Request access to the founding list for Chelsea.",
  },
] as const;

export function getFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTACT_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
