"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  ArrowLeft,
 
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Service,
  getStoredServiceById,
  INITIAL_SERVICES,
} from "@/data/servicesData";

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("10:00 AM - 12:00 PM");
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (serviceId) {
      const found =
        getStoredServiceById(serviceId) ||
        INITIAL_SERVICES.find((s) => s.id === serviceId) ||
        null;
      setService(found);
    }
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">Service Not Found</h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-sm">
          The service you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/services">Browse All Services</Link>
        </Button>
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    toast.success(`Booking confirmed for ${service.title}!`);
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
          
          {/* Left Column: Details & Inclusions (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Featured Image Card */}
            <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur-md shadow-xs">
                  {service.category}
                </span>
              </div>

              {/* Bottom Info on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating.toFixed(1)}</span>
                    <span className="font-normal text-white/80">({service.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  Available Now
                </span>
              </div>
            </div>

            {/* Title & Overview */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {service.title}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              {/* Key Features Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What is Included & Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Inclusions */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <h3>What is Included</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  {service.inclusions.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <XCircle className="h-4 w-4" />
                  <h3>What is Excluded</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  {service.exclusions.map((exc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Service Provider Info Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                About the Service Provider
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                    <AvatarFallback className="font-bold text-sm">
                      {getInitials(service.provider.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      {service.provider.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1 text-foreground font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {service.provider.rating} Rating
                      </span>
                      <span>•</span>
                      <span>{service.provider.jobsCompleted}+ Jobs Done</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-muted-foreground space-y-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {service.provider.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {service.provider.email}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
              
              <div className="flex items-baseline justify-between border-b border-border/60 pb-4">
                <div>
                  <span className="text-xs text-muted-foreground">Standard Service Fee</span>
                  <div className="text-3xl font-extrabold text-foreground">
                    ${service.price}
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  Fixed Pricing
                </span>
              </div>

              {isBooked ? (
                /* Success Booking Alert */
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Booking Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    A service technician from <strong>{service.provider.name}</strong> will contact you on {selectedDate} at {selectedTime}.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBooked(false)}
                    className="w-full mt-2 text-xs"
                  >
                    Book Another Slot
                  </Button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Select Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Select Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Select Time Slot */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Preferred Time Slot
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Service Charge</span>
                      <span className="font-semibold text-foreground">${service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & Inspection</span>
                      <span className="font-semibold text-foreground">$5</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/40 text-sm font-bold text-foreground">
                      <span>Total Estimated Cost</span>
                      <span>${service.price + 5}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 text-sm font-semibold shadow-xs">
                    Book Service Now
                  </Button>
                </form>
              )}

              {/* Trust Features */}
              <div className="pt-4 border-t border-border/50 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Satisfaction & 30-Day Service Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>Free cancellation up to 2 hours before scheduled slot</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
