"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Loader2,
  DollarSign,
  Briefcase,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOrderById, useCancelOrder } from "@/features/orders/hooks/useOrders";
import { OrderStatus } from "@/features/orders/api/orders.api";

export default function MyOrderDetails() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrderById(orderId);

  const { cancelOrder, isPending: isCancelling } = useCancelOrder();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  // ── Error / Not Found ──────────────────────────────────────────────────────
  if (isError || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error?.message ||
            "We couldn't locate the order details you requested."}
        </p>
        <Button asChild>
          <Link href="/account/my-orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  const handleCancel = () => {
    cancelOrder(order.id, {
      onSuccess: () => {
        setIsCancelModalOpen(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to cancel order.");
        setIsCancelModalOpen(false);
      },
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Confirmation
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed & Scheduled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Service Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
    }
  };

  // Stepper — only show if not cancelled
  const steps = [
    { label: "Booked", done: true },
    {
      label: "Confirmed",
      done: order.status === "CONFIRMED" || order.status === "COMPLETED",
    },
    { label: "Completed", done: order.status === "COMPLETED" },
  ];

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-muted/20 py-8 sm:py-12 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">

        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/account/my-orders" className="hover:text-foreground transition-colors">
              My Orders
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
            <Link href="/account/my-orders">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Orders
            </Link>
          </Button>
        </div>

        {/* Order Header Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground block font-mono">
              Order ID: #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {order.service.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* Order Stepper (shown if not cancelled) */}
        {order.status !== "CANCELLED" && (
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      st.done
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      st.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (8 cols): Service Info */}
          <div className="lg:col-span-8 space-y-6">

            {/* Service Summary */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Service Booked
              </h2>

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                  <Briefcase className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-foreground">
                    {order.service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {order.service.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      ${Number(order.service.price).toFixed(2)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {order.service.availability
                        ? "Service Available"
                        : "Service Paused"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Booking Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">
                    Order Placed
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">
                    Last Updated
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {new Date(order.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Billing & Actions */}
          <div className="lg:col-span-4 space-y-6">

            {/* Payment Summary Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs text-muted-foreground border-b border-border/60 pb-4">
                <div className="flex justify-between">
                  <span>Service Rate</span>
                  <span className="font-semibold text-foreground">
                    ${Number(order.service.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/40 text-sm font-bold text-foreground">
                  <span>Total</span>
                  <span>${Number(order.service.price).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Status:</span>
                  <span className="font-semibold text-foreground capitalize">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <Button asChild className="w-full text-xs">
                  <Link href={`/services/${order.serviceId}`}>
                    Book This Service Again
                  </Link>
                </Button>

                {canCancel && (
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>

            {/* Support Info Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <HelpCircle className="h-4 w-4 text-primary" />
                <h3>Need Assistance?</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Have questions or need help with your booking? Our customer support is available 24/7.
              </p>
              <div className="pt-1 text-xs text-primary font-medium">
                support@servicehub.com
              </div>
            </div>

          </div>

        </div>

        {/* Cancel Confirmation Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-destructive">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Cancel Booking</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel this booking? The service provider will be notified immediately.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Yes, Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
