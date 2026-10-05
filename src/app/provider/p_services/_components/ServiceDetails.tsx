"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  AlertCircle,
  Briefcase,
  DollarSign,
  Clock,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useServiceDetails,
  useDeleteService,
  useToggleAvailability,
} from "@/features/services/hook/useServices";

interface ServiceDetailsProps {
  serviceId?: string;
}

export default function ServiceDetails({ serviceId: propId }: ServiceDetailsProps) {
  const params = useParams();
  const router = useRouter();

  // Support route params [serviceId] or [id] or direct prop
  const resolvedId =
    (propId ||
      (params?.serviceId as string) ||
      (params?.id as string) ||
      "") as string;

  const { data: service, isLoading, isError, error } = useServiceDetails(resolvedId);
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
  const { mutate: toggleAvailability, isPending: isToggling } = useToggleAvailability();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Toggle availability
  const handleToggleAvailability = () => {
    if (!service) return;
    toggleAvailability({
      id: service.id,
      availability: !service.availability,
    });
  };

  // Delete service
  const confirmDelete = () => {
    if (!service) return;
    deleteService(service.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        router.push("/provider/p_services");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Service Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error?.message ||
            "The requested service offering could not be located in your catalog."}
        </p>
        <Button asChild size="sm">
          <Link href="/provider/p_services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  const formattedPrice = Number(service.price).toFixed(2);
  const formattedCreateDate = service.createAt
    ? new Date(service.createAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const formattedUpdateDate = service.updatedAt
    ? new Date(service.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs rounded-xl"
            >
              <Link href="/provider/p_services">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Services</span>
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-foreground truncate max-w-xs">
              {service.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              disabled={isToggling}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs border transition-all ${
                service.availability
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              }`}
            >
              {isToggling ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span
                  className={`h-2 w-2 rounded-full ${
                    service.availability ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
              )}
              <span>{service.availability ? "Active & Accepting Bookings" : "Paused / Offline"}</span>
            </button>

            {/* Edit Button */}
            <Button asChild size="sm" className="h-8 gap-1.5 text-xs rounded-xl shadow-xs">
              <Link href={`/provider/p_services/edit/${service.id}`}>
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Service</span>
              </Link>
            </Button>

            {/* Delete Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteModalOpen(true)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              title="Delete service"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Card */}
        <Card className="border-border/80 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-muted/40 to-card p-6 sm:p-8 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background/80 text-primary shadow-xs">
                  <Briefcase className="h-7 w-7" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        service.availability
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.availability ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      {service.availability ? "Active" : "Paused"}
                    </span>

                    <span className="text-xs font-mono text-muted-foreground bg-muted/70 px-2 py-0.5 rounded border border-border">
                      ID: {service.id}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {service.title}
                  </h1>
                </div>
              </div>

              {/* Price Tag */}
              <div className="text-left sm:text-right bg-background/80 backdrop-blur-xs p-4 rounded-2xl border border-border/60 shadow-2xs shrink-0">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider block">
                  Service Rate
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  ${formattedPrice}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  USD per booking
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60 bg-muted/20 border-b border-border/60 text-xs">
            <div className="p-4 flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-[11px]">Pricing Model</p>
                <p className="font-semibold text-foreground">Fixed Rate (${formattedPrice})</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-[11px]">Created On</p>
                <p className="font-semibold text-foreground">{formattedCreateDate}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground text-[11px]">Last Updated</p>
                <p className="font-semibold text-foreground">
                  {formattedUpdateDate || "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Description Section */}
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>Service Description</span>
              </div>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/10 p-5 rounded-2xl border border-border/60">
                {service.description}
              </p>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link href={`/provider/p_services/edit/${service.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Modify Details
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link href="/provider/p_services/create">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Create Another Service
                  </Link>
                </Button>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Offering
              </Button>
            </div>
          </CardContent>
        </Card>

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
              Are you sure you want to permanently delete &quot;{service.title}&quot;? Customers will no longer be able to book this service. This action cannot be undone.
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
