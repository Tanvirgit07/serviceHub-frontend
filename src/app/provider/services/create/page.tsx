"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CATEGORIES,
  createStoredService,
} from "@/data/servicesData";

export default function CreateServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Appliances");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60 mins");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"
  );
  const [description, setDescription] = useState("");
  const [inclusions, setInclusions] = useState(
    "Full inspection, Standard labor, Post-service testing"
  );
  const [exclusions, setExclusions] = useState("Spare parts replacement");
  const [features, setFeatures] = useState(
    "Verified Technician, 30-Day Warranty, Guaranteed Quality"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newService = createStoredService({
        title: title.trim(),
        category,
        price: Number(price),
        duration: duration.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        availability: true,
        provider: {
          id: "pro-current",
          name: "My Business Services",
          avatar: "https://i.pravatar.cc/150?img=11",
          rating: 5.0,
          jobsCompleted: 1,
          phone: "+880 1234-567890",
          email: "provider@servicehub.com",
        },
        features: features.split(",").map((s) => s.trim()).filter(Boolean),
        inclusions: inclusions.split(",").map((s) => s.trim()).filter(Boolean),
        exclusions: exclusions.split(",").map((s) => s.trim()).filter(Boolean),
      });

      toast.success(`Service "${newService.title}" created successfully!`);
      router.push("/provider/services");
    } catch {
      toast.error("Failed to create service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
            <Link href="/provider/services">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Services
            </Link>
          </Button>

          <span className="text-xs text-muted-foreground">Step 1 of 1</span>
        </div>

        {/* Form Container Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-9 shadow-sm space-y-8">
          
          <div className="border-b border-border/60 pb-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>New Listing</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create a New Service Offering
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add your service details, rates, inclusions, and photos to start receiving customer bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Service Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. AC Master Servicing & Gas Refill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-11 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Price ($ USD) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="45"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="h-11 pl-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Estimated Duration *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 60-90 mins"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="h-11 text-sm"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Cover Photo URL
              </label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="h-11 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Provide a valid Unsplash or direct image link showcasing this service.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe what this service entails, steps performed, and value for the customer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  What is Included (comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="Jet chemical cleaning, Pressure test, Gas top-up"
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  What is Excluded (comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="Spare parts cost, Major civil modifications"
                  value={exclusions}
                  onChange={(e) => setExclusions(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Service Highlights / Features */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Key Features & Guarantees (comma separated)
              </label>
              <Input
                type="text"
                placeholder="30-day warranty, Background verified pro, Rapid response"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="h-11 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
              <Button asChild variant="outline">
                <Link href="/provider/services">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-10 px-6 gap-2">
                {isSubmitting ? (
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

        </div>

      </div>
    </div>
  );
}
