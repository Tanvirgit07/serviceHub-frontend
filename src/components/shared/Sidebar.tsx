"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  Wrench,
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  CalendarCheck,
  Users,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Context for sharing sidebar state between Sidebar and Header across the application
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

const defaultSidebarContext: SidebarContextType = {
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleCollapse: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  toggleMobileOpen: () => {},
  closeMobile: () => {},
};

export const SidebarContext = createContext<SidebarContextType>(defaultSidebarContext);

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("servicehub_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // LocalStorage access not available
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("servicehub_sidebar_collapsed", String(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const toggleMobileOpen = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleCollapse,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileOpen,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// Navigation structure
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/provider/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Services",
        href: "/provider/p_services",
        icon: ListOrdered,
      },
      {
        title: "Add Service",
        href: "/provider/p_services/create",
        icon: PlusCircle,
        badge: "New",
      },
      {
        title: "Bookings",
        href: "/provider/p_orders",
        icon: CalendarCheck,
      },
      {
        title: "Customers",
        href: "/provider/p_customer",
        icon: Users,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/provider/p_profile",
        icon: User,
      },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function Sidebar({
  collapsed: controlledCollapsed,
  onToggle: controlledOnToggle,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logout } = useLogout();
  const context = useSidebar();

  // Internal state fallback if used without Provider or controlled props
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Determine whether collapsed based on controlled prop -> Context -> internal state
  const isCollapsed =
    controlledCollapsed !== undefined
      ? controlledCollapsed
      : context !== defaultSidebarContext
      ? context.isCollapsed
      : internalCollapsed;

  const handleToggle = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else if (context !== defaultSidebarContext) {
      context.toggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const isMobileOpen = context.isMobileOpen;
  const closeMobile = context.closeMobile;

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PR";

  const renderNavContent = () => (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      {/* Top Header / Brand Logo */}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`flex h-16 shrink-0 items-center border-b border-border/60 transition-all duration-300 ${
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {/* Brand Logo & Name */}
          <Link
            href="/provider/dashboard"
            onClick={closeMobile}
            className={`flex items-center gap-2.5 transition-all overflow-hidden ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="ServiceHub Provider Portal"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Wrench className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">
                  Service<span className="text-primary font-extrabold">Hub</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <span>Provider</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button (When Expanded) */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobile}
            className="flex md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Collapsed Mode Expand Button */}
        {isCollapsed && (
          <div className="hidden md:flex shrink-0 justify-center py-2 border-b border-border/40">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-5 px-3 py-4">
          {SIDEBAR_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {/* Section Header */}
              {section.title && (
                <div className="px-2">
                  {isCollapsed ? (
                    <div className="my-2 border-t border-border/50" />
                  ) : (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                      {section.title}
                    </p>
                  )}
                </div>
              )}

              {/* Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/provider/dashboard" &&
                      item.href !== "/" &&
                      pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      title={isCollapsed ? item.title : undefined}
                      className={`group flex items-center rounded-xl text-xs font-medium transition-all ${
                        isCollapsed
                          ? "h-10 w-10 mx-auto justify-center"
                          : "h-9 px-3 gap-3"
                      } ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold uppercase ${
                                isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Card / Footer */}
      <div className="border-t border-border/60 p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/provider/p_profile"
              onClick={closeMobile}
              title={user?.name || "Provider Profile"}
              className="group block"
            >
              <Avatar className="h-9 w-9 border border-border group-hover:border-primary transition-colors">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout("/signin")}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5">
            <Link
              href="/provider/p_profile"
              onClick={closeMobile}
              className="flex items-center gap-2.5 overflow-hidden flex-1 group"
            >
              <Avatar className="h-9 w-9 border border-border group-hover:border-primary transition-colors shrink-0">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden text-left">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {user?.name || "Service Partner"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                  <Sparkles className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">Verified Partner</span>
                </div>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout("/signin")}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 ml-1"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border/60 bg-card transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 ${
          isCollapsed ? "w-[72px]" : "w-64"
        } ${className}`}
      >
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sliding Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl md:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderNavContent()}
      </div>
    </>
  );
}
