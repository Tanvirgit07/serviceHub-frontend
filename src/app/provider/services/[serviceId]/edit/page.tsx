"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CATEGORIES,
  Service,
  getStoredServiceById,
  updateStoredService,
  INITIAL_SERVICES,
} from "@/data/servicesData";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.serviceId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Appliances");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [features, setFeatures] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceId) {
      const found =
        getStoredServiceById(serviceId) ||
        INITIAL_SERVICES.find((s) => s.id === serviceId) ||
        null;

      if (found) {
        setService(found);
        setTitle(found.title);
        setCategory(found.category);
        setPrice(String(found.price));
        setDuration(found.duration);
        setImageUrl(found.imageUrl);
        setDescription(found.description);
        setInclusions(found.inclusions.join(", "));
        setExclusions(found.exclusions.join(", "));
        setFeatures(found.features.join(", "));
      }
      setIsLoading(false);
    }
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Service Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The service you are trying to edit does not exist.
        </p>
        <Button asChild>
          <Link href="/provider/services">Return to Services</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = updateStoredService(service.id, {
        title: title.trim(),
        category,
        price: Number(price),
        duration: duration.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        features: features.split(",").map((s) => s.trim()).filter(Boolean),
        inclusions: inclusions.split(",").map((s) => s.trim()).filter(Boolean),
        exclusions: exclusions.split(",").map((s) => s.trim()).filter(Boolean),
      });

      if (updated) {
        toast.success(`"${updated.title}" updated successfully!`);
        router.push("/provider/services");
      } else {
        toast.error("Failed to update service.");
      }
    } catch {
      toast.error("An error occurred while updating the service.");
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

          <span className="text-xs text-muted-foreground">
            Editing ID: {service.id}
          </span>
        </div>

        {/* Form Container Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-9 shadow-sm space-y-8">
          
          <div className="border-b border-border/60 pb-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Edit Offering</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Update Service Details
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Modify rates, service descriptions, photo URLs, or inclusions.
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
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="h-11 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Detailed Description *
              </label>
              <textarea
                rows={4}
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
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
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
