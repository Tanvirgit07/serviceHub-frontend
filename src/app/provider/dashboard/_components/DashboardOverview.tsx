"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  DollarSign,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  Wrench,
  Star,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Phone,
  ListOrdered,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredServices, Service } from "@/data/servicesData";
import { getStoredOrders, OrderItem } from "@/data/ordersData";

const RECENT_REVIEWS = [
  {
    id: "rev-1",
    customer: "Rahim Chowdhury",
    rating: 5,
    service: "AC Master Servicing",
    date: "Yesterday",
    comment: "Punctual, polite, and extremely thorough. My AC is cooling like brand new!",
  },
  {
    id: "rev-2",
    customer: "Nusrat Jahan",
    rating: 5,
    service: "Full Home Deep Cleaning",
    date: "3 days ago",
    comment: "Outstanding cleaning crew. Left the entire apartment spotless.",
  },
  {
    id: "rev-3",
    customer: "Kamal Hossain",
    rating: 5,
    service: "Emergency Plumbing",
    date: "5 days ago",
    comment: "Arrived within 30 minutes and fixed the master bathroom leak immediately.",
  },
];

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setServices(getStoredServices());
    setOrders(getStoredOrders());
    setIsLoading(false);
  }, []);

  const providerName = session?.user?.name || "Service Partner";
  const activeServices = services.filter((s) => s.availability);
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED");

  // Calculate simulated earnings
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 1850);

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Action
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6 sm:py-8 lg:py-6">
      <div className="sm:px-6 lg:px-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Provider Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {providerName}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Here is a summary of your service performance, upcoming customer bookings, and earnings for this month.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-xl shadow-2xs">
                <Link href="/provider/p_services">
                  <ListOrdered className="h-3.5 w-3.5" />
                  Manage Listings
                </Link>
              </Button>
              <Button asChild size="sm" className="h-9 gap-1.5 text-xs rounded-xl shadow-xs">
                <Link href="/provider/p_services/create">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add New Service
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Metric / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Total Earnings */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total Revenue
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ${totalEarnings.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+16.4% from last month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Active Bookings
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {pendingOrders.length + confirmedOrders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{pendingOrders.length} pending</span> action today
              </p>
            </div>
          </div>

          {/* Card 3: Active Listings */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Service Listings
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {services.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-600 font-semibold">{activeServices.length} online</span> for customer orders
              </p>
            </div>
          </div>

          {/* Card 4: Customer Rating */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Partner Rating
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                <span>4.9</span>
                <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                99.2% positive client reviews
              </p>
            </div>
          </div>

        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Recent Orders & Top Services (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section: Recent Booking Requests */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Recent Bookings & Appointments
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Latest customer service requests assigned to your profile
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                  <Link href="/account/my-orders">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              {isLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Loading bookings...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-foreground">No bookings yet</p>
                  <p className="text-xs text-muted-foreground">
                    New customer requests will show up right here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/70 p-4 transition-all hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                          <Image
                            src={order.serviceImage}
                            alt={order.serviceTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                            {order.serviceTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-primary" />
                              {order.scheduledDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {order.scheduledTimeSlot}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                        <div className="text-left sm:text-right">
                          <span className="text-sm sm:text-base font-extrabold text-foreground block">
                            ${order.totalAmount}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs rounded-lg">
                          <Link href={`/account/my-orders/${order.id}`}>
                            Details
                            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Your Top Services */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Your Active Services
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Quickly check and manage your published service offerings
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                  <Link href="/provider/p_services">
                    Manage All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.slice(0, 3).map((svc) => (
                  <div
                    key={svc.id}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="relative h-28 w-full overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                          src={svc.imageUrl}
                          alt={svc.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          {svc.category}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                        {svc.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Starting at</span>
                        <span className="font-extrabold text-foreground text-sm">
                          ${svc.price}
                        </span>
                      </div>
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs px-2.5 rounded-lg">
                        <Link href={`/provider/p_services/edit/${svc.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quick Actions & Reviews (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Shortcuts Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                Quick Shortcuts
              </h3>

              <div className="space-y-2">
                <Link
                  href="/provider/p_services/create"
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <PlusCircle className="h-4 w-4" />
                    </div>
                    <span>Create New Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/provider/p_services"
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ListOrdered className="h-4 w-4" />
                    </div>
                    <span>Service Catalog</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/provider/p_profile"
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <span>Provider Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Payout & Banking Status Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Next Scheduled Payout</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Estimated Amount</span>
                  <span className="font-extrabold text-foreground text-sm">$480.00</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Transfer Date</span>
                  <span>Friday, Oct 9, 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Direct bank deposit verified</span>
              </div>
            </div>

            {/* Recent Customer Reviews Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Recent Reviews
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  4.9 ★ Rating
                </span>
              </div>

              <div className="space-y-3">
                {RECENT_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {rev.customer}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 pt-0.5">
                      <span>{rev.service}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Support Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>Partner Support 24/7</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Need help with a job or customer request? Contact our dedicated technician assistance line.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
