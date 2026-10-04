"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Users,
  Star,
  Award,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Clock,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "15,000+", label: "Completed Bookings", icon: CheckCircle2 },
  { value: "500+", label: "Verified Technicians", icon: Users },
  { value: "4.9 / 5", label: "Average Customer Rating", icon: Star },
  { value: "99.2%", label: "On-Time Service Rate", icon: Clock },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety First",
    description:
      "Every service partner undergoes identity verification, criminal background checks, and trade skill tests before joining.",
  },
  {
    icon: Award,
    title: "Guaranteed Quality",
    description:
      "We back every service with our 30-day quality guarantee. If something is not right, we make it right at no extra cost.",
  },
  {
    icon: TrendingUp,
    title: "Transparent & Fair Rates",
    description:
      "No hidden fees or unexpected charges. See upfront estimates and breakdown of all parts and labor costs before booking.",
  },
  {
    icon: HeartHandshake,
    title: "Empowering Local Pros",
    description:
      "We help independent technicians and small business owners grow their earnings, manage jobs, and build reputable businesses.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground border-b border-border/40">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/40 bg-muted/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20"
        >
          <div className="h-[400px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>About ServiceHub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Reliable Local Services,{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">
              Reinvented for Everyone
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-1">
            ServiceHub was created to solve a universal problem: finding honest, vetted, and punctual professionals for home and office maintenance without endless phone calls or pricing uncertainty.
          </p>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="py-12 border-b border-border/40 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Story Narrative */}
      <section className="py-16 sm:py-20 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Our Mission & Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Connecting Neighborhoods with Quality & Dignity
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                For years, hiring a home repair technician was a game of chance. You asked neighbors for numbers, waited without knowing when someone would show up, and negotiated rates on the spot without any warranty.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                We built <strong>ServiceHub</strong> to bring order, accountability, and respect to the local services ecosystem. By giving customers on-demand booking with verified pricing, and providing skilled workers with consistent jobs and fair pay, we are creating a marketplace built on mutual trust.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>100% Background Checked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Transparent Upfront Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>30-Day Service Guarantee</span>
                </div>
              </div>
            </div>

            {/* Visual Highlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ServiceHub Standard
                    </h3>
                    <p className="text-xs text-muted-foreground">Excellence in every job</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs leading-relaxed text-muted-foreground">
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Customer Protection</strong>
                      Zero hidden charges and secure online or on-delivery settlement.
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Skilled Professionals</strong>
                      Verified technicians equipped with modern diagnostic tools.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-16 sm:py-20 border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              What Guides Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Our Core Principles
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We hold ourselves to the highest standards of reliability, safety, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Ready to experience effortless service booking?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Book top-rated home cleaning, appliance repairs, plumbing, or electrical work today in just a few clicks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-lg gap-2 text-sm font-medium">
              <Link href="/services">
                Explore All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg text-sm">
              <Link href="/provider/services/create">
                Become a Service Provider
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
