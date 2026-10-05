"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  Printer,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useOrderById,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/useOrders";
import { OrderStatus } from "@/features/orders/api/orders.api";

interface POrderDetailsProps {
  orderId?: string;
}

export default function POrderDetails({ orderId: propId }: POrderDetailsProps) {
  const params = useParams();
  const searchParams = useSearchParams();

  // Support route param [orderId], [id], query param ?id=, or direct prop
  const resolvedId =
    propId ||
    (params?.orderId as string) ||
    (params?.id as string) ||
    searchParams?.get("id") ||
    searchParams?.get("orderId") ||
    "";

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useOrderById(resolvedId);

  const { updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();

  // Private job notes (local state)
  const [workNotes, setWorkNotes] = useState("");

  // Cancel dialog
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-xs text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {error?.message ||
            "The requested service order could not be located."}
        </p>
        <Button asChild size="sm">
          <Link href="/provider/p_orders">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  // Update order status handler
  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(
      { id: order.id, payload: { status: newStatus } },
      {
        onSuccess: () => {
          if (newStatus === "CANCELLED") {
            setIsCancelModalOpen(false);
          }
        },
      }
    );
  };

  // Print invoice / job sheet
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Status badge styling
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Action
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Progress Stepper calculation
  const getStepState = (stepNumber: number) => {
    if (order.status === "CANCELLED") {
      return stepNumber === 1 ? "completed" : "cancelled";
    }
    if (order.status === "COMPLETED") return "completed";
    if (order.status === "CONFIRMED") {
      if (stepNumber === 1) return "completed";
      if (stepNumber === 2) return "current";
      return "pending";
    }
    // PENDING
    if (stepNumber === 1) return "current";
    return "pending";
  };

  const customerName = order.customer?.name || "Customer";
  const customerInitials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedPrice = Number(order.service?.price || 0).toFixed(2);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Breadcrumb & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs rounded-xl"
            >
              <Link href="/provider/p_orders">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Bookings</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>/</span>
              <span className="font-mono font-bold text-foreground">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Actions depending on status */}
            {order.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("CONFIRMED")}
                  className="h-9 px-3.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Accept Booking</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => setIsCancelModalOpen(true)}
                  className="h-9 px-3 text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Decline</span>
                </Button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="h-9 px-3.5 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark as Completed</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => setIsCancelModalOpen(true)}
                  className="h-9 px-3 text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel Booking</span>
                </Button>
              </>
            )}

            {/* Direct Email Link */}
            {order.customer?.email && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs rounded-xl text-foreground"
              >
                <a href={`mailto:${order.customer.email}`}>
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Email Client</span>
                </a>
              </Button>
            )}

            {/* Print / Job Sheet */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrint}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
              title="Print Job Sheet"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Order Header Summary Banner */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-base font-extrabold text-foreground">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                Booking placed on <strong>{formattedDate}</strong>
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] text-muted-foreground block font-medium">
                Total Job Value
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ${formattedPrice}
              </span>
            </div>
          </div>

          {/* 3-Step Execution Stepper */}
          <div className="border-t border-border/60 pt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-xs">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    1. Booking Placed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {formattedDate}
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                      getStepState(2) === "completed"
                        ? "bg-emerald-500 text-white"
                        : getStepState(2) === "current"
                        ? "bg-blue-500 text-white ring-4 ring-blue-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStepState(2) === "completed" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    2. Provider Confirmed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {order.status === "PENDING"
                    ? "Pending acceptance"
                    : order.status === "CANCELLED"
                    ? "Declined"
                    : "Confirmed"}
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                      getStepState(3) === "completed"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStepState(3) === "completed" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    3. Job Completed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {order.status === "COMPLETED"
                    ? "Verified & closed"
                    : "Not yet finished"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Service Details & Job Log (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Service Offering Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Ordered Service Specifications
                </h3>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                >
                  <Link href={`/provider/p_services/${order.serviceId}`}>
                    <span>View Listing</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-primary">
                  <Briefcase className="h-8 w-8" />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <h4 className="text-base font-bold text-foreground">
                    {order.service?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {order.service?.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Backed by ServiceHub Quality Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Private Work Log / Execution Notes */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Technician Job Log & Notes</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Internal provider view only
                </span>
              </div>

              <textarea
                rows={3}
                placeholder="Log internal job notes, diagnosis findings, replacement parts, or client feedback..."
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-muted/20 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Column: Customer Profile & Financials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Profile Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Customer Information
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Verified Client
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {customerInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {customerName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Registered ServiceHub Customer
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/50 text-xs">
                {order.customer?.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email:
                    </span>
                    <a
                      href={`mailto:${order.customer.email}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {order.customer.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Breakdown & Settlement */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2.5">
                Financial Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Service Rate</span>
                  <span className="font-semibold text-foreground">
                    ${formattedPrice}
                  </span>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between font-extrabold text-foreground text-sm">
                  <span>Total Amount</span>
                  <span>${formattedPrice}</span>
                </div>
              </div>

              <div className="rounded-xl bg-muted/30 p-3 text-[11px] space-y-1 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Pay upon completion
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Control Panel */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Update Order Lifecycle
              </h3>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <Button
                  size="sm"
                  disabled={isUpdating}
                  variant={order.status === "CONFIRMED" ? "default" : "outline"}
                  onClick={() => handleStatusChange("CONFIRMED")}
                  className="rounded-xl h-8"
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  variant={order.status === "COMPLETED" ? "default" : "outline"}
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="rounded-xl h-8"
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  variant={
                    order.status === "CANCELLED" ? "destructive" : "outline"
                  }
                  onClick={() => setIsCancelModalOpen(true)}
                  className="rounded-xl h-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-2">
              <XCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              Decline / Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to cancel booking #
              {order.id.slice(0, 8).toUpperCase()}? The customer will be
              notified immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              disabled={isUpdating}
              onClick={() => setIsCancelModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isUpdating}
              onClick={() => handleStatusChange("CANCELLED")}
              className="text-xs rounded-xl"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
