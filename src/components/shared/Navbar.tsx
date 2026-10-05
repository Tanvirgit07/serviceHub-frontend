"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  Wrench,
  Menu,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Sparkles,
  User,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const isProvider = user?.role?.toUpperCase() === "PROVIDER";

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Service<span className="text-primary font-extrabold">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth & Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isProvider ? (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href="/provider/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href="/provider/services/create">
                    <Sparkles className="h-4 w-4" />
                    Become a Provider
                  </Link>
                </Button>
              )}

              {/* User Avatar Popover */}
              <div
                ref={popoverRef}
                className="relative flex items-center border-l border-border pl-3"
              >
                <button
                  onClick={() => setPopoverOpen((prev) => !prev)}
                  className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Open user menu"
                  type="button"
                >
                  <Avatar className="h-8 w-8 border border-border cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage
                      src={user?.image || user?.profileImage || undefined}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(user?.name || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Panel */}
                {popoverOpen && (
                  <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-border bg-background shadow-lg py-1">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.name || "Welcome"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <Link
                      href="/account/profile"
                      onClick={() => setPopoverOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profile
                    </Link>

                    <Link
                      href="/account/my-orders"
                      onClick={() => setPopoverOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      My Orders
                    </Link>

                    <div className="border-t border-border mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPopoverOpen(false);
                          logout("/");
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/services">
                  Book a Service
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col justify-between p-6">
              <div className="space-y-6">
                {/* Mobile Drawer Header */}
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <span className="text-lg font-bold">
                        Service<span className="text-primary">Hub</span>
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Links */}
                <nav className="flex flex-col space-y-1 pt-4">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-muted font-semibold text-foreground"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Auth Bottom Section */}
              <div className="border-t border-border pt-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage
                          src={user?.image || user?.profileImage || undefined}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(user?.name || user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user?.name || "Welcome"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {isProvider && (
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                          <Link href="/provider/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            Provider Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                    )}

                    <SheetClose asChild>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href="/account/profile">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button asChild variant="ghost" className="w-full justify-start gap-2">
                        <Link href="/account/my-orders">
                          <ShoppingBag className="h-4 w-4" />
                          My Orders
                        </Link>
                      </Button>
                    </SheetClose>

                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                      onClick={() => logout("/")}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signin">Sign In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/services">Book a Service</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
