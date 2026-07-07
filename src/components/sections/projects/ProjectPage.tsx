"use client";

import Image from "next/image";
import { useServicePageAnimations } from "@/hooks/useServicePageAnimations";
import { usePageTransition } from "@/components/layout/TransitionProvider";
import { useLenis } from "@/components/layout/LenisProvider";
import TransitionLink from "@/components/ui/TransitionLink";

export interface ProjectData {
  eyebrow: string;
  title: string;
  tagline: string;
  heroImage: string;
  sections: SectionBlock[];
  specs: SpecItem[];
  specsLabel: string;
  next?: {
    href: string;
    label: string;
    title: string;
    image: string;
  };
}

type SectionBlock =
  | { type: "text"; label: string; heading: string; bodies: string[] }
  | { type: "asset"; image: string; expand?: boolean }
  | { type: "duo"; variant: "wide-left" | "wide-right"; wideImage: string; narrowImage: string };

interface SpecItem {
  name: string;
  desc: string;
}

export default function ProjectPage({ data }: { data: ProjectData }) {
  const { triggerTransition } = usePageTransition();
  const { lenis } = useLenis();
  const containerRef = useServicePageAnimations({ triggerTransition, lenis });

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="sp-hero">
        <div className="sp-hero__stack">
          <p className="sp-hero__eyebrow">{data.eyebrow}</p>
          <h1
            className="sp-hero__title"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <p className="sp-hero__tagline">{data.tagline}</p>
        </div>
        <div className="sp-hero__image">
          <div className="sp-hero__img">
            <Image
              src={data.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="sp-cover-img"
            />
          </div>
        </div>
      </section>

      {/* Dynamic sections */}
      {data.sections.map((section, i) => {
        if (section.type === "text") {
          return (
            <section key={i} className="sp-text">
              <div className="sp-text__inner">
                <div className="sp-text__left">
                  <p className="sp-text__label">{section.label}</p>
                  <h2 className="sp-text__heading">{section.heading}</h2>
                </div>
                <div className="sp-text__right">
                  {section.bodies.map((body, j) => (
                    <p key={j} className="sp-text__body">{body}</p>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "asset") {
          return (
            <section
              key={i}
              className={`sp-asset${section.expand ? " sp-asset--expand" : ""}`}
            >
              <div className="sp-asset__frame">
                <div className="sp-asset__img">
                  <Image
                    src={section.image}
                    alt=""
                    fill
                    sizes="100vw"
                    loading="eager"
                    className="sp-cover-img"
                  />
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "duo") {
          return (
            <section key={i} className="sp-duo">
              <div className={`sp-duo__inner sp-duo--${section.variant}`}>
                <div className="sp-duo__block sp-duo__block--wide">
                  <div className="sp-duo__img">
                    <Image
                      src={section.wideImage}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 100vw, 60vw"
                      loading="eager"
                      className="sp-cover-img"
                    />
                  </div>
                </div>
                <div className="sp-duo__block sp-duo__block--narrow">
                  <div className="sp-duo__img">
                    <Image
                      src={section.narrowImage}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 100vw, 40vw"
                      loading="eager"
                      className="sp-cover-img"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Specs list */}
      <section className="sp-list">
        <div className="sp-list__inner">
          <p className="sp-list__eyebrow">{data.specsLabel}</p>
          <div className="sp-list__items">
            {data.specs.map((spec, i) => (
              <div key={i} className="sp-list__item">
                <h3 className="sp-list__name">{spec.name}</h3>
                <p className="sp-list__desc">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next visit */}
      {data.next && (
        <section className="sp-next" id="sp-next">
          <TransitionLink href={data.next.href} className="sp-next__link">
            <div className="sp-next__plate" />
            <div className="sp-next__asset">
              <div className="sp-next__img">
                <Image
                  src={data.next.image}
                  alt=""
                  fill
                  sizes="100vw"
                  loading="eager"
                  className="sp-cover-img"
                />
              </div>
            </div>
            <div className="sp-next__name">
              <p className="sp-next__label">{data.next.label}</p>
              <h2
                className="sp-next__title"
                dangerouslySetInnerHTML={{ __html: data.next.title }}
              />
            </div>
          </TransitionLink>
        </section>
      )}
    </div>
  );
}
