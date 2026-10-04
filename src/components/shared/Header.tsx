"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  User,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
  PanelLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./Sidebar";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  icon: React.ElementType;
  read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New booking request #ORD-98421 received for AC Servicing",
    time: "10m ago",
    icon: Calendar,
    read: false,
  },
  {
    id: "2",
    title: "Customer Sarah K. left a 5-star review on Home Deep Cleaning",
    time: "1h ago",
    icon: Sparkles,
    read: false,
  },
  {
    id: "3",
    title: "Weekly payout of $280.00 has been transferred",
    time: "1d ago",
    icon: DollarSign,
    read: true,
  },
];

interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onToggleSidebar?: () => void;
  showSearch?: boolean;
}

export default function Header({
  title = "Provider Portal",
  subtitle,
  className = "",
  onToggleSidebar,
  showSearch = true,
}: HeaderProps) {
  const { data: session } = useSession();
  const sidebarContext = useSidebar();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      // If on mobile, toggle mobile drawer; on desktop toggle collapse
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        sidebarContext.toggleMobileOpen();
      } else {
        sidebarContext.toggleCollapse();
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PR";

  return (
    <header
      className={`sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 ${className}`}
    >
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4 hidden md:block" />
          <Menu className="h-5 w-5 block md:hidden" />
        </Button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Middle: Quick Search Bar */}
      {showSearch && (
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services, bookings, clients..."
              className="w-full h-9 rounded-xl border border-border/70 bg-muted/40 pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      )}

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Browse Public Market Link */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex h-8 gap-1.5 text-xs rounded-lg border-border/80"
        >
          <Link href="/services">
            <span>Marketplace</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </Link>
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </Button>

          {/* Notifications Dropdown Card */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-border bg-card p-3 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-2 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 rounded-xl p-2.5 text-xs transition-colors ${
                        notif.read
                          ? "hover:bg-muted/40 text-muted-foreground"
                          : "bg-muted/30 hover:bg-muted/60 text-foreground font-medium"
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 space-y-0.5 overflow-hidden">
                        <p className="line-clamp-2 leading-relaxed text-xs">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {notif.time}
                        </span>
                      </div>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border/60 pt-2 mt-2 text-center">
                <Link
                  href="/account/my-orders"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-muted/60 transition-colors focus:outline-none"
          >
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                {user?.name || "Partner"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Verified Pro
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden xl:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border/60 mb-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.name || "Service Partner"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || "partner@servicehub.com"}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Service Provider</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/provider/p_profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors font-medium"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Provider Profile</span>
                </Link>

                <Link
                  href="/account/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors font-medium"
                >
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors font-medium"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Public Website</span>
                </Link>
              </div>

              <div className="border-t border-border/60 mt-1 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
