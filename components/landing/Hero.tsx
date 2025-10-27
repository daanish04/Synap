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
    <section className="relative sm:py-20 sm:px-20 px-5 py-10 flex flex-col items-center justify-start text-center bg-gradient-to-r from-slate-50 via-blue-100 to-violet-100 border-b-2 border-slate-200/60 overflow-hidden">
      <div className="circle1 absolute bottom-10 right-15 bg-violet-800 blur-2xl h-20 w-20 rounded-full"></div>
      <div className="circle2 absolute top-20 left-15 bg-indigo-800 blur-3xl h-25 w-25 rounded-full"></div>
      <div className="container overflow-hidden px-10 flex flex-col md:flex-row items-center gap-4">
        <div className="hero-data flex flex-col">
          <p className="text-base font-semibold text-gray-500 text-left">
            Organize what you learn
          </p>
          <h2 className="md:text-7xl text-6xl font-extrabold text-blue-700 text-left tracking-wide">
            Capture.
          </h2>
          <h2 className="md:text-7xl text-6xl font-extrabold text-blue-700 text-left tracking-wide">
            Bundle.
          </h2>
          <h2 className="md:text-7xl text-6xl font-extrabold text-blue-700 text-left tracking-wide">
            Share.
          </h2>

          <p className="md:text-xl text-base text-gray-500 font-light text-left mt-6">
            Capture links and notes as cards, group them into collections, and
            keep them fresh with spaced repetition. AI helps you summarize,
            quiz, and connect ideas.
          </p>
          <div className="flex flex-row items-center justify-center gap-6 mt-10">
            <Link href="/dashboard">
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </Link>

            <a
              href="https://youtu.be/xvFZjo5PgG0?si=WBHQp8lgMCCPNhTI"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
        <Image
          src="/Hero-image.png"
          alt="Brain with connecting orbits"
          width={600}
          height={600}
          className="hero-img mt-6 rounded-md shadow-lg"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Hero;
