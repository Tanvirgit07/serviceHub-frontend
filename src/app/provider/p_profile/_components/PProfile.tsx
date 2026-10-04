"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Briefcase,
  Camera,
  Save,
  Loader2,
  Plus,
  X,
  CreditCard,
  KeyRound,
  Bell,
  Eye,
  Sparkles,
  Award,
  Calendar,
  Check,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export interface ProviderProfileData {
  // Basic & Business Info
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  category: string;
  experienceYears: number;
  avatarUrl: string;
  coverUrl: string;
  bio: string;

  // Location & Coverage
  address: string;
  city: string;
  serviceAreas: string[];

  // Business Hours & Availability
  workingDays: string;
  workingHours: string;
  isAcceptingOrders: boolean;

  // Verification & Credentials
  nidNumber: string;
  tradeLicense: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  completedJobs: number;

  // Payout & Banking
  payoutMethod: "bank" | "bkash" | "nagad";
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  routingNumber: string;

  // Notification Preferences
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappAlerts: boolean;
}

const STORAGE_KEY = "servicehub_provider_profile_v1";

const DEFAULT_PROVIDER_PROFILE: ProviderProfileData = {
  businessName: "Tanvir Cooling & Appliance Solutions",
  ownerName: "Tanvir Ahmed",
  email: "tanvir.cooling@servicehub.com",
  phone: "+880 1812-345678",
  whatsapp: "+880 1712-345678",
  category: "Appliances",
  experienceYears: 6,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  coverUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
  bio: "Premier heating, ventilation, air conditioning (HVAC) and home appliance repair specialist in Dhaka. Providing professional AC jet wash servicing, gas refills, compressor replacements, and electronic diagnostics with 100% genuine parts warranty.",
  address: "House 42, Road 11, Block D, Banani, Dhaka - 1213",
  city: "Dhaka",
  serviceAreas: [
    "Banani",
    "Gulshan 1 & 2",
    "Uttara",
    "Dhanmondi",
    "Bashundhara R/A",
    "Mohakhali",
    "Baridhara DOHS",
  ],
  workingDays: "Saturday - Thursday",
  workingHours: "09:00 AM - 08:00 PM",
  isAcceptingOrders: true,
  nidNumber: "5912-8841-92301",
  tradeLicense: "TRAD/DNCC/049120/2023",
  isVerified: true,
  rating: 4.9,
  totalReviews: 320,
  completedJobs: 580,
  payoutMethod: "bank",
  bankName: "City Bank Limited",
  accountName: "Tanvir Ahmed",
  accountNumber: "2104-5891-2300-1",
  branchName: "Gulshan Avenue Branch",
  routingNumber: "225271890",
  emailNotifications: true,
  smsNotifications: true,
  whatsappAlerts: true,
};

const CATEGORY_OPTIONS = [
  "Appliances",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Shifting",
];

export default function PProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProviderProfileData>(DEFAULT_PROVIDER_PROFILE);
  const [activeTab, setActiveTab] = useState<"business" | "contact" | "payout" | "security">("business");
  const [isSaving, setIsSaving] = useState(false);
  const [newAreaInput, setNewAreaInput] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load stored profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      } else if (session?.user) {
        setProfile((prev) => ({
          ...prev,
          ownerName: session.user.name || prev.ownerName,
          email: session.user.email || prev.email,
        }));
      }
    } catch {
      // Fallback to default
    }
  }, [session]);

  const handleInputChange = <K extends keyof ProviderProfileData>(
    field: K,
    value: ProviderProfileData[K]
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddArea = () => {
    const trimmed = newAreaInput.trim();
    if (!trimmed) return;
    if (profile.serviceAreas.includes(trimmed)) {
      toast.error("This area is already in your service list.");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, trimmed],
    }));
    setNewAreaInput("");
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((area) => area !== areaToRemove),
    }));
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Provider profile updated successfully!");
      }, 500);
    } catch {
      setIsSaving(false);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    }, 600);
  };

  const initials = profile.ownerName
    ? profile.ownerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PR";

  return (
    <div className="p-6 space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Provider Profile
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Business
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your business identity, service coverage areas, operating hours, and payout details.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs rounded-xl gap-1.5 shadow-2xs"
            >
              <Link href="/services" target="_blank">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>View Marketplace</span>
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={() => handleSaveProfile()}
              disabled={isSaving}
              className="text-xs rounded-xl gap-1.5 shadow-xs font-semibold"
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

        {/* Hero Card with Cover & Avatar */}
        <div className="rounded-3xl border border-border/70 bg-card overflow-hidden shadow-2xs">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-52 w-full bg-muted/40">
            {profile.coverUrl ? (
              <Image
                src={profile.coverUrl}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-primary/20 via-primary/10 to-muted" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            
            {/* Quick Availability Badge */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() =>
                  handleInputChange("isAcceptingOrders", !profile.isAcceptingOrders)
                }
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md transition-all shadow-sm ${
                  profile.isAcceptingOrders
                    ? "bg-emerald-500/90 text-white"
                    : "bg-muted/90 text-muted-foreground"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    profile.isAcceptingOrders ? "bg-white animate-pulse" : "bg-muted-foreground"
                  }`}
                />
                <span>
                  {profile.isAcceptingOrders ? "Accepting Orders" : "Orders Paused"}
                </span>
              </button>
            </div>
          </div>

          {/* Profile Overview Strip */}
          <div className="p-5 sm:p-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
              {/* Avatar + Main Identity */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-card rounded-2xl shadow-md">
                    {profile.avatarUrl && (
                      <AvatarImage src={profile.avatarUrl} alt={profile.businessName} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform"
                    title="Change Profile Photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          handleInputChange("avatarUrl", url);
                          toast.success("Avatar image updated!");
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">
                      {profile.businessName}
                    </h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                      {profile.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-semibold text-foreground">{profile.ownerName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {profile.city}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Sparkles className="h-3 w-3" />
                      {profile.experienceYears}+ Yrs Experience
                    </span>
                  </p>
                </div>
              </div>

              {/* Performance Metrics Badges */}
              <div className="flex items-center gap-3 bg-muted/30 border border-border/70 rounded-2xl p-2.5 sm:px-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm sm:text-base">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{profile.rating}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    {profile.totalReviews} Reviews
                  </span>
                </div>

                <div className="h-7 w-px bg-border/80" />

                <div className="text-center">
                  <span className="text-sm sm:text-base font-extrabold text-foreground block">
                    {profile.completedJobs}+
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Jobs Done
                  </span>
                </div>

                <div className="h-7 w-px bg-border/80" />

                <div className="text-center">
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">
                    100%
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-t border-border/60 pt-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("business")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeTab === "business"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Business Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("contact")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeTab === "contact"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Locations & Hours</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("payout")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeTab === "payout"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Payout & Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeTab === "security"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Credentials & Security</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Business Details Form */}
        {activeTab === "business" && (
          <form
            onSubmit={(e) => handleSaveProfile(e)}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-6"
          >
            <div className="space-y-1 border-b border-border/60 pb-4">
              <h3 className="text-base font-bold text-foreground">
                Business Identity & Overview
              </h3>
              <p className="text-xs text-muted-foreground">
                This information is displayed publicly on your service listings and provider card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Business / Company Name</span>
                </label>
                <Input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="e.g. Tanvir Cooling & Appliance Care"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Owner / Contact Person */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Owner / Representative Name</span>
                </label>
                <Input
                  type="text"
                  value={profile.ownerName}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Primary Trade / Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  <span>Primary Service Category</span>
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs sm:text-sm font-medium focus:ring-1 focus:ring-primary outline-hidden"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience in Years */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  <span>Experience (Years in Business)</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={profile.experienceYears}
                  onChange={(e) =>
                    handleInputChange("experienceYears", parseInt(e.target.value) || 0)
                  }
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  <span>Logo / Avatar Image URL</span>
                </label>
                <Input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Cover Photo URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  <span>Banner / Cover Photo URL</span>
                </label>
                <Input
                  type="url"
                  value={profile.coverUrl}
                  onChange={(e) => handleInputChange("coverUrl", e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Business Bio / Description */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span>Professional Bio & Service Standards</span>
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Describe your expertise, certifications, guarantee, and commitment to quality..."
                className="w-full p-3 rounded-2xl border border-input bg-background text-xs sm:text-sm leading-relaxed focus:ring-1 focus:ring-primary outline-hidden"
              />
              <span className="text-[11px] text-muted-foreground block text-right">
                {profile.bio.length} characters
              </span>
            </div>

            {/* Form Footer */}
            <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs rounded-xl font-semibold gap-1.5 h-9"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Business Details</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Locations & Service Hours */}
        {activeTab === "contact" && (
          <form
            onSubmit={(e) => handleSaveProfile(e)}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-6"
          >
            <div className="space-y-1 border-b border-border/60 pb-4">
              <h3 className="text-base font-bold text-foreground">
                Contact, Location & Operating Hours
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure your dispatch address, customer phone numbers, and active service zones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Primary Phone */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Primary Business Phone</span>
                </label>
                <Input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+880 1812-345678"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  <span>WhatsApp / Direct Support Hotline</span>
                </label>
                <Input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="+880 1712-345678"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Business Email */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Official Business Email</span>
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@example.com"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>Primary City / Division</span>
                </label>
                <Input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g. Dhaka"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Full Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>Workshop / Physical Office Address</span>
                </label>
                <Input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="House #, Road #, Area, City"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Operating Days */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Working Days</span>
                </label>
                <Input
                  type="text"
                  value={profile.workingDays}
                  onChange={(e) => handleInputChange("workingDays", e.target.value)}
                  placeholder="e.g. Saturday - Thursday"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Operating Hours */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Working Hours</span>
                </label>
                <Input
                  type="text"
                  value={profile.workingHours}
                  onChange={(e) => handleInputChange("workingHours", e.target.value)}
                  placeholder="e.g. 09:00 AM - 08:00 PM"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Service Coverage Areas Pill Tags */}
            <div className="space-y-3 border-t border-border/60 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground">
                    Service Coverage Areas ({profile.serviceAreas.length})
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Areas and neighborhoods where your technicians provide on-site services.
                  </p>
                </div>
              </div>

              {/* Add New Area Input */}
              <div className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  value={newAreaInput}
                  onChange={(e) => setNewAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddArea();
                    }
                  }}
                  placeholder="Type an area name (e.g. Mirpur DOHS) & press Add"
                  className="rounded-xl h-9 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddArea}
                  className="rounded-xl h-9 text-xs gap-1 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Area</span>
                </Button>
              </div>

              {/* Active Area Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold"
                  >
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(area)}
                      className="text-primary/70 hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
                      title={`Remove ${area}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Form Footer */}
            <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs rounded-xl font-semibold gap-1.5 h-9"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Locations & Hours</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Payout & Banking Details */}
        {activeTab === "payout" && (
          <form
            onSubmit={(e) => handleSaveProfile(e)}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-6"
          >
            <div className="space-y-1 border-b border-border/60 pb-4">
              <h3 className="text-base font-bold text-foreground">
                Payout & Settlement Accounts
              </h3>
              <p className="text-xs text-muted-foreground">
                All earnings from completed customer bookings are disbursed to your registered payout account.
              </p>
            </div>

            {/* Payout Method Selection */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-foreground">Preferred Payout Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "bank", label: "Direct Bank Transfer", desc: "Commercial Bank Account" },
                  { id: "bkash", label: "bKash Merchant / Personal", desc: "Instant MFS Payout" },
                  { id: "nagad", label: "Nagad Financial", desc: "Postal MFS Service" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      handleInputChange("payoutMethod", method.id as ProviderProfileData["payoutMethod"])
                    }
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      profile.payoutMethod === method.id
                        ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary"
                        : "border-border/70 bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground text-xs">{method.label}</span>
                      {profile.payoutMethod === method.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{method.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Form Fields */}
            {profile.payoutMethod === "bank" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Bank Name</label>
                  <Input
                    type="text"
                    value={profile.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    placeholder="e.g. City Bank Limited, BRAC Bank"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Account Holder Name</label>
                  <Input
                    type="text"
                    value={profile.accountName}
                    onChange={(e) => handleInputChange("accountName", e.target.value)}
                    placeholder="Must match Trade License or NID name"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Account Number</label>
                  <Input
                    type="text"
                    value={profile.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="e.g. 2104-5891-2300-1"
                    className="rounded-xl h-10 text-xs sm:text-sm font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Branch Name</label>
                  <Input
                    type="text"
                    value={profile.branchName}
                    onChange={(e) => handleInputChange("branchName", e.target.value)}
                    placeholder="e.g. Gulshan Avenue Branch"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Routing Number</label>
                  <Input
                    type="text"
                    value={profile.routingNumber}
                    onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                    placeholder="9-digit routing code"
                    className="rounded-xl h-10 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    {profile.payoutMethod === "bkash" ? "bKash" : "Nagad"} Wallet Number
                  </label>
                  <Input
                    type="text"
                    value={profile.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="rounded-xl h-10 text-xs sm:text-sm font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Registered Account Name</label>
                  <Input
                    type="text"
                    value={profile.accountName}
                    onChange={(e) => handleInputChange("accountName", e.target.value)}
                    placeholder="Account owner full name"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Payout Security Notice */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-xs">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">Automated Weekly Settlements</span>
                <p className="text-muted-foreground leading-relaxed">
                  ServiceHub disburses your earnings every Tuesday and Thursday directly to your chosen payout method with zero withdrawal fee.
                </p>
              </div>
            </div>

            {/* Form Footer */}
            <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs rounded-xl font-semibold gap-1.5 h-9"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Payout Settings</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Credentials, Security & Alerts */}
        {activeTab === "security" && (
          <div className="space-y-6">
            
            {/* Government ID & Trade License Verification Card */}
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-5">
              <div className="space-y-1 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Legal Credentials & Verification Badges
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Verified providers receive 4x more customer bookings and top placement in search.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>National ID Card (NID)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Approved
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={profile.nidNumber}
                    onChange={(e) => handleInputChange("nidNumber", e.target.value)}
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Verified by Election Commission BD database.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      <span>City Corporation Trade License</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={profile.tradeLicense}
                    onChange={(e) => handleInputChange("tradeLicense", e.target.value)}
                    className="rounded-xl h-9 text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Valid trade permit for commercial appliances & repair services.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-5">
              <div className="space-y-1 border-b border-border/60 pb-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span>Order Alert Channels</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Choose how you want to be notified when a new customer books your services.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    key: "whatsappAlerts" as const,
                    title: "WhatsApp Instant Alerts",
                    desc: "Receive real-time order bookings and customer notes straight to your WhatsApp hotline.",
                    enabled: profile.whatsappAlerts,
                  },
                  {
                    key: "smsNotifications" as const,
                    title: "SMS Notifications",
                    desc: "Get an instant SMS on your primary phone whenever a new job is confirmed or cancelled.",
                    enabled: profile.smsNotifications,
                  },
                  {
                    key: "emailNotifications" as const,
                    title: "Email Summaries & Invoices",
                    desc: "Receive comprehensive order receipts, customer ratings, and weekly payout statements.",
                    enabled: profile.emailNotifications,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-muted/20"
                  >
                    <div className="space-y-0.5 pr-4">
                      <span className="font-bold text-foreground block">{item.title}</span>
                      <p className="text-muted-foreground text-[11px]">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInputChange(item.key, !item.enabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        item.enabled ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          item.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Account Password */}
            <form
              onSubmit={handleUpdatePassword}
              className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xs space-y-5"
            >
              <div className="space-y-1 border-b border-border/60 pb-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span>Change Password</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ensure your account is protected with a strong and secure password.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="text-xs rounded-xl font-semibold gap-1.5 h-9"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
