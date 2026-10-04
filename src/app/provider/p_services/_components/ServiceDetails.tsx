"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Award,
  Users,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  getStoredServiceById,
  updateStoredService,
  deleteStoredService,
  Service,
  INITIAL_SERVICES,
} from "@/data/servicesData";
import { getStoredOrders, OrderItem } from "@/data/ordersData";

interface ServiceDetailsProps {
  serviceId?: string;
}

export default function ServiceDetails({ serviceId: propId }: ServiceDetailsProps) {
  const params = useParams();
  const router = useRouter();

  // Support route params [serviceId] or [id] or direct prop
  const effectiveId =
    propId ||
    (params?.serviceId as string) ||
    (params?.id as string) ||
    "ac-servicing-master";

  const [service, setService] = useState<Service | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const found = getStoredServiceById(effectiveId);
    if (found) {
      setService(found);
    } else {
      // Fallback to first available initial service
      setService(INITIAL_SERVICES[0] || null);
    }

    const allOrders = getStoredOrders();
    setOrders(allOrders);
    setIsLoading(false);
  }, [effectiveId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-xs text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Service Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested service offering could not be located in your catalog.
        </p>
        <Button asChild size="sm">
          <Link href="/provider/p_services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  // Toggle availability
  const handleToggleAvailability = () => {
    const updated = updateStoredService(service.id, {
      availability: !service.availability,
    });
    if (updated) {
      setService((prev) => (prev ? { ...prev, availability: !prev.availability } : null));
      toast.success(
        `Service status is now ${!service.availability ? "Active (Online)" : "Paused (Offline)"}`
      );
    }
  };

  // Delete service
  const confirmDelete = () => {
    setIsDeleting(true);
    const success = deleteStoredService(service.id);
    if (success) {
      toast.success(`"${service.title}" has been deleted.`);
      router.push("/provider/p_services");
    } else {
      toast.error("Failed to delete service.");
      setIsDeleting(false);
    }
  };

  // Related orders for this service
  const serviceOrders = orders.filter(
    (o) => o.serviceId === service.id || o.category === service.category
  );

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
              <Link href="/provider/p_services">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Services</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>/</span>
              <span className="font-semibold text-foreground truncate max-w-xs">
                {service.title}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs border transition-all ${
                service.availability
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  service.availability ? "bg-emerald-500" : "bg-zinc-400"
                }`}
              />
              <span>{service.availability ? "Active & Accepting Bookings" : "Paused / Offline"}</span>
            </button>

            {/* Public View */}
            <Button asChild variant="outline" size="sm" className="h-9 gap-1 text-xs rounded-xl">
              <Link href={`/services/${service.id}`} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Public Page</span>
              </Link>
            </Button>

            {/* Edit */}
            <Button asChild size="sm" className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
              <Link href={`/provider/p_services/edit/${service.id}`}>
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Offering</span>
              </Link>
            </Button>

            {/* Delete */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteModalOpen(true)}
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              title="Delete service"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Details Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Image Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  priority
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 rounded-lg bg-background/95 backdrop-blur-xs px-3 py-1 text-xs font-bold text-foreground shadow-xs">
                  {service.category}
                </span>
                <span className="absolute bottom-3 left-3 rounded-lg bg-background/95 backdrop-blur-xs px-3 py-1 text-xs font-bold text-primary shadow-xs">
                  ${service.price} Upfront Rate
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Duration: <strong className="text-foreground">{service.duration}</strong></span>
                <span>Created: <strong className="text-foreground">{service.createdAt || "Recently"}</strong></span>
              </div>
            </div>

            {/* Content & Metadata (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Based on {service.reviewsCount} customer reviews
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {service.title}
                </h1>

                <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {service.description}
                </p>
              </div>

              {/* Quick Performance Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Completed Jobs
                  </span>
                  <span className="text-lg font-extrabold text-foreground">
                    {service.reviewsCount + 45}
                  </span>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Total Revenue
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${(service.price * (service.reviewsCount || 10)).toLocaleString()}
                  </span>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Quality Score
                  </span>
                  <span className="text-lg font-extrabold text-foreground">
                    99.4%
                  </span>
                </div>
              </div>

              {/* Guarantees / Highlights */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>30-Day Service Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Verified Professional Tools</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2-Column: Inclusions/Exclusions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: What is Included / Excluded (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Inclusions Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold text-foreground">
                  What&apos;s Included in Service
                </h3>
              </div>

              <ul className="space-y-2.5">
                {service.inclusions && service.inclusions.length > 0 ? (
                  service.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">Standard professional inspection and labor.</li>
                )}
              </ul>
            </div>

            {/* Exclusions Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <XCircle className="h-5 w-5 text-rose-500" />
                <h3 className="text-base font-bold text-foreground">
                  What&apos;s Excluded / Extra Charges
                </h3>
              </div>

              <ul className="space-y-2.5">
                {service.exclusions && service.exclusions.length > 0 ? (
                  service.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">Major replacement components and third-party parts.</li>
                )}
              </ul>
            </div>

            {/* Key Service Features */}
            {service.features && service.features.length > 0 && (
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  Service Key Features
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {service.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: Recent Customer Bookings for this Category (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Recent Orders Widget */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Recent Bookings
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Appointments scheduled for this category
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
                  <Link href="/account/my-orders">View All</Link>
                </Button>
              </div>

              <div className="space-y-3">
                {serviceOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-foreground">{order.orderNumber}</span>
                      <span className="text-primary font-sans">${order.totalAmount}</span>
                    </div>

                    <div className="space-y-0.5 text-muted-foreground text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground font-medium">{order.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{order.scheduledDate} ({order.scheduledTimeSlot})</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {order.status}
                      </span>
                      <Link
                        href={`/account/my-orders/${order.id}`}
                        className="text-primary hover:underline text-[11px] font-medium"
                      >
                        Inspect →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service Actions
              </h3>
              <div className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs rounded-xl h-9">
                  <Link href={`/provider/p_services/edit/${service.id}`}>
                    <Pencil className="h-3.5 w-3.5 mr-2 text-primary" />
                    Modify Rates & Description
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs rounded-xl h-9">
                  <Link href="/provider/p_services/create">
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                    Clone / Add Similar Offering
                  </Link>
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">Delete Service Offering</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete &quot;{service.title}&quot;? Existing past orders will remain in history, but customers will no longer be able to book this service.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
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
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
