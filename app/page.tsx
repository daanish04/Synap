import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16">
      <div className="flex flex-row items-center gap-2 mb-8">
        <BrainCircuit
          className="text-purple-700 md:h-30 md:w-30 h-20 w-20 rotate-90"
          strokeWidth={1.5}
        />
        <h1 className="md:text-8xl text-6xl font-bold text-blue-500">Synap</h1>
      </div>
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="md:text-3xl text-xl font-semibold text-blue-300">
          Turn Your Knowledge Into a Living Brain.
        </h2>
        <p className="md:text-xl text-base text-gray-500 font-light">
          Save articles, notes, and ideas as smart cards. Organize them into
          collections, tag them, and share your knowledge with the world.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 mt-8">
        <Link href="/login">
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
  );
}
