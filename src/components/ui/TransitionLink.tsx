"use client";

import { useCallback, forwardRef, type AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { usePageTransition } from "@/components/layout/TransitionProvider";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, children, onClick, ...rest }, ref) {
    const { triggerTransition, isTransitioning } = usePageTransition();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isTransitioning) {
          e.preventDefault();
          return;
        }

        const isInternal = href.startsWith("/") || href.startsWith("#");
        const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

        if (isInternal && !isModified) {
          e.preventDefault();
          onClick?.(e);
          try {
            triggerTransition(href);
          } catch {
            window.location.href = href;
          }
        }
      },
      [href, triggerTransition, isTransitioning, onClick]
    );

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }
);

export default TransitionLink;
