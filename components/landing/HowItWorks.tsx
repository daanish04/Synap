"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Save",
    body: "Add links, notes, and ideas in seconds. Each card holds a title, description, tags, and resources.",
  },
  {
    title: "Organize",
    body: "Group your cards into collections. Pin, favorite, or tag them to make recall easy.",
  },
  {
    title: "Share",
    body: "Make a collection public with one click — get a unique share link like /collection/abc123 to show the world.",
  },
];
const HowItWorks = () => {
  const root = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".works-card");
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="p-10">
      <div className="container mx-auto">
        <h2 className="px-10 text-3xl font-bold text-left text-slate-700 mb-10">
          How It <span className="text-blue-500">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="works-card rounded-lg border border-blue-500/60 bg-blue-50 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-blue-200 text-sm font-medium">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
