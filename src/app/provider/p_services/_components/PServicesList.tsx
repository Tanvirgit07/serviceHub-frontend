"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
  AlertCircle,
  Briefcase,
  Calendar,
  Loader2,
  RefreshCw,
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
import { Service } from "@/features/services/api/services.api";
import {
  useMyServices,
  useDeleteService,
  useToggleAvailability,
} from "@/features/services/hook/useServices";

export default function PServicesList() {
  // Fetch real services created by the logged-in provider
  const { data: services = [], isLoading, isError, error, refetch } = useMyServices();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
  const { mutate: toggleAvailability } = useToggleAvailability();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  // Delete Dialog state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const activeCount = useMemo(
    () => (Array.isArray(services) ? services.filter((s) => s.availability).length : 0),
    [services]
  );
  const inactiveCount = useMemo(
    () => (Array.isArray(services) ? services.length - activeCount : 0),
    [services, activeCount]
  );

  // Filter and sort services
  const filteredServices = useMemo(() => {
    if (!Array.isArray(services)) return [];

    return services
      .filter((service) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          service.title.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && service.availability) ||
          (statusFilter === "INACTIVE" && !service.availability);

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

  const handleToggleAvailability = (service: Service) => {
    toggleAvailability({
      id: service.id,
      availability: !service.availability,
    });
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;

    deleteService(serviceToDelete.id, {
      onSuccess: () => {
        setServiceToDelete(null);
      },
    });
  };

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h3 className="text-base font-bold text-foreground">Failed to load services</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {error?.message || "Could not retrieve your service listings from the server."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                {Array.isArray(services) ? services.length : 0} Total
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

        {/* Search & Filter Toolbar */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services by title or description..."
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
                  All ({Array.isArray(services) ? services.length : 0})
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
        </div>

        {/* Services List View */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading your services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto text-muted-foreground">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No services found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No services match your current search or filter criteria."
                  : "You haven't created any service offerings yet. Start listing your services to accept customer bookings."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {searchQuery || statusFilter !== "ALL" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="text-xs"
                >
                  Reset Filters
                </Button>
              ) : null}
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
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <Briefcase className="h-6 w-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          service.availability
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            service.availability ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                        {service.availability ? "Active" : "Paused"}
                      </span>

                      {service.createAt && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(service.createAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/provider/p_services/edit/${service.id}`}
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
                      ${Number(service.price).toFixed(2)}
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
      <Dialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
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
