"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  KeyRound,
  Camera,
  CheckCircle2,
  Calendar,
  Save,
  Loader2,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Active Tab
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  // General Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [address, setAddress] = useState("Dhaka, Bangladesh");
  const [bio, setBio] = useState("ServiceHub customer seeking quality home services.");
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const getInitials = (nameStr?: string | null) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingGeneral(false);
      toast.success("Profile details updated successfully!");
    }, 600);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields.");
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
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-muted/20 py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Account Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Profile & Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile details, account security, and preferences.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: User Summary Card & Tabs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Avatar className="w-24 h-24 border-2 border-border shadow-sm">
                  <AvatarImage
                    src={user?.image || user?.profileImage || undefined}
                    alt={name || "User Avatar"}
                  />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {getInitials(name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  title="Change avatar"
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <h2 className="text-lg font-bold text-foreground truncate">
                {name || "User Profile"}
              </h2>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {email || "user@example.com"}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Account
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground uppercase">
                  {user?.role || "CUSTOMER"}
                </span>
              </div>

              <div className="mt-6 pt-5 border-t border-border/60 text-left space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Member Since
                  </span>
                  <span className="font-medium text-foreground">
                    {new Date().getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Account Security
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    High
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="rounded-2xl border border-border/80 bg-card p-2 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "general"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="h-4 w-4" />
                  Personal Information
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "security"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <KeyRound className="h-4 w-4" />
                  Security & Password
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-70" />
              </button>
            </div>

            {/* Quick Link Card for Providers */}
            {user?.role !== "PROVIDER" && (
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3>Offer Your Services</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you a skilled technician or cleaner? Earn money with ServiceHub.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full mt-2 text-xs">
                  <Link href="/provider/services/create">
                    Become a Service Partner
                  </Link>
                </Button>
              </div>
            )}

          </div>

          {/* Right Column: Settings Forms */}
          <div className="lg:col-span-8">
            
            {/* Tab 1: General Personal Information */}
            {activeTab === "general" && (
              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
                <div className="border-b border-border/60 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Personal Information
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your public profile and contact details.
                  </p>
                </div>

                <form onSubmit={handleSaveGeneral} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="fullName"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      >
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="fullName"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="h-11 pl-10 pr-4 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Email (Readonly) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="userEmail"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      >
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="userEmail"
                          type="email"
                          value={email}
                          disabled
                          placeholder="your.email@example.com"
                          className="h-11 pl-10 pr-4 text-sm bg-muted/40 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      >
                        Phone Number
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1234-567890"
                          className="h-11 pl-10 pr-4 text-sm"
                        />
                      </div>
                    </div>

                    {/* Address / Location */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="address"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      >
                        Location / City
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Dhaka, Bangladesh"
                          className="h-11 pl-10 pr-4 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio / About */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="bio"
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                    >
                      About / Notes
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Add a short note about your preferences..."
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isSavingGeneral}
                      className="h-10 px-5 gap-2 text-sm"
                    >
                      {isSavingGeneral ? (
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
            )}

            {/* Tab 2: Security & Password */}
            {activeTab === "security" && (
              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
                <div className="border-b border-border/60 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Security & Password
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage your password to ensure your account remains safe and protected.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="currentPass"
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                    >
                      Current Password
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="currentPass"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="h-11 pl-10 pr-4 text-sm"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="newPass"
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                    >
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="newPass"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="h-11 pl-10 pr-4 text-sm"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Must be at least 6 characters.
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPass"
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="confirmPass"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 pl-10 pr-4 text-sm"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="h-10 px-5 gap-2 text-sm"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
