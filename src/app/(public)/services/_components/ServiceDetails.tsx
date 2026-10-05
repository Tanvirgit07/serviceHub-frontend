"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceDetails } from "@/features/services/hook/useServices";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";

export default function ServiceDetails() {
  const params = useParams();
  const router = useRouter();
  const serviceId = (params?.serviceId as string) || "";
  const { data: session, status: sessionStatus } = useSession();

  // Fetch real service details from backend
  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useServiceDetails(serviceId);

  const { createOrder, isPending: isOrdering, isSuccess } = useCreateOrder();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("09:00 AM - 11:00 AM");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Service Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error?.message ||
            "The service you are looking for does not exist or is currently unavailable."}
        </p>
        <Button asChild className="mt-4">
          <Link href="/services">Browse All Services</Link>
        </Button>
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Not logged in → redirect to sign in
    if (sessionStatus === "unauthenticated") {
      router.push(`/signin?callbackUrl=/services/${serviceId}`);
      return;
    }

    // Provider cannot book
    if (session?.user?.role?.toUpperCase() === "PROVIDER") {
      return;
    }

    createOrder({ serviceId });
  };

  const formattedPrice = Number(service.price).toFixed(2);
  const formattedCreateDate = service.createAt
    ? new Date(service.createAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const isProvider = session?.user?.role?.toUpperCase() === "PROVIDER";
  const isLoadingSession = sessionStatus === "loading";

  const bookingButtonLabel = () => {
    if (isLoadingSession) return "Loading...";
    if (!service.availability) return "Service Unavailable";
    if (isOrdering) return "Placing Order...";
    if (isSuccess) return "Booking Confirmed ✓";
    if (isProvider) return "Providers Cannot Book";
    if (sessionStatus === "unauthenticated") return "Sign In to Book";
    return "Book This Service";
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
              {service.title}
            </span>
          </div>

          <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
            <Link href="/services">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Services
            </Link>
          </Button>
        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Details & Overview (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main Banner Card */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-muted/40 to-card p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs border border-border/60">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Verified Professional Service
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    service.availability
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      service.availability ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {service.availability ? "Available for Booking" : "Currently Paused"}
                </span>
              </div>

              <div className="flex items-start gap-4 pt-2">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background text-primary shadow-xs">
                  <Briefcase className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {service.title}
                  </h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Listed on {formattedCreateDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                About This Service
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {service.description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Verified Technicians</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>Punctual Service</span>
                </div>
              </div>
            </div>

            {/* Standard Guarantees */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                ServiceHub Quality Guarantee
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All bookings through ServiceHub are protected by our service assurance. If you are not satisfied with the work done, our support team will help resolve the issue or arrange a re-service.
              </p>
            </div>

          </div>

          {/* Right Column: Booking Sidebar Card (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">

              {/* Pricing Header */}
              <div className="border-b border-border/60 pb-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Upfront Rate
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    ${formattedPrice}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    USD / service
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Transparent pricing with no hidden charges.
                </p>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBooking} className="space-y-4">

                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Select Appointment Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Preferred Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM – 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM – 01:00 PM (Midday)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM – 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM – 06:00 PM (Evening)</option>
                  </select>
                </div>

                {/* Submit Booking Button */}
                <Button
                  type="submit"
                  disabled={
                    !service.availability ||
                    isOrdering ||
                    isSuccess ||
                    isLoadingSession ||
                    isProvider
                  }
                  className="w-full h-11 font-semibold rounded-xl text-sm mt-2"
                >
                  {isOrdering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {bookingButtonLabel()}
                </Button>

                {isSuccess && (
                  <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-medium">
                    Order placed! The provider will confirm your booking shortly.{" "}
                    <Link href="/account/my-orders" className="underline font-bold">
                      View My Orders →
                    </Link>
                  </p>
                )}

                {isProvider && (
                  <p className="text-[11px] text-center text-amber-600 font-medium">
                    Providers cannot place orders. Switch to a customer account.
                  </p>
                )}

              </form>

              {/* Trust Footer */}
              <div className="pt-4 border-t border-border/60 text-center space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  Pay upon service completion
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Free cancellation available from your orders page.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
