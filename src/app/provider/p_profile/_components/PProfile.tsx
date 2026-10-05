"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Building2,
  Phone,
  MapPin,
  FileText,
  Save,
  Loader2,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Sparkles,
  ExternalLink,
  Briefcase,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  useMyBusinessProfile,
  useSaveBusinessProfile,
} from "@/features/provider-profile/hooks/useProviderProfile";

export default function PProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  // React Query hooks for real database BusinessProfile
  const {
    data: dbProfile,
    isLoading: isFetchingProfile,
    isError,
    error,
  } = useMyBusinessProfile();

  const { saveProfile, isPending: isSaving } = useSaveBusinessProfile();

  // Exactly matching backend BusinessProfile schema fields
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  // Populate form with real data from database once loaded
  useEffect(() => {
    if (dbProfile) {
      setBusinessName(dbProfile.businessName || "");
      setPhone(dbProfile.phone || "");
      setAddress(dbProfile.address || "");
      setDescription(dbProfile.description || "");
    }
  }, [dbProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      toast.error("Please enter your business name.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your business phone number.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your workshop or office address.");
      return;
    }

    saveProfile({
      businessName: businessName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      description: description.trim(),
    });
  };

  const ownerName = dbProfile?.account?.name || user?.name || "Provider";
  const ownerEmail = dbProfile?.account?.email || user?.email || "";

  const getInitials = (nameStr?: string | null) => {
    if (!nameStr) return "PR";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isFetchingProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Loading business profile...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Failed to Load Profile
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {error?.message || "Could not retrieve your business profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Business Profile
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Provider
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your verified business identity, customer contact phone, and workshop address.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs rounded-xl gap-1.5"
            >
              <Link href="/services" target="_blank">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>View Marketplace</span>
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSaving}
              className="text-xs rounded-xl gap-1.5 font-semibold shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Top Identity Banner Card */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-primary/10 via-muted/40 to-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-border shadow-sm">
                <AvatarImage src={user?.image || undefined} alt={ownerName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg sm:text-xl rounded-2xl">
                  {getInitials(businessName || ownerName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    {businessName || "Your Business Name"}
                  </h2>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    PROVIDER
                  </span>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Managed by <strong>{ownerName}</strong></span>
                  {ownerEmail && (
                    <>
                      <span>&bull;</span>
                      <span>{ownerEmail}</span>
                    </>
                  )}
                </p>

                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{address || "Address not provided yet"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                  dbProfile
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{dbProfile ? "Profile Active" : "Incomplete Profile"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Form (Left 2 cols) + Preview/Details (Right 1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Business Details Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/80 shadow-xs rounded-3xl">
              <CardHeader className="p-6 sm:p-7 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                      Business Details
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Enter the verified information that will be visible to clients and on invoices.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-7 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="businessName"
                      className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                    >
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      <span>Business / Company Name</span>
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="e.g. Tanvir Cooling & Appliance Care"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-10 rounded-xl text-xs sm:text-sm"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">
                      This trade name appears on your public service cards and client invoices.
                    </p>
                  </div>

                  {/* Phone & Address in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                      >
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>Business Contact Phone</span>
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="e.g. +880 1812-345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Phone number used by customers to coordinate booked appointments.
                      </p>
                    </div>

                    {/* Workshop / Office Address */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="address"
                        className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                      >
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>Workshop / Office Address</span>
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Physical location from where your service technicians dispatch.
                      </p>
                    </div>
                  </div>

                  {/* Description / Bio */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="description"
                      className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>About Your Business & Services (Optional)</span>
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      placeholder="Describe your technical background, specialty services, quality guarantee, and work ethics..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-2xl border border-input bg-background p-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Detailed descriptions help build customer trust.</span>
                      <span>{description.length} characters</span>
                    </div>
                  </div>

                  {/* Form Submission Button */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="h-10 px-6 rounded-xl font-semibold text-xs sm:text-sm gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Business Profile</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Marketplace Preview & Account Details */}
          <div className="space-y-6">
            {/* Live Card Preview */}
            <Card className="border-border/80 shadow-xs rounded-3xl overflow-hidden">
              <CardHeader className="p-5 border-b border-border/60 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-foreground">
                      Marketplace Preview
                    </CardTitle>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Live View
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Header Preview */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary font-bold text-base">
                    {getInitials(businessName || ownerName)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {businessName || "Your Business Name"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {ownerName}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 pt-2 border-t border-border/50 text-[11px]">
                  <div className="flex items-start gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">
                      {phone || "+880 1XXX-XXXXXX"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-snug">
                      {address || "Workshop address will appear here"}
                    </span>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="pt-2 border-t border-border/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    About
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {description ||
                      "No business bio added yet. Add a description to tell clients about your services."}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ServiceHub Quality Verified Partner</span>
                </div>
              </CardContent>
            </Card>

            {/* Account & Quick Navigation Card */}
            <Card className="border-border/80 shadow-xs rounded-3xl">
              <CardHeader className="p-5 border-b border-border/60">
                <CardTitle className="text-sm font-bold text-foreground">
                  Account Credentials
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Linked ServiceHub account credentials.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px]">
                    Account Name
                  </span>
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {ownerName}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px]">
                    Registered Email
                  </span>
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {ownerEmail}
                  </p>
                </div>

                {dbProfile?.createAt && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-[11px]">
                      Member Since
                    </span>
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(dbProfile.createAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-border/50">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs rounded-xl h-8 gap-1.5"
                  >
                    <Link href="/provider/p_services">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      <span>Manage Services</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
