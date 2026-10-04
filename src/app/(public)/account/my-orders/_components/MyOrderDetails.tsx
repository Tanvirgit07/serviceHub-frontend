"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Star,
  AlertCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  OrderItem,
  OrderStatus,
  getStoredOrderById,
  cancelStoredOrder,
  INITIAL_ORDERS,
} from "@/data/ordersData";

export default function MyOrderDetails() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      const found =
        getStoredOrderById(orderId) ||
        INITIAL_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId) ||
        null;
      setOrder(found);
    }
    setIsLoading(false);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          We couldn&apos;t locate the order details you requested.
        </p>
        <Button asChild>
          <Link href="/account/my-orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  const handleCancel = () => {
    const success = cancelStoredOrder(order.id);
    if (success) {
      setOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      toast.success(`Booking #${order.orderNumber} has been cancelled.`);
      setIsCancelModalOpen(false);
    } else {
      toast.error("Failed to cancel order.");
    }
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

  // Stepper calculations
  const steps = [
    { label: "Booked", done: true },
    { label: "Confirmed", done: order.status === "CONFIRMED" || order.status === "COMPLETED" },
    { label: "In Progress", done: order.status === "CONFIRMED" || order.status === "COMPLETED" },
    { label: "Completed", done: order.status === "COMPLETED" },
  ];

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
            <span className="text-foreground font-medium">#{order.orderNumber}</span>
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
            <span className="text-xs text-muted-foreground block">
              Booking ID: #{order.orderNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Service Appointment Details
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on {order.bookingDate}
            </p>
          </div>

          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* Order Stepper (Shown if not cancelled) */}
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
          
          {/* Left Column (8 cols): Service Info, Provider, Address */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Service Item Summary */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Service Booked
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                  <Image
                    src={order.serviceImage}
                    alt={order.serviceTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground uppercase">
                    {order.category}
                  </span>
                  <h3 className="font-bold text-base text-foreground">
                    {order.serviceTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
                    <span className="font-medium text-foreground">${order.price}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {order.scheduledTimeSlot}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Schedule & Location */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Appointment & Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">
                    Scheduled Date & Time
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{order.scheduledDate}</span>
                  </div>
                  <p className="text-muted-foreground pl-6">
                    Slot: {order.scheduledTimeSlot}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">
                    Service Address
                  </span>
                  <div className="flex items-start gap-2 text-foreground font-semibold text-sm">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{order.customer.address}</span>
                  </div>
                  <p className="text-muted-foreground pl-6">
                    Contact: {order.customer.phone}
                  </p>
                </div>
              </div>

              {order.customer.notes && (
                <div className="pt-3 border-t border-border/50 text-xs">
                  <span className="text-muted-foreground font-medium">Customer Notes: </span>
                  <span className="text-foreground">{order.customer.notes}</span>
                </div>
              )}
            </div>

            {/* Assigned Provider Information */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Service Partner
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={order.provider.avatar} alt={order.provider.name} />
                    <AvatarFallback className="font-bold text-xs">
                      {order.provider.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {order.provider.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{order.provider.rating} Rating</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-muted-foreground space-y-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {order.provider.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {order.provider.email}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Billing & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Payment Summary Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Payment Summary
              </h2>

              <div className="space-y-2 text-xs text-muted-foreground border-b border-border/60 pb-4">
                <div className="flex justify-between">
                  <span>Service Rate</span>
                  <span className="font-semibold text-foreground">${order.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-foreground">${order.platformFee}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/40 text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold text-foreground">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {order.paymentStatus}
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

                {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                Have questions or need to reschedule? Our customer support is available 24/7.
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
                  <p className="text-xs text-muted-foreground">Booking #{order.orderNumber}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel this booking? The assigned technician will be notified immediately.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                  Keep Booking
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
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
