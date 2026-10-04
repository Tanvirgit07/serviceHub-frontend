"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredServices, Service } from "@/data/servicesData";

export default function ProviderDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getStoredServices());
  }, []);

  const activeServices = services.filter((s) => s.availability);

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Provider Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Welcome back! Here is an overview of your services, ratings, and customer requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href="/provider/services">
                <ListOrdered className="h-3.5 w-3.5" />
                Manage Services
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5 text-xs">
              <Link href="/provider/services/create">
                <PlusCircle className="h-3.5 w-3.5" />
                Add Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Listings</span>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {services.length}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {activeServices.length} active for booking
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Monthly Earnings</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              $1,850
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
              ↑ 18% from last month
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Customer Rating</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2 flex items-center gap-1.5">
              4.9
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Based on 240+ reviews
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Completed Jobs</span>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              128
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              99% satisfaction rate
            </span>
          </div>
        </div>

        {/* Recent Services List Preview */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Your Service Offerings
              </h2>
              <p className="text-xs text-muted-foreground">
                Quick preview of your top services
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
              <Link href="/provider/services">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {services.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 p-4 space-y-2 bg-muted/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-secondary-foreground bg-secondary px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    ${item.price}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.duration}</span>
                  <Link
                    href={`/provider/services/${item.id}/edit`}
                    className="text-primary hover:underline font-medium"
                  >
                    Edit Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
