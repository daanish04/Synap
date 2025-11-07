"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  left: string;
  top: string;
  delay: string;
  duration: string;
}

const CtaBlock = () => {
  const root = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${3 + Math.random() * 2}s`,
      }))
    );
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "back.out(1.4)",
          },
          "-=0.4"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative py-20 px-5 sm:px-10 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating icons */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500/20 hover:bg-blue-400/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 group hover:scale-110 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-blue-300" />
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-purple-500/20 hover:bg-blue-400/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-400/30 group hover:scale-110 transition-all duration-300">
                <Zap className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-violet-500/20 hover:bg-blue-400/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-violet-400/30 group hover:scale-110 transition-all duration-300">
                <Rocket className="w-6 h-6 text-violet-300" />
              </div>
            </div>
          </div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Build Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              Brain?
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Start saving what matters. Turn scattered tabs and notes into a
            searchable knowledge system powered by spaced repetition.
          </p>

          <div ref={buttonRef} className="flex flex-col items-center gap-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 hover:from-blue-500 hover:via-purple-500 hover:to-violet-500 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Go to Dashboard →
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 hover:from-blue-500 hover:via-purple-500 hover:to-violet-500 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start Free →
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
