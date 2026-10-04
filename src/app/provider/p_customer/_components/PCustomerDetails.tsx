"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CustomerBooking {
  orderNumber: string;
  serviceTitle: string;
  category: string;
  date: string;
  amount: number;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  joinedDate: string;
  totalBookings: number;
  totalSpent: number;
  lastService: string;
  lastServiceDate: string;
  status: "Repeat Client" | "Active Client" | "New Client";
  notes?: string;
  bookings: CustomerBooking[];
}

interface PCustomerDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord | null;
}

export default function PCustomerDetails({
  isOpen,
  onClose,
  customer,
}: PCustomerDetailsProps) {
  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusBadge = (status: CustomerBooking["status"]) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-14 w-14 border border-border">
                {customer.avatar && <AvatarImage src={customer.avatar} alt={customer.name} />}
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
                      customer.status === "Repeat Client"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : customer.status === "Active Client"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Client since {customer.joinedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Customer
                  </span>
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="h-8 gap-1.5 text-xs rounded-xl shadow-xs"
              >
                <a href={`tel:${customer.phone}`}>
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
              </Button>
            </div>
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
                {customer.totalBookings}
              </span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Spend
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${customer.totalSpent}
              </span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-center space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Latest Order
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                {customer.lastServiceDate}
              </span>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact & Location Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">Phone Number</span>
                  <a
                    href={`tel:${customer.phone}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {customer.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-muted-foreground block">Email Address</span>
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Service Delivery Address
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="font-medium text-foreground leading-relaxed">
                {customer.address}
              </p>
            </div>
          </div>

          {/* Customer Special Notes */}
          {customer.notes && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1 text-xs">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Customer Special Preferences / Notes
              </span>
              <p className="text-muted-foreground leading-relaxed italic pt-0.5">
                &quot;{customer.notes}&quot;
              </p>
            </div>
          )}

          {/* Booked Services History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service Booking History ({customer.bookings.length})
              </h4>
              <span className="text-[11px] text-muted-foreground">
                With your provider profile
              </span>
            </div>

            <div className="space-y-2">
              {customer.bookings.map((booking, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">
                        {booking.orderNumber}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground uppercase">
                        {booking.category}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <h5 className="font-semibold text-foreground text-xs sm:text-sm">
                      {booking.serviceTitle}
                    </h5>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{booking.date}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-sm font-extrabold text-foreground block">
                      ${booking.amount}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
      </DialogContent>
    </Dialog>
  );
}
