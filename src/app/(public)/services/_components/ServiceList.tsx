"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  Sparkles,
  X,
  AlertCircle,
  Briefcase,
  Calendar,
  Loader2,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllServices } from "@/features/services/hook/useServices";

export default function ServiceList() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // Fetch real services from backend
  const { data: services = [], isLoading, isError, error, refetch } = useAllServices();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  // Filter and sort services
  const filteredServices = useMemo(() => {
    if (!Array.isArray(services)) return [];

    return services
      .filter((service) => {
        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          service.title.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q);

        // Status filter
        const matchesStatus =
          statusFilter === "ALL" || (statusFilter === "AVAILABLE" && service.availability);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;

        const dateA = new Date(a.createAt).getTime() || 0;
        const dateB = new Date(b.createAt).getTime() || 0;
        return dateB - dateA;
      });
  }, [services, searchQuery, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSortBy("newest");
  };

  const availableCount = useMemo(
    () => (Array.isArray(services) ? services.filter((s) => s.availability).length : 0),
    [services]
  );

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-2xl space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Discover Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore All Professional Services
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find vetted local technicians, cleaners, plumbers, and experts ready to help with your home & office tasks.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-9 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Pills & Sort Selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex items-center rounded-xl border border-border/70 bg-muted/30 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === "ALL"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({Array.isArray(services) ? services.length : 0})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("AVAILABLE")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === "AVAILABLE"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Available ({availableCount})
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1 h-11 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "price-asc" | "price-desc")
                  }
                  className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>

          {(searchQuery || statusFilter !== "ALL") && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <span className="text-muted-foreground">
                Filtering by: {searchQuery ? `"${searchQuery}"` : ""}{" "}
                {statusFilter === "AVAILABLE" ? "(Available Only)" : ""}
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredServices.length}</strong> available services
          </span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading services from marketplace...</p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3 max-w-md mx-auto my-12">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h3 className="text-base font-bold text-foreground">Failed to load services</h3>
            <p className="text-xs text-muted-foreground">
              {error?.message || "Could not retrieve services from the server."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : filteredServices.length > 0 ? (
          /* Services Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                {/* Banner Section */}
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-muted/40 p-4 flex flex-col justify-between border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium border border-border/60 text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Verified Service
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        service.availability
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.availability ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {service.availability ? "Available" : "Paused"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center py-1">
                    <div className="p-3 rounded-2xl bg-background/80 shadow-xs border border-border/50 text-primary group-hover:scale-110 transition-transform">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      Instant Booking
                    </span>
                    {service.createAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(service.createAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Bottom: Price and CTA */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                        Fixed Rate
                      </span>
                      <span className="text-lg font-extrabold text-foreground">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    </div>

                    <Button asChild size="sm" className="rounded-lg gap-1.5 text-xs">
                      <Link href={`/services/${service.id}`}>
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-dashed border-border p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                No Services Found
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? `We couldn't find any services matching "${searchQuery}". Try another keyword.`
                  : "No services are currently listed in the marketplace."}
              </p>
            </div>
            {(searchQuery || statusFilter !== "ALL") && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
