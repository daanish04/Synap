"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tag, Layers3, Repeat, Sparkles, Share2, Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Tag,
    title: "Smart Tagging",
    body: "Filter and search across your cards instantly.",
  },
  {
    icon: Layers3,
    title: "Collections",
    body: "Group related cards into tidy bundles.",
  },
  {
    icon: Repeat,
    title: "Spaced Repetition",
    body: "Review on a schedule so knowledge sticks.",
  },
  {
    icon: Sparkles,
    title: "AI Boost",
    body: "Summarize, quiz, and spot connections.",
  },
  {
    icon: Share2,
    title: "Shareable",
    body: "Publish collections with a unique link.",
  },
  {
    icon: Search,
    title: "Fast Find",
    body: "Lightning search across titles, tags, and notes.",
  },
];

const Features = () => {
  const root = useRef(null);
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="p-10 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="px-10 text-3xl font-bold text-left text-slate-700 mb-10">
          Features - What You <span className="text-blue-500">Can</span> Do
        </h2>
        <div className="sm:px-10 px-8 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map(({ icon: Icon, title, body }) => (
            <Card
              key={title}
              className="feature-card bg-slate-50 border-slate-500/60"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-800/20 text-slate-800">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-slate-900">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
