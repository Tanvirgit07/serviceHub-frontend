"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES,
  Service,
  getStoredServices,
} from "@/data/servicesData";

export default function ServiceList() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  useEffect(() => {
    // Load stored services (or default dummy data)
    setServices(getStoredServices());
  }, []);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Filter by Category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [services, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("featured");
  };

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
                placeholder="Search services (e.g. AC Repair, Cleaning, Plumbing)..."
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

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground shrink-0 hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "featured"
                      | "price-asc"
                      | "price-desc"
                      | "rating"
                  )
                }
                className="h-11 rounded-md border border-input bg-transparent px-3 py-1 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="featured">Featured / Top</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}

            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-primary hover:underline ml-auto font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredServices.length}</strong> available services
          </span>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-xs">
                      {service.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold text-white">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating.toFixed(1)}</span>
                    <span className="font-normal text-white/80">({service.reviewsCount})</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{service.duration}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Verified Pro
                      </span>
                    </div>

                    <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Bottom: Price and CTA */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">
                        Estimated Rate
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        ${service.price}
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
                We couldn&apos;t find any services matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reset filters.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
