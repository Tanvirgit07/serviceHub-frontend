"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  Sparkles,
  Loader2,
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useCreateService } from "@/features/services/hook/useServices";

export default function CreateService() {
  const { mutate: createService, isPending } = useCreateService();

  // Exactly matching backend Service schema fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a service title.");
      return;
    }

    if (!price) {
      toast.error("Please set a price for the service.");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description for your service.");
      return;
    }

    createService({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      availability,
    });
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href="/provider/p_services">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Services
            </Link>
          </Button>

          <span className="text-xs font-medium text-muted-foreground">
            Provider Dashboard &bull; New Service
          </span>
        </div>

        {/* Responsive 2-Column Grid: Form (2 cols) + Live Preview (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="p-6 sm:p-7 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                      Create Service Offering
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-0.5 text-muted-foreground">
                      Fill in the essential details to publish your service on the marketplace.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-7">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Service Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        Service Title *
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        {title.length}/100
                      </span>
                    </div>
                    <Input
                      type="text"
                      maxLength={100}
                      placeholder="e.g. AC Deep Cleaning & Refrigerant Gas Refill"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-11 text-sm bg-background"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Use a descriptive and catchy title that clearly states the service provided.
                    </p>
                  </div>

                  {/* Price & Availability in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Price */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <label className="h-5 flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Rate / Price ($ USD) *</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-semibold text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="45.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          className="h-11 pl-8 text-sm bg-background font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        Base starting rate for customer bookings.
                      </p>
                    </div>

                    {/* Availability Status */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <label className="h-5 flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Listing Status</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 h-11">
                        <button
                          type="button"
                          onClick={() => setAvailability(true)}
                          className={`h-11 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all ${
                            availability
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs"
                              : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Active</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAvailability(false)}
                          className={`h-11 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all ${
                            !availability
                              ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold shadow-xs"
                              : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <XCircle className="h-3.5 w-3.5 text-amber-500" />
                          <span>Paused</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        {availability
                          ? "Visible for customer search & orders."
                          : "Hidden from customers until activated."}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      Service Description *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe what is included, technician experience, standard turnaround time, and safety measures..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Detailed descriptions help build trust and improve booking conversion rates.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                    <Button asChild variant="outline" type="button" className="h-10 px-5">
                      <Link href="/provider/p_services">Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="h-10 px-6 gap-2 font-medium"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4" />
                          Publish Service
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Customer Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span>Live Marketplace Preview</span>
              </div>

              {/* Preview Card */}
              <Card className="overflow-hidden border-border/80 shadow-sm transition-all bg-card">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-primary/10 via-muted to-muted/40 p-5 flex flex-col justify-between min-h-[110px] border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium border border-border/60 text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Service Card
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        availability
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          availability ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {availability ? "Available" : "Paused"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      ${price && !isNaN(Number(price)) ? Number(price).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2">
                    {title.trim() || "Your Service Title will appear here"}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {description.trim() ||
                      "Your service description will appear here as customers browse services on the marketplace..."}
                  </p>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Verified Provider
                    </span>
                    <span className="font-medium text-foreground">
                      Instant Booking
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Informational Hint */}
              <div className="rounded-xl border border-dashed border-border p-4 bg-muted/30 text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Provider Tip
                </p>
                <p className="text-[11px] leading-relaxed">
                  Clear titles and transparent rates get up to 3x more bookings. You can update availability or pricing anytime from your dashboard.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
