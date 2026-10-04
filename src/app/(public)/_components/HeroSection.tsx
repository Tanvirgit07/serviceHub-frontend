"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const POPULAR_TAGS = [
  "AC Repair",
  "Home Cleaning",
  "Plumbing",
  "Electrician",
  "Appliance Repair",
];

const TRUST_METRICS = [
  {
    icon: ShieldCheck,
    title: "Verified Experts",
    description: "Every service professional is background checked and vetted.",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    description: "Quick and easy booking with guaranteed punctuality.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Pricing",
    description: "Upfront estimates with zero hidden fees or surprise charges.",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (location.trim()) params.set("location", location.trim());

    router.push(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20 border-b border-border/40">
      {/* Subtle ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20"
      >
        <div className="h-[420px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Heading, Search & CTAs (Flush Left with Container) */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Reliable & Verified Local Services</span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[46px] xl:text-5xl lg:leading-[1.18]">
              Expert Services at Your Doorstep,{" "}
              <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">
                Without the Hassle
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Find, book, and manage trusted professionals for home repairs,
              cleaning, maintenance, and installations with guaranteed quality.
            </p>

            {/* Minimal Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 w-full max-w-2xl rounded-xl border border-border bg-card p-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex flex-1 items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What service do you need? (e.g. AC Repair)"
                    className="h-11 w-full rounded-lg bg-transparent pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <div className="hidden h-6 w-px bg-border sm:block" />

                <div className="relative flex items-center sm:w-36">
                  <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="h-11 w-full rounded-lg bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <Button type="submit" className="h-11 px-6 font-medium shadow-none">
                  Search
                </Button>
              </div>
            </form>

            {/* Popular Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium text-muted-foreground">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/services?search=${encodeURIComponent(tag)}`}
                  className="rounded-md bg-secondary/80 px-2.5 py-1 text-xs text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="rounded-lg">
                <Link href="/services">
                  Browse All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-lg">
                <Link href="/provider/services/create">Become a Provider</Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Badges (Flush Right with Container) */}
          <div className="relative lg:col-span-5 w-full flex justify-end">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-md">
              
              {/* Main Service Hero Image */}
              <div className="relative h-[340px] sm:h-[400px] lg:h-[450px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
                  alt="Professional technician providing home repair service"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              {/* Floating Top-Left Badge */}
              <div className="absolute top-4 left-4 rounded-xl border border-border/70 bg-background/90 p-3 shadow-md backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Verified Experts</p>
                    <p className="text-[10px] text-muted-foreground">100% Quality Checked</p>
                  </div>
                </div>
              </div>

              {/* Floating Bottom-Right Review Badge */}
              <div className="absolute bottom-4 right-4 rounded-xl border border-border/70 bg-background/95 p-3.5 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-bold text-sm text-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">1,200+ Reviews</p>
                    <p className="text-[10px] text-muted-foreground">Instant Booking</p>
                  </div>
                </div>
              </div>

              {/* Bottom Left Status Tag */}
              <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available On-Demand</span>
              </div>

            </div>
          </div>

        </div>

        {/* Minimal Bottom Trust Metrics Grid */}
        <div className="mt-14 border-t border-border/60 pt-10 sm:mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST_METRICS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
