"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  OrderItem,
  OrderStatus,
  getStoredOrders,
} from "@/data/ordersData";

export default function MyOrders() {
  const [orders, setServicesOrders] = useState<OrderItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setServicesOrders(getStoredOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        order.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Confirmation
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed & Scheduled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 sm:py-12 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/account/profile" className="hover:text-foreground transition-colors">
              Account
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                My Service Bookings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track appointments, view invoices, or book repeat services.
              </p>
            </div>

            <Button asChild size="sm" className="gap-2 shrink-0">
              <Link href="/services">
                <Sparkles className="h-3.5 w-3.5" />
                Book New Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: "All Orders", value: "ALL" },
                { label: "Pending", value: "PENDING" },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Cancelled", value: "CANCELLED" },
              ].map((tab) => {
                const isActive = statusFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order ID or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm space-y-4"
              >
                {/* Order Top Bar: ID, Date, and Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      #{order.orderNumber}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Booked on {order.bookingDate}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Main Order Content */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
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
                      <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                        {order.serviceTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1 text-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {order.scheduledDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {order.scheduledTimeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Primary CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground block">
                        Total Amount
                      </span>
                      <span className="text-base sm:text-lg font-bold text-foreground">
                        ${order.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                        <Link href={`/account/my-orders/${order.id}`}>
                          View Details
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Assigned Provider Quick Strip */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-border">
                      <AvatarImage src={order.provider.avatar} alt={order.provider.name} />
                      <AvatarFallback className="text-[10px]">
                        {order.provider.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      Technician: <strong className="text-foreground">{order.provider.name}</strong>
                    </span>
                  </div>

                  <span className="text-[11px]">
                    Payment: <strong className="text-foreground">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Orders State */
          <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                No Orders Found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No bookings match your current search or status filter."
                  : "You haven't booked any services yet."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              {(searchQuery || statusFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  Reset Filter
                </Button>
              )}
              <Button asChild size="sm">
                <Link href="/services">Browse Available Services</Link>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
