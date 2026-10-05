"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Check,
  X,
  Eye,
  CreditCard,
  PackageCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Briefcase,
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
import {
  useProviderOrders,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/useOrders";
import { Order, OrderStatus } from "@/features/orders/api/orders.api";

export default function POrderList() {
  const { data: orders = [], isLoading, isError, error } = useProviderOrders();
  const { updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");

  // Selected Order for quick inspection & management dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtered & sorted orders
  const filteredOrders = useMemo(() => {
    return (orders as Order[])
      .filter((order: Order) => {
        const query = searchQuery.toLowerCase().trim();
        const shortId = order.id.slice(0, 8).toLowerCase();
        const fullId = order.id.toLowerCase();
        const serviceTitle = order.service?.title?.toLowerCase() || "";
        const customerName = order.customer?.name?.toLowerCase() || "";
        const customerEmail = order.customer?.email?.toLowerCase() || "";

        const matchesSearch =
          !query ||
          shortId.includes(query) ||
          fullId.includes(query) ||
          serviceTitle.includes(query) ||
          customerName.includes(query) ||
          customerEmail.includes(query);

        const matchesStatus =
          statusFilter === "ALL" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a: Order, b: Order) => {
        const priceA = Number(a.service?.price || 0);
        const priceB = Number(b.service?.price || 0);
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortBy === "amount-high") return priceB - priceA;
        if (sortBy === "amount-low") return priceA - priceB;
        if (sortBy === "oldest") return dateA - dateB;
        return dateB - dateA;
      });
  }, [orders, searchQuery, statusFilter, sortBy]);

  // Handle status update
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(
      { id: orderId, payload: { status: newStatus } },
      {
        onSuccess: (updatedOrder: Order) => {
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({
              ...selectedOrder,
              ...updatedOrder,
              status: newStatus,
            });
          }
        },
      }
    );
  };

  // Status badge renderer
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Action
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // KPI counts
  const totalCount = orders.length;
  const pendingCount = (orders as Order[]).filter(
    (o: Order) => o.status === "PENDING"
  ).length;
  const confirmedCount = (orders as Order[]).filter(
    (o: Order) => o.status === "CONFIRMED"
  ).length;
  const completedCount = (orders as Order[]).filter(
    (o: Order) => o.status === "COMPLETED"
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading service bookings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to Load Orders</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {error?.message || "Could not retrieve bookings. Please try again."}
        </p>
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
                Service Bookings
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {totalCount} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review and manage incoming customer bookings, order status, and job completion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{pendingCount} Pending Orders Need Action</span>
              </span>
            )}
          </div>
        </div>

        {/* Minimal Search & Filter Toolbar */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order #, service, customer, email..."
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

            {/* Status Tabs & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Tabs */}
              <div className="flex flex-wrap items-center rounded-xl border border-border/70 bg-muted/30 p-1 text-xs">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "ALL"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setStatusFilter("PENDING")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "PENDING"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter("CONFIRMED")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "CONFIRMED"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Confirmed ({confirmedCount})
                </button>
                <button
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "newest"
                        | "oldest"
                        | "amount-high"
                        | "amount-low"
                    )
                  }
                  className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="newest">Booking: Newest First</option>
                  <option value="oldest">Booking: Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List View */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto text-muted-foreground">
              <PackageCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No bookings found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                No orders match your current search or status filter.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
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
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order: Order) => {
              const formattedPrice = Number(order.service?.price || 0).toFixed(2);
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={order.id}
                  className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all"
                >
                  {/* Left: Thumbnail & Service Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-muted-foreground group-hover:bg-primary/5 transition-colors">
                      <Briefcase className="h-7 w-7 text-primary" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        {renderStatusBadge(order.status)}
                      </div>

                      <Link
                        href={`/provider/p_orders/${order.id}`}
                        className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors truncate block"
                        title={order.service?.title}
                      >
                        {order.service?.title || "Service Title"}
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {order.customer?.name || "Customer"}
                        </span>
                        {order.customer?.email && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              {order.customer.email}
                            </span>
                          </>
                        )}
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing, Status Management & Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-border/40">
                    {/* Price */}
                    <div className="text-left lg:text-right">
                      <span className="text-base sm:text-lg font-extrabold text-foreground tracking-tight block">
                        ${formattedPrice}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Service Rate
                      </span>
                    </div>

                    {/* Quick Status Action Buttons */}
                    <div className="flex items-center gap-2">
                      {order.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(order.id, "CONFIRMED")
                            }
                            className="h-8 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-2xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(order.id, "CANCELLED")
                            }
                            className="h-8 px-2.5 text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
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
                            onClick={() =>
                              handleStatusChange(order.id, "COMPLETED")
                            }
                            className="h-8 px-3 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Complete</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(order.id, "CANCELLED")
                            }
                            className="h-8 px-2.5 text-xs rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </Button>
                        </>
                      )}

                      {/* View Details Button */}
                      <Button asChild variant="outline" size="sm" className="h-8 px-2.5 text-xs rounded-xl gap-1">
                        <Link href={`/provider/p_orders/${order.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Details</span>
                        </Link>
                      </Button>

                      {/* Quick Inspect Dialog Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                        title="Quick Manage"
                      >
                        Status
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Order Inspection & Management Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <span>
                    Booking #{selectedOrder?.id.slice(0, 8).toUpperCase()}
                  </span>
                  {selectedOrder && renderStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Booked on{" "}
                  {selectedOrder &&
                    new Date(selectedOrder.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2 text-xs">
              {/* Service Preview */}
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xs sm:text-sm">
                    {selectedOrder.service?.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {selectedOrder.service?.description}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Customer Information
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {selectedOrder.customer?.name || "Customer"}
                  </p>
                  {selectedOrder.customer?.email && (
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <a
                        href={`mailto:${selectedOrder.customer.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedOrder.customer.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Billing Breakdown */}
              <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Rate</span>
                  <span>
                    ${Number(selectedOrder.service?.price || 0).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-border/50 pt-1.5 flex justify-between font-bold text-foreground text-sm">
                  <span>Total Amount</span>
                  <span>
                    ${Number(selectedOrder.service?.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Change Status Controls */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Update Booking Status
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    variant={
                      selectedOrder.status === "PENDING" ? "default" : "outline"
                    }
                    onClick={() =>
                      handleStatusChange(selectedOrder.id, "PENDING")
                    }
                    className="h-8 text-xs rounded-xl"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    variant={
                      selectedOrder.status === "CONFIRMED"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleStatusChange(selectedOrder.id, "CONFIRMED")
                    }
                    className="h-8 text-xs rounded-xl"
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    variant={
                      selectedOrder.status === "COMPLETED"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleStatusChange(selectedOrder.id, "COMPLETED")
                    }
                    className="h-8 text-xs rounded-xl"
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    variant={
                      selectedOrder.status === "CANCELLED"
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() =>
                      handleStatusChange(selectedOrder.id, "CANCELLED")
                    }
                    className="h-8 text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-row items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
            {selectedOrder && (
              <Button asChild size="sm" className="text-xs rounded-xl">
                <Link href={`/provider/p_orders/${selectedOrder.id}`}>
                  Full Order Page →
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
