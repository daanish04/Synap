"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".hero-data", {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
    tl.from(
      ".hero-img",
      {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=.6"
    );
    tl.from(".circle", {
      opacity: 0,
      scale: 0,
    });
    tl.to(
      ".circle2",
      {
        rotation: 360,
        x: 30,
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "expo.inOut",
        duration: 10,
        transformOrigin: "140px 70px",
      },
      "-=0.2"
    );
    tl.to(
      ".circle1",
      {
        x: -50,
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "expo.inOut",
        duration: 4,
        scale: 2,
      },
      "-=0.2"
    );
  }, []);
  return (
    <section className="relative sm:py-24 sm:px-20 px-5 py-12 flex flex-col items-center justify-start text-center bg-gradient-to-br from-white via-blue-50/50 to-violet-50/50 border-b border-slate-200/60 overflow-hidden">
      <div className="circle1 absolute bottom-10 right-15 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="circle2 absolute top-20 left-15 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="container rounded-lg overflow-hidden px-5 sm:px-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 max-w-7xl">
        <div className="hero-data flex flex-col md:flex-1 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 w-fit">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-semibold text-slate-700">
              Organize what you learn
            </p>
          </div>

          {/* Headlines with animation-ready classes */}
          <h2 className="md:text-7xl text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            Capture.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Bundle.
            </span>{" "}
            Share.
          </h2>

          <p className="md:text-xl text-base text-slate-600 font-medium leading-relaxed mt-6 max-w-xl">
            Capture links and notes as cards, group them into collections, and
            keep them fresh with spaced repetition. AI helps you summarize,
            quiz, and connect ideas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <Link href="/dashboard">
              <Button
                variant="default"
                size="lg"
                className="px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started →
              </Button>
            </Link>

            <a
              href="https://youtu.be/xvFZjo5PgG0?si=WBHQp8lgMCCPNhTI"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-6 text-base font-semibold border-2"
              >
                Learn More →
              </Button>
            </a>
          </div>

          {/* Stats or key points */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600 font-medium">
                Free Forever
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 font-medium">
                No Credit Card
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600 font-medium">
                Instant Setup
              </span>
            </div>
          </div>
        </div>

        <div className="hero-img-wrapper relative md:flex-1 flex justify-center items-center">
          <Image
            src="/Hero-image.png"
            alt="Brain with connecting orbits"
            width={600}
            height={600}
            className="hero-img w-full max-w-md sm:max-w-lg rounded-2xl shadow-2xl border border-slate-100"
            loading="eager"
            priority
          />

          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-violet-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
