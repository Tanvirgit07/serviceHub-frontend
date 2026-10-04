import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { PlusCircle, LayoutDashboard, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />

      {/* Provider Sub-navigation Bar */}
      <div className="border-b border-border/60 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex flex-wrap items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              PRO
            </span>
            <span className="text-sm font-bold text-foreground">
              Provider Management
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <Link href="/provider/services">
                <ListOrdered className="h-3.5 w-3.5" />
                My Services
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <Link href="/provider/dashboard">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 gap-1.5 text-xs">
              <Link href="/provider/services/create">
                <PlusCircle className="h-3.5 w-3.5" />
                Add New Service
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

