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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PCustomerDetails, { CustomerRecord } from "./PCustomerDetails";

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-001",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    phone: "+880 1712-345678",
    address: "House 42, Road 11, Block D, Banani, Dhaka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    joinedDate: "Aug 2025",
    totalBookings: 4,
    totalSpent: 205,
    lastService: "AC Master Servicing & Gas Refill",
    lastServiceDate: "2026-10-02",
    status: "Repeat Client",
    notes: "Prefers morning slots before 12 PM. Please call 15 minutes before arriving at the building.",
    bookings: [
      {
        orderNumber: "ORD-98421",
        serviceTitle: "AC Master Servicing & Gas Refill",
        category: "Appliances",
        date: "2026-10-02",
        amount: 50,
        status: "CONFIRMED",
      },
      {
        orderNumber: "ORD-97814",
        serviceTitle: "Full Home Deep Cleaning & Sanitization",
        category: "Cleaning",
        date: "2026-09-28",
        amount: 70,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-96502",
        serviceTitle: "Emergency Plumbing & Pipe Leak Fix",
        category: "Plumbing",
        date: "2026-10-03",
        amount: 40,
        status: "PENDING",
      },
      {
        orderNumber: "ORD-95110",
        serviceTitle: "Electrical Circuit & Switchboard Repair",
        category: "Electrical",
        date: "2026-09-15",
        amount: 45,
        status: "CANCELLED",
      },
    ],
  },
  {
    id: "cust-002",
    name: "Sarah Rahman",
    email: "sarah.rahman@gmail.com",
    phone: "+880 1819-234567",
    address: "Apt 5B, Green Valley Residences, Gulshan 2, Dhaka",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    joinedDate: "Jan 2026",
    totalBookings: 3,
    totalSpent: 185,
    lastService: "Full Home Deep Cleaning & Sanitization",
    lastServiceDate: "2026-09-29",
    status: "Repeat Client",
    notes: "Has friendly pets at home. Eco-friendly cleaning detergents preferred.",
    bookings: [
      {
        orderNumber: "ORD-97450",
        serviceTitle: "Full Home Deep Cleaning & Sanitization",
        category: "Cleaning",
        date: "2026-09-29",
        amount: 75,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-94210",
        serviceTitle: "Sofa & Upholstery Steam Wash",
        category: "Cleaning",
        date: "2026-08-14",
        amount: 65,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-92100",
        serviceTitle: "Kitchen Chimney & Exhaust Cleaning",
        category: "Appliances",
        date: "2026-06-10",
        amount: 45,
        status: "COMPLETED",
      },
    ],
  },
  {
    id: "cust-003",
    name: "Kamal Hossain",
    email: "kamal.hossain@outlook.com",
    phone: "+880 1914-789012",
    address: "Plot 18, Sector 4, Uttara, Dhaka",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    joinedDate: "May 2026",
    totalBookings: 2,
    totalSpent: 95,
    lastService: "Emergency Plumbing & Pipe Leak Fix",
    lastServiceDate: "2026-10-01",
    status: "Active Client",
    notes: "Security gate requires visitor ID entry before coming up to 4th floor.",
    bookings: [
      {
        orderNumber: "ORD-98112",
        serviceTitle: "Emergency Plumbing & Pipe Leak Fix",
        category: "Plumbing",
        date: "2026-10-01",
        amount: 45,
        status: "CONFIRMED",
      },
      {
        orderNumber: "ORD-96102",
        serviceTitle: "Water Pump & Pressure Motor Tuning",
        category: "Plumbing",
        date: "2026-07-22",
        amount: 50,
        status: "COMPLETED",
      },
    ],
  },
  {
    id: "cust-004",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@yahoo.com",
    phone: "+880 1611-345987",
    address: "Flat 3A, Lakeview Heights, Dhanmondi 27, Dhaka",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    joinedDate: "Sep 2026",
    totalBookings: 1,
    totalSpent: 55,
    lastService: "Electrical Circuit & Switchboard Repair",
    lastServiceDate: "2026-10-03",
    status: "New Client",
    notes: "Urgent fix requested for main living room breaker.",
    bookings: [
      {
        orderNumber: "ORD-98920",
        serviceTitle: "Electrical Circuit & Switchboard Repair",
        category: "Electrical",
        date: "2026-10-03",
        amount: 55,
        status: "PENDING",
      },
    ],
  },
  {
    id: "cust-005",
    name: "Arif Mahmud",
    email: "arif.mahmud@bdtech.com",
    phone: "+880 1715-998877",
    address: "House 7, Road 5, Block C, Bashundhara R/A, Dhaka",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    joinedDate: "Nov 2025",
    totalBookings: 5,
    totalSpent: 290,
    lastService: "AC Deep Foam Cleaning & Coil Check",
    lastServiceDate: "2026-09-25",
    status: "Repeat Client",
    notes: "Regular commercial office maintenance client. Requires invoice copy for company records.",
    bookings: [
      {
        orderNumber: "ORD-97100",
        serviceTitle: "AC Deep Foam Cleaning & Coil Check",
        category: "Appliances",
        date: "2026-09-25",
        amount: 60,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-95430",
        serviceTitle: "Comprehensive AC Gas Leak Repair",
        category: "Appliances",
        date: "2026-08-04",
        amount: 80,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-93210",
        serviceTitle: "Circuit Breaker Diagnostic",
        category: "Electrical",
        date: "2026-06-18",
        amount: 50,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-91040",
        serviceTitle: "Air Quality Filter Replacement",
        category: "Appliances",
        date: "2026-04-12",
        amount: 60,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-89200",
        serviceTitle: "Preventative Maintenance Check",
        category: "Appliances",
        date: "2026-02-19",
        amount: 40,
        status: "COMPLETED",
      },
    ],
  },
  {
    id: "cust-006",
    name: "Farhana Akter",
    email: "farhana.akter@gmail.com",
    phone: "+880 1518-654321",
    address: "Suite 402, Rosewood Tower, Mirpur DOHS, Dhaka",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    joinedDate: "Jul 2026",
    totalBookings: 2,
    totalSpent: 110,
    lastService: "Kitchen Water Purifier Installation",
    lastServiceDate: "2026-09-18",
    status: "Active Client",
    notes: "Available on weekends only. Flexible with appointment time.",
    bookings: [
      {
        orderNumber: "ORD-96840",
        serviceTitle: "Kitchen Water Purifier Installation",
        category: "Appliances",
        date: "2026-09-18",
        amount: 50,
        status: "COMPLETED",
      },
      {
        orderNumber: "ORD-95200",
        serviceTitle: "Bathroom Plumbing Fixture Upgrade",
        category: "Plumbing",
        date: "2026-07-30",
        amount: 60,
        status: "COMPLETED",
      },
    ],
  },
];

type ClientFilter = "ALL" | "Repeat Client" | "Active Client" | "New Client";
type SortOption = "highest-spend" | "most-bookings" | "recently-active" | "name-asc";

export default function ProviderCustomers() {
  const [customers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ClientFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("highest-spend");

  // Selected customer for modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Compute lifetime metrics across all customers
  const totalClients = customers.length;
  const repeatClients = customers.filter((c) => c.status === "Repeat Client").length;
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
          customer.phone.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.address.toLowerCase().includes(query) ||
          customer.lastService.toLowerCase().includes(query) ||
          customer.bookings.some((b) => b.orderNumber.toLowerCase().includes(query));

        const matchesFilter = filterStatus === "ALL" || customer.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "highest-spend") return b.totalSpent - a.totalSpent;
        if (sortBy === "most-bookings") return b.totalBookings - a.totalBookings;
        if (sortBy === "recently-active") {
          return new Date(b.lastServiceDate).getTime() - new Date(a.lastServiceDate).getTime();
        }
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, searchQuery, filterStatus, sortBy]);

  const getClientBadgeClass = (status: CustomerRecord["status"]) => {
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
              Customers who have booked your services, their order histories, and lifetime stats.
            </p>
          </div>
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
                  ({Math.round((repeatClients / totalClients) * 100)}%)
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
                Customer Spend
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
                placeholder="Search by client name, phone, address, or service..."
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
                    { key: "Repeat Client", label: "Repeat", count: repeatClients },
                    {
                      key: "Active Client",
                      label: "Active",
                      count: customers.filter((c) => c.status === "Active Client").length,
                    },
                    {
                      key: "New Client",
                      label: "New",
                      count: customers.filter((c) => c.status === "New Client").length,
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

        {/* Minimal Customer List */}
        {filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                No customers found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No client records match your current filter or search criteria.
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
                      {customer.avatar && (
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left truncate"
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
                          href={`tel:${customer.phone}`}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <Phone className="h-3 w-3 text-primary shrink-0" />
                          <span>{customer.phone}</span>
                        </a>
                        <span className="hidden sm:inline">•</span>
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-1 hover:text-foreground transition-colors truncate max-w-[200px]"
                        >
                          <Mail className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
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
                      {/* Call button */}
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

                      {/* Eye Details button: Opens Modal */}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
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

      {/* Customer Details Modal Dialog */}
      <PCustomerDetails
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  );
}
