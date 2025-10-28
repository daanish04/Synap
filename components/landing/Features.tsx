"use client";

import React, { useRef } from "react";
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
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-500",
  },
  {
    icon: Layers3,
    title: "Collections",
    body: "Group related cards into tidy bundles.",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500",
  },
  {
    icon: Repeat,
    title: "Spaced Repetition",
    body: "Review on a schedule so knowledge sticks.",
    gradient: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-500",
  },
  {
    icon: Sparkles,
    title: "AI Boost",
    body: "Summarize, quiz, and spot connections.",
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500",
  },
  {
    icon: Share2,
    title: "Shareable",
    body: "Publish collections with a unique link.",
    gradient: "from-violet-500 to-indigo-500",
    iconBg: "bg-violet-500",
  },
  {
    icon: Search,
    title: "Fast Find",
    body: "Lightning search across titles, tags, and notes.",
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-rose-500",
  },
];

const Features = () => {
  const root = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      const icons = gsap.utils.toArray<HTMLElement>(".feature-icon");

      // Set initial states
      gsap.set(cards, { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(icons, { scale: 0, rotation: -180 });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Animate cards
      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });

      // Animate icons with rotation
      tl.to(
        icons,
        {
          scale: 1,
          rotation: 360,
          duration: 0.9,
          stagger: 0.08,
          ease: "elastic.out(1, 0.6)",
        },
        "-=0.5"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative py-16 px-5 sm:px-10 overflow-hidden bg-white"
    >
      {/* Background decoration - geometric patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 [mask-image:linear-gradient(transparent,white,white,transparent)]"></div> */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Everything You{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make knowledge management effortless
          </p>
        </div>

        {/* Feature cards - more spacious, colorful design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map(({ icon: Icon, title, body, gradient }) => (
            <div
              key={title}
              className="feature-card group relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-sm border-2 border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Large colorful icon with gradient bg */}
              <div className="relative mb-6 flex items-start justify-between">
                <div className="relative">
                  <div
                    className={`feature-icon relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />

                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-50 blur-xl -z-10 group-hover:opacity-75 transition-opacity duration-300`}
                    ></div>
                  </div>
                </div>

                {/* Decorative corner element */}
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
              </div>

              {/* Content */}
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:via-slate-700 group-hover:to-slate-900 group-hover:bg-clip-text transition-all duration-300">
                {title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                {body}
              </p>

              {/* Animated accent bar */}
              <div className="mt-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                ></div>
              </div>

              {/* Subtle border effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 border-2 border-transparent`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
