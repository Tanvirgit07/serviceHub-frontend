"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Filter,
  Star,
  Clock,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getStoredServices,
  updateStoredService,
  deleteStoredService,
  Service,
  CATEGORIES,
} from "@/data/servicesData";

export default function PServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");

  // Delete Dialog state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setServices(getStoredServices());
    setIsLoading(false);
  }, []);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesSearch =
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" ||
          service.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && service.availability) ||
          (statusFilter === "INACTIVE" && !service.availability);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [services, searchQuery, selectedCategory, statusFilter, sortBy]);

  const handleToggleAvailability = (service: Service) => {
    const updated = updateStoredService(service.id, {
      availability: !service.availability,
    });

    if (updated) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, availability: !s.availability } : s))
      );
      toast.success(
        `"${service.title}" is now ${!service.availability ? "Active (Online)" : "Paused (Offline)"}`
      );
    } else {
      toast.error("Failed to update service availability.");
    }
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);

    const success = deleteStoredService(serviceToDelete.id);
    if (success) {
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      toast.success(`"${serviceToDelete.title}" has been deleted.`);
      setServiceToDelete(null);
    } else {
      toast.error("Failed to delete service.");
    }
    setIsDeleting(false);
  };

  const activeCount = services.filter((s) => s.availability).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="p-6">
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                My Services
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {services.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your service listings, pricing, and live customer booking availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
              <Link href="/provider/p_services/create">
                <PlusCircle className="h-4 w-4" />
                Add New Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Minimal Search & Filter Toolbar */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services by title, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9.5 pr-8 h-9 text-xs sm:text-sm rounded-xl bg-muted/30 border-border/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Tabs */}
              <div className="flex items-center rounded-xl border border-border/70 bg-muted/30 p-1 text-xs">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "ALL"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({services.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter("INACTIVE")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "INACTIVE"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paused ({inactiveCount})
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "price-asc" | "price-desc" | "rating")}
                  className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-0.5 text-xs font-medium transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List View */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Loading service offerings...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto text-muted-foreground">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No services found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No service offerings match your current search or category filter.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setStatusFilter("ALL");
                }}
                className="text-xs"
              >
                Reset Filters
              </Button>
              <Button asChild size="sm" className="text-xs">
                <Link href="/provider/p_services/create">
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Add New Service
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground uppercase tracking-wide">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{service.rating}</span>
                        <span className="text-muted-foreground font-normal">
                          ({service.reviewsCount})
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                      <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <Link
                      href={`/provider/p_services/${service.id}`}
                      className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors truncate block"
                      title={service.title}
                    >
                      {service.title}
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Right: Price, Status Toggle & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                  {/* Price */}
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-muted-foreground block font-medium">
                      Rate
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                      ${service.price}
                    </span>
                  </div>

                  {/* Availability Toggle Button */}
                  <div>
                    <button
                      onClick={() => handleToggleAvailability(service)}
                      title="Click to toggle availability"
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold shadow-2xs border transition-all ${
                        service.availability
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.availability ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      <span>{service.availability ? "Active" : "Paused"}</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="View Details"
                    >
                      <Link href={`/provider/p_services/${service.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Edit Service"
                    >
                      <Link href={`/provider/p_services/edit/${service.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setServiceToDelete(service)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">Delete Service Offering</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to remove &quot;{serviceToDelete?.title}&quot; from your active catalog? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServiceToDelete(null)}
              className="text-xs rounded-xl"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              className="text-xs rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
