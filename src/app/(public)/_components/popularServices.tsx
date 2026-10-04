"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Sparkles,
  Droplets,
  Zap,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  badge?: string;
  icon: React.ElementType;
}

const POPULAR_SERVICES_DATA: ServiceItem[] = [
  {
    id: "ac-repair",
    title: "AC Repair & Servicing",
    description: "Complete diagnostic, gas refill, filter cleanup, and cooling fix.",
    category: "Appliances",
    price: 35,
    rating: 4.9,
    reviewsCount: 280,
    duration: "60 mins",
    badge: "Bestseller",
    icon: Wrench,
  },
  {
    id: "home-cleaning",
    title: "Full Home Deep Cleaning",
    description: "Thorough dusting, kitchen sanitization, floor scrubbing & polish.",
    category: "Cleaning",
    price: 50,
    rating: 4.8,
    reviewsCount: 340,
    duration: "2-3 hrs",
    badge: "Trending",
    icon: Sparkles,
  },
  {
    id: "plumbing-services",
    title: "Plumbing & Pipe Repair",
    description: "Leak fix, tap replacement, pipe unclogging, and drainage setup.",
    category: "Plumbing",
    price: 30,
    rating: 4.9,
    reviewsCount: 195,
    duration: "45 mins",
    badge: "Instant",
    icon: Droplets,
  },
  {
    id: "electrical-wiring",
    title: "Electrical & Appliance Fix",
    description: "Circuit breakdown check, switchboard change, and wiring setup.",
    category: "Electrical",
    price: 40,
    rating: 4.8,
    reviewsCount: 210,
    duration: "60 mins",
    badge: "Verified",
    icon: Zap,
  },
];

export default function PopularServices() {
  return (
    <section className="py-16 sm:py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Top Rated Offerings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Popular Services
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Handpicked and most requested home and office maintenance services by our verified professionals.
            </p>
          </div>

          <Button asChild variant="outline" className="hidden sm:inline-flex gap-2 self-start md:self-auto">
            <Link href="/services">
              Explore All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_SERVICES_DATA.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    {service.badge && (
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Rating & Duration */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">{service.rating}</span>
                      <span>({service.reviewsCount})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Starting at</span>
                    <span className="text-base font-bold text-foreground">
                      ${service.price}
                    </span>
                  </div>

                  <Button asChild size="sm" className="rounded-lg h-8 px-3 text-xs">
                    <Link href={`/services?category=${encodeURIComponent(service.category)}`}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/services">
              Explore All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
