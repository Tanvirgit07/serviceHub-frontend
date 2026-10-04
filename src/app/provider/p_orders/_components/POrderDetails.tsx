"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  CreditCard,
  Printer,
  Sparkles,
  ShieldCheck,
  FileText,
  ExternalLink,
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
import { toast } from "sonner";
import {
  OrderItem,
  OrderStatus,
  getStoredOrderById,
  getStoredOrders,
  updateStoredOrderStatus,
  INITIAL_ORDERS,
} from "@/data/ordersData";

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

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderItem | null>(null);

  // Private job notes
  const [workNotes, setWorkNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Cancel dialog
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    let targetId = resolvedId;

    // Fallback to first available order if no ID specified
    if (!targetId) {
      const allOrders = getStoredOrders();
      if (allOrders.length > 0) {
        targetId = allOrders[0].id;
      }
    }

    if (targetId) {
      const found =
        getStoredOrderById(targetId) ||
        INITIAL_ORDERS.find((o) => o.id === targetId || o.orderNumber === targetId) ||
        null;
      setOrder(found);
    }
    setIsLoading(false);
  }, [resolvedId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-xs text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto text-muted-foreground">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          The requested service order could not be located in your bookings list.
        </p>
        <Button asChild size="sm">
          <Link href="/provider/p_orders">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  // Update order status handler
  const handleStatusChange = (newStatus: OrderStatus) => {
    const updated = updateStoredOrderStatus(order.id, newStatus);
    if (updated) {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));

      const statusLabels: Record<OrderStatus, string> = {
        CONFIRMED: "Booking Confirmed & Scheduled",
        COMPLETED: "Service Marked as Completed",
        CANCELLED: "Booking Cancelled",
        PENDING: "Set to Pending",
      };

      toast.success(statusLabels[newStatus]);
      if (newStatus === "CANCELLED") {
        setIsCancelModalOpen(false);
      }
    } else {
      toast.error("Failed to update booking status.");
    }
  };

  // Save work notes handler
  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
      setIsSavingNotes(false);
      toast.success("Job execution notes saved.");
    }, 400);
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
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Confirmed & Scheduled
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Action
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed & Verified
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

  // Progress Stepper steps calculation
  const getStepState = (stepNumber: number) => {
    if (order.status === "CANCELLED") {
      return stepNumber === 1 ? "completed" : "cancelled";
    }
    if (order.status === "COMPLETED") return "completed";
    if (order.status === "CONFIRMED") {
      if (stepNumber <= 2) return "completed";
      if (stepNumber === 3) return "current";
      return "pending";
    }
    // PENDING
    if (stepNumber === 1) return "completed";
    if (stepNumber === 2) return "current";
    return "pending";
  };

  const customerInitials = order.customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Top Breadcrumb & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl">
              <Link href="/provider/p_orders">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Bookings</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>/</span>
              <span className="font-mono font-bold text-foreground">
                {order.orderNumber}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Actions depending on status */}
            {order.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("CONFIRMED")}
                  className="h-9 px-3.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Accept Booking</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="h-9 px-3 text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Decline</span>
                </Button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <Button
                size="sm"
                onClick={() => handleStatusChange("COMPLETED")}
                className="h-9 px-3.5 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark as Completed</span>
              </Button>
            )}

            {/* Direct Call Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs rounded-xl text-foreground"
            >
              <a href={`tel:${order.customer.phone}`}>
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>Call Client</span>
              </a>
            </Button>

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
                  {order.orderNumber}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground uppercase tracking-wide">
                  {order.category}
                </span>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                Booking placed on <strong>{order.bookingDate}</strong> via {order.paymentMethod}
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] text-muted-foreground block font-medium">
                Total Job Value
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ${order.totalAmount}
              </span>
            </div>
          </div>

          {/* 4-Step Execution Stepper */}
          <div className="border-t border-border/60 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
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
                  {order.bookingDate}
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
                        ? "bg-amber-500 text-white ring-4 ring-amber-500/20"
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
                    : "Confirmed & locked"}
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                      getStepState(3) === "completed"
                        ? "bg-emerald-500 text-white"
                        : getStepState(3) === "current"
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
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
                    3. Scheduled Job
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {order.scheduledDate}
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                      getStepState(4) === "completed"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStepState(4) === "completed" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      "4"
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    4. Job Completed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {order.status === "COMPLETED" ? "Verified & closed" : "Awaiting execution"}
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
                <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Link href={`/provider/p_services/${order.serviceId}`}>
                    <span>View Listing</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={order.serviceImage}
                    alt={order.serviceTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <h4 className="text-base font-bold text-foreground">
                    {order.serviceTitle}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                      {order.category}
                    </span>
                    <span>•</span>
                    <span>Standard Labor & Testing Included</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Backed by 30-Day ServiceHub Warranty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Instructions & Notes */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm border-b border-border/60 pb-3">
                <FileText className="h-4 w-4 text-primary" />
                <span>Customer Special Instructions</span>
              </div>

              {order.customer.notes ? (
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-foreground leading-relaxed italic">
                  &quot;{order.customer.notes}&quot;
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No special instructions provided by the customer for this appointment.
                </p>
              )}
            </div>

            {/* Provider Private Work Log / Execution Notes */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Technician Job Log & Notes</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Internal provider view only</span>
              </div>

              <textarea
                rows={3}
                placeholder="Log internal job notes, diagnosis findings, replacement parts, or client feedback..."
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-muted/20 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || !workNotes.trim()}
                  className="h-8 text-xs rounded-xl"
                >
                  {isSavingNotes ? "Saving..." : "Save Job Notes"}
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column: Customer Profile & Financials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Customer Profile & Address Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Customer & Job Location
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
                    {order.customer.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Registered ServiceHub Customer
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/50 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone:
                  </span>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {order.customer.phone}
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Service Address:
                  </span>
                  <p className="font-medium text-foreground pl-5 leading-relaxed">
                    {order.customer.address}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs rounded-xl h-8 gap-1.5"
                >
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(order.customer.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Appointment Schedule Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2.5">
                Appointment Schedule
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-muted/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    Date
                  </span>
                  <p className="font-bold text-foreground">
                    {order.scheduledDate}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/30 p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" />
                    Time Slot
                  </span>
                  <p className="font-bold text-foreground">
                    {order.scheduledTimeSlot}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Breakdown & Settlement */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2.5">
                Financial & Payment Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Labor / Service</span>
                  <span className="font-semibold text-foreground">${order.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ServiceHub Platform Fee</span>
                  <span className="font-semibold text-foreground">${order.platformFee}</span>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between font-extrabold text-foreground text-sm">
                  <span>Total Customer Paid</span>
                  <span>${order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                  <span>Provider Net Payout</span>
                  <span>${order.price}</span>
                </div>
              </div>

              <div className="rounded-xl bg-muted/30 p-3 text-[11px] space-y-1 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-primary" />
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Settlement Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Control Panel */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Update Order Lifecycle
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  size="sm"
                  variant={order.status === "CONFIRMED" ? "default" : "outline"}
                  onClick={() => handleStatusChange("CONFIRMED")}
                  className="rounded-xl h-8"
                >
                  Confirm Job
                </Button>
                <Button
                  size="sm"
                  variant={order.status === "COMPLETED" ? "default" : "outline"}
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="rounded-xl h-8"
                >
                  Complete Job
                </Button>
                <Button
                  size="sm"
                  variant={order.status === "PENDING" ? "default" : "outline"}
                  onClick={() => handleStatusChange("PENDING")}
                  className="rounded-xl h-8"
                >
                  Set Pending
                </Button>
                <Button
                  size="sm"
                  variant={order.status === "CANCELLED" ? "destructive" : "outline"}
                  onClick={() => setIsCancelModalOpen(true)}
                  className="rounded-xl h-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Cancel / Decline
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
            <DialogTitle className="text-base font-bold">Decline / Cancel Booking</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to cancel booking #{order.orderNumber}? The customer will be notified and any pre-authorizations will be refunded.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusChange("CANCELLED")}
              className="text-xs rounded-xl"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
