"use client";

import { useRef, useState, useCallback } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function AccessFaq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="access-faq-list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className={`access-faq-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="access-faq-summary"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span aria-hidden="true" className="access-faq-icon">+</span>
            </button>
            <div
              ref={(el) => { contentRefs.current[i] = el; }}
              className="faq-answer"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="faq-answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
