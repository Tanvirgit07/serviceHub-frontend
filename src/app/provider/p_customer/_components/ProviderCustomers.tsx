"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Eye,
  X,
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  ArrowUpDown,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PCustomerDetails from "./PCustomerDetails";
import { useProviderCustomers } from "@/features/provider-customers/hooks/useProviderCustomers";
import { ProviderCustomer } from "@/features/provider-customers/api/provider-customers.api";

type ClientFilter = "ALL" | "Repeat Client" | "Active Client" | "New Client";
type SortOption =
  | "highest-spend"
  | "most-bookings"
  | "recently-active"
  | "name-asc";

interface ProcessedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  joinedDate: string;
  totalBookings: number;
  totalSpent: number;
  lastService: string;
  lastServiceDate: string;
  lastServiceTimestamp: number;
  status: "Repeat Client" | "Active Client" | "New Client";
}

export default function ProviderCustomers() {
  const {
    data: rawCustomers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useProviderCustomers();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ClientFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("highest-spend");

  // Selected customer ID for the details modal
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  // Map backend raw customer records to processed presentation objects
  const customers: ProcessedCustomer[] = useMemo(() => {
    const list = Array.isArray(rawCustomers) ? rawCustomers : [];
    return list.map((c: ProviderCustomer) => {
      const orders = Array.isArray(c.customerOrders) ? c.customerOrders : [];
      const totalBookings = orders.length;
      const totalSpent = orders.reduce((sum, o) => {
        if (o.status !== "CANCELLED") {
          return sum + Number(o.service?.price || 0);
        }
        return sum;
      }, 0);

      const latestOrder = orders[0];
      const lastService = latestOrder?.service?.title || "No orders yet";
      const lastServiceDate = latestOrder?.createdAt
        ? new Date(latestOrder.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";

      const lastServiceTimestamp = latestOrder?.createdAt
        ? new Date(latestOrder.createdAt).getTime()
        : new Date(c.createdAt).getTime();

      const joinedDate = new Date(c.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const status: ProcessedCustomer["status"] =
        totalBookings >= 3
          ? "Repeat Client"
          : totalBookings >= 1
          ? "Active Client"
          : "New Client";

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.businessProfile?.phone || null,
        address: c.businessProfile?.address || null,
        joinedDate,
        totalBookings,
        totalSpent,
        lastService,
        lastServiceDate,
        lastServiceTimestamp,
        status,
      };
    });
  }, [rawCustomers]);

  // Compute lifetime metrics across all customers
  const totalClients = customers.length;
  const repeatClients = customers.filter(
    (c) => c.status === "Repeat Client"
  ).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalBookings, 0);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          customer.name.toLowerCase().includes(query) ||
          (customer.phone && customer.phone.toLowerCase().includes(query)) ||
          customer.email.toLowerCase().includes(query) ||
          (customer.address &&
            customer.address.toLowerCase().includes(query)) ||
          customer.lastService.toLowerCase().includes(query);

        const matchesFilter =
          filterStatus === "ALL" || customer.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "highest-spend") return b.totalSpent - a.totalSpent;
        if (sortBy === "most-bookings") return b.totalBookings - a.totalBookings;
        if (sortBy === "recently-active") {
          return b.lastServiceTimestamp - a.lastServiceTimestamp;
        }
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, searchQuery, filterStatus, sortBy]);

  const getClientBadgeClass = (status: ProcessedCustomer["status"]) => {
    switch (status) {
      case "Repeat Client":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Active Client":
        return "bg-primary/10 text-primary border-primary/20";
      case "New Client":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Customers
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {totalClients} Clients
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clients who booked your services, their booking counts, and
              lifetime value.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 gap-1.5 text-xs rounded-xl self-start sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Minimal Lifetime Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total Clients
              </span>
              <span className="text-xl font-extrabold text-foreground">
                {totalClients}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Repeat Clients
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-foreground">
                  {repeatClients}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  (
                  {totalClients > 0
                    ? Math.round((repeatClients / totalClients) * 100)
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Client Spend
              </span>
              <span className="text-xl font-extrabold text-foreground">
                ${totalRevenue}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total Orders
              </span>
              <span className="text-xl font-extrabold text-foreground">
                {totalOrders}
              </span>
            </div>
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
                placeholder="Search by client name, email, or service..."
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

            {/* Filter Tabs & Sort Selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Tabs */}
              <div className="flex items-center rounded-xl border border-border/70 bg-muted/30 p-1 text-xs">
                {(
                  [
                    { key: "ALL", label: "All Clients", count: totalClients },
                    {
                      key: "Repeat Client",
                      label: "Repeat",
                      count: repeatClients,
                    },
                    {
                      key: "Active Client",
                      label: "Active",
                      count: customers.filter((c) => c.status === "Active Client")
                        .length,
                    },
                    {
                      key: "New Client",
                      label: "New",
                      count: customers.filter((c) => c.status === "New Client")
                        .length,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      filterStatus === tab.key
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-medium text-foreground outline-hidden cursor-pointer"
                >
                  <option value="highest-spend">Highest Spent</option>
                  <option value="most-bookings">Most Bookings</option>
                  <option value="recently-active">Recently Active</option>
                  <option value="name-asc">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Error / Content */}
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-16 text-center space-y-3">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading your customer directory...
            </p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed border-rose-500/40 bg-rose-500/5 p-12 text-center space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Failed to load customers
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {error?.message ||
                  "Could not retrieve customer records. Please check your network or try again."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                No customers found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || filterStatus !== "ALL"
                  ? "No client records match your current filter or search criteria."
                  : "You don't have any customer bookings yet. Once clients order your services, they will appear here."}
              </p>
            </div>
            {(searchQuery || filterStatus !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("ALL");
                }}
                className="text-xs rounded-xl"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card shadow-2xs overflow-hidden divide-y divide-border/60">
            {filteredCustomers.map((customer) => {
              const initials = customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={customer.id}
                  className="p-4 sm:p-5 hover:bg-muted/20 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Customer Identification & Contact */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <Avatar className="h-12 w-12 border border-border/80 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left truncate cursor-pointer"
                        >
                          {customer.name}
                        </button>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getClientBadgeClass(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-1 hover:text-foreground transition-colors truncate max-w-[200px]"
                        >
                          <Mail className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </a>

                        {customer.phone && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <a
                              href={`tel:${customer.phone}`}
                              className="flex items-center gap-1 hover:text-foreground transition-colors"
                            >
                              <Phone className="h-3 w-3 text-primary shrink-0" />
                              <span>{customer.phone}</span>
                            </a>
                          </>
                        )}
                      </div>

                      {customer.address && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                          <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Last Booked Service & Date */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between sm:justify-start lg:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
                    <div className="text-left lg:text-right space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Last Service Booked
                      </span>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[240px]">
                        {customer.lastService}
                      </p>
                      <div className="flex items-center lg:justify-end gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{customer.lastServiceDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lifetime Value / Bookings Count & Quick Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 border-t lg:border-t-0 border-border/40 pt-3 lg:pt-0">
                    {/* Stats pill */}
                    <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-1.5 border border-border/60">
                      <div className="text-center">
                        <span className="text-[10px] font-semibold text-muted-foreground block leading-tight">
                          Orders
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {customer.totalBookings}
                        </span>
                      </div>
                      <div className="h-6 w-px bg-border/80" />
                      <div className="text-center">
                        <span className="text-[10px] font-semibold text-muted-foreground block leading-tight">
                          Spend
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          ${customer.totalSpent}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      {customer.phone && (
                        <Button
                          asChild
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                          title={`Call ${customer.name}`}
                        >
                          <a href={`tel:${customer.phone}`}>
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}

                      {/* Eye Details button: Opens Modal using GET /customer/:id */}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className="h-8 gap-1.5 text-xs rounded-xl shadow-xs"
                        title="View Customer Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Details Modal Dialog (uses GET /customer/:id) */}
      <PCustomerDetails
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
      />
    </div>
  );
}
