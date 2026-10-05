"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ShoppingBag,
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
import { useProviderCustomerDetails } from "@/features/provider-customers/hooks/useProviderCustomers";
import { ProviderCustomerOrder } from "@/features/provider-customers/api/provider-customers.api";

interface PCustomerDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

export default function PCustomerDetails({
  isOpen,
  onClose,
  customerId,
}: PCustomerDetailsProps) {
  // Query 2nd API: GET /customer/:id
  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useProviderCustomerDetails(isOpen ? customerId : null);

  const getStatusBadge = (status: ProviderCustomerOrder["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const initials = customer?.name
    ? customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  const orders = Array.isArray(customer?.customerOrders)
    ? customer.customerOrders
    : [];
  const totalBookings = orders.length;
  const totalSpent = orders.reduce((sum, o) => {
    if (o.status !== "CANCELLED") {
      return sum + Number(o.service?.price || 0);
    }
    return sum;
  }, 0);

  const clientStatus =
    totalBookings >= 3
      ? "Repeat Client"
      : totalBookings >= 1
      ? "Active Client"
      : "New Client";

  const joinedFormatted = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recent";

  const latestOrderDate = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No orders";

  const phone = customer?.businessProfile?.phone;
  const address = customer?.businessProfile?.address;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading customer details...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <p className="text-sm font-semibold text-foreground">
              Failed to load customer profile
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {error?.message || "Could not retrieve details for this customer."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="mt-2 text-xs rounded-xl"
            >
              Close
            </Button>
          </div>
        ) : customer ? (
          <>
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground">
                        {customer.name}
                      </DialogTitle>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          clientStatus === "Repeat Client"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : clientStatus === "Active Client"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {clientStatus}
                      </span>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Client since {joinedFormatted}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified Client
                      </span>
                    </DialogDescription>
                  </div>
                </div>

                {phone && (
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 gap-1.5 text-xs rounded-xl shadow-xs"
                    >
                      <a href={`tel:${phone}`}>
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Key Lifetime Stats Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-center space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Total Bookings
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-foreground">
                    {totalBookings}
                  </span>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-center space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Total Spend
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${totalSpent}
                  </span>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-center space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Latest Order
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                    {latestOrderDate}
                  </span>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-muted-foreground block">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${customer.email}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Phone Number
                      </span>
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {address && (
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        Address
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Google Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="font-medium text-foreground leading-relaxed">
                      {address}
                    </p>
                  </div>
                )}
              </div>

              {/* Booked Services History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Service Booking History ({orders.length})
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    With your provider services
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground space-y-2">
                    <ShoppingBag className="h-6 w-6 mx-auto text-muted-foreground/50" />
                    <p>No orders recorded with this customer yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => {
                      const orderDate = new Date(
                        order.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={order.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-foreground">
                                ORD-{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <h5 className="font-semibold text-foreground text-xs sm:text-sm">
                              {order.service?.title || "Custom Service"}
                            </h5>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{orderDate}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-sm font-extrabold text-foreground block">
                              ${Number(order.service?.price || 0)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {order.status === "COMPLETED"
                                ? "Settled"
                                : order.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="border-t border-border/60 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs rounded-xl"
              >
                Close Details
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
