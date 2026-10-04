import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Wallet,
  Star,
  CheckCircle2,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PROVIDER_PERKS = [
  {
    icon: Wallet,
    title: "Reliable Earnings",
    description: "Get paid securely and on time for every completed service.",
  },
  {
    icon: TrendingUp,
    title: "Consistent Job Requests",
    description: "Access a steady stream of verified customers in your area.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work on your terms. Accept jobs only when you are available.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Community",
    description: "Join an elite, trusted network of recognized professionals.",
  },
];

export default function BecomeAProvider() {
  return (
    <section className="py-16 sm:py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card Container */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-12 lg:p-14 shadow-sm">
          {/* Subtle Ambient Light Decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 -z-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 relative z-10">
            
            {/* Left Column: Heading, Perks, CTAs */}
            <div className="lg:col-span-7">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Partner With Us</span>
              </div>

              {/* Headline */}
              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Are You a Skilled Professional?{" "}
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">
                  Grow With ServiceHub
                </span>
              </h2>

              {/* Description */}
              <p className="mt-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Connect with thousands of local clients seeking your expertise. Expand your customer base,
                set your own rates, and scale your service business effortlessly.
              </p>

              {/* Perks Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROVIDER_PERKS.map((perk, idx) => {
                  const Icon = perk.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                          {perk.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {perk.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Button asChild size="lg" className="gap-2 rounded-lg font-medium shadow-sm">
                  <Link href="/provider/services/create">
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Visual Provider Success Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-md transition-all">
                
                {/* Provider Profile Header */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-base border border-primary/20">
                      SP
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-foreground">Master Technician</h3>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                      </div>
                      <p className="text-xs text-muted-foreground">Certified Service Partner</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Accepting Jobs
                  </span>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-3 my-5">
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
                    <span className="text-[11px] text-muted-foreground block">Monthly Earnings</span>
                    <span className="text-lg font-bold text-foreground">$1,450+</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium mt-0.5">
                      ↑ 28% from last month
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
                    <span className="text-[11px] text-muted-foreground block">Customer Rating</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-bold text-foreground">4.9</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      120+ 5-star reviews
                    </span>
                  </div>
                </div>

                {/* Live Job Notification Mockup */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">New Job Available Nearby</p>
                      <p className="text-[11px] text-muted-foreground">AC Repair • 2.5 km away</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">$45</span>
                </div>

                {/* Bottom Trust Guarantee */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>⚡ Instant weekly bank payouts</span>
                  <span className="font-medium text-foreground">Zero hidden fees</span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
