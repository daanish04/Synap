"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookmarkPlus, FolderTree, Share2 } from "lucide-react";
import PaintRoll from "../ui/paint-roll";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: BookmarkPlus,
    title: "Save",
    body: "Add links, notes, and ideas in seconds. Each card holds a title, description, tags, and resources.",
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500",
    accent: "blue",
  },
  {
    icon: FolderTree,
    title: "Organize",
    body: "Group your cards into collections. Pin, favorite, or tag them to make recall easy.",
    color: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-500",
    accent: "purple",
  },
  {
    icon: Share2,
    title: "Share",
    body: "Make a collection public with one click. Get a unique share link to show the world.",
    color: "from-violet-500 to-indigo-500",
    iconBg: "bg-violet-500",
    accent: "violet",
  },
];

const HowItWorks = () => {
  const root = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".works-card");
      const icons = gsap.utils.toArray<HTMLElement>(".works-icon");

      // Set initial states
      gsap.set(cards, { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(icons, { scale: 0, rotation: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate cards entering
      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        rotate: (i) => (i - 1) * 2,
        stagger: 0.2,
        ease: "back.out(1.4)",
      });

      tl.to(
        icons,
        {
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.6"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative py-20 px-10 overflow-hidden bg-background"
    >
      {/* Background svg */}
      <div className="absolute -left-20 -right-20 sm:-top-40 top-5 pointer-events-none">
        <PaintRoll />
      </div>

      <div className="block sm:hidden absolute -left-20 -right-20 top-40 pointer-events-none">
        <PaintRoll />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-foreground mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform how you capture, organize, and share knowledge in three
            simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`works-card group relative overflow-hidden bg-card rounded-2xl shadow-xl border border-border transition-all duration-300 hover:shadow-2xl lg:hover:-translate-y-2 cursor-pointer 
            p-6 lg:p-8
            ${index === 1 ? "lg:mt-12" : ""}`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
                  ></div>

                  <div className="flex items-center gap-4 mb-4 lg:block lg:mb-6">
                    {/* Icon container */}
                    <div
                      className={`works-icon relative flex-shrink-0 ${
                        /* flex-shrink-0 prevents icon from shrinking */ ""
                      }
                w-14 h-14 lg:w-16 lg:h-16 }
                ${step.iconBg} 
                rounded-xl lg:rounded-2xl}
                flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        className={`text-white 
                  w-7 h-7 lg:w-8 lg:h-8`}
                      />
                      <div
                        className={`absolute ${step.iconBg} rounded-full flex items-center justify-center shadow-md 
                  -top-1.5 -right-1.5 w-6 h-6
                  lg:-top-2 lg:-right-2 lg:w-7 lg:h-7`}
                      >
                        <span
                          className={`text-white font-bold 
                    text-xs lg:text-sm `}
                        >
                          {index + 1}
                        </span>
                      </div>

                      <div
                        className={`lg:hidden absolute inset-0 rounded-xl ${step.iconBg} opacity-30`}
                      ></div>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-bold text-foreground
                text-xl lg:text-2xl lg:mb-4 ${/* Title size & margin */ ""}`}
                    >
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-2 lg:mb-0">
                    {step.body}
                  </p>

                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
