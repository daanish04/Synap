import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <section className="py-10 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x-2 divide-blue-300">
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">Save</h3>
              <p className="text-gray-600 px-6">
                Add links, notes, and ideas in seconds. Each card holds a title,
                description, tags, and resources.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">Organize</h3>
              <p className="text-gray-600 px-6">
                Group your cards into collections. Pin, favorite, or tag them to
                make recall easy.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">Share</h3>
              <p className="text-gray-600 px-6">
                Make a collection public with one click — get a unique share
                link like /collection/abc123 to show the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 mt-12 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-10">
            Features - What You <span className="text-blue-500">Can</span> Do
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">
                Smart Tagging
              </h3>
              <p className="text-gray-600 px-6">
                Filter & search across your cards instantly.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">
                Collections
              </h3>
              <p className="text-gray-600 px-6">
                Organize related cards in tidy little bundles.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">
                Spaced Repetition
              </h3>
              <p className="text-gray-600 px-6">
                Schedule cards for recall so knowledge STICKS.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">AI Boost</h3>
              <p className="text-gray-600 px-6">
                Summarize articles, generate quizzes, and find connections
                between your notes.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <h3 className="text-2xl font-semibold text-blue-500">
                Shareable Knowledge
              </h3>
              <p className="text-gray-600 px-6">
                Publish a collection, just like a personal wiki, with a unique
                link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 mt-12 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-10">
            Ready to Build Your Brain?
          </h2>
          <div className="flex flex-col items-center justify-center gap-6">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="default" size="lg">
                  Start Saving Your Knowledge
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="default" size="lg">
                  Start Saving Your Knowledge
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}
