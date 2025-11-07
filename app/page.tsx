import Hero from "@/components/landing/Hero";

import Navbar from "@/components/Navbar";

import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import CtaBlock from "@/components/landing/CtaBlock";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action Section */}
      <CtaBlock />

      {/* Footer */}
      <footer className="py-6 bg-muted/50 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; 2025 Synap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
