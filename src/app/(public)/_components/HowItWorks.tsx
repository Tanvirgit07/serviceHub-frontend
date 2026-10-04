import React from "react";
import Link from "next/link";
import { Search, CalendarCheck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Choose a Service",
    description:
      "Explore vetted home & office services. Compare upfront pricing, reviews, and detailed service inclusions.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Schedule Your Slot",
    description:
      "Pick a preferred date and time that fits your schedule. Receive instant booking confirmation from verified pros.",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Relax & Pay Securely",
    description:
      "Our background-checked expert arrives on time to get the job done. Pay easily once you are 100% satisfied.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-muted/20 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>How It Works</span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Simple Steps to Get Things Done
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Booking professional, reliable services for your home or workplace has never been easier.
          </p>
        </div>

        {/* 3 Steps Grid with Connecting Line */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-8 bg-dashed border-t-2 border-dashed border-border -z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative flex flex-col items-center text-center rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3.5 flex h-7 items-center justify-center rounded-full border border-border bg-background px-3 text-xs font-bold text-primary shadow-xs">
                    STEP {item.step}
                  </div>

                  {/* Icon Box */}
                  <div className="mt-2 mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action Strip */}
        <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Need urgent assistance or have custom requirements?
          </p>
          <Button asChild size="sm" className="gap-2">
            <Link href="/services">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
