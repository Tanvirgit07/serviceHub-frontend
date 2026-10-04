import React from "react";
import Sidebar, { SidebarProvider } from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

export const metadata = {
  title: "Provider Dashboard - ServiceHub",
  description: "Manage your services, bookings, ratings, and customer requests.",
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-muted/20 text-foreground">
        {/* Left Sticky Desktop & Mobile Drawer Sidebar */}
        <Sidebar />

        {/* Right Content Area: Sticky Header + Page Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Header */}
          <Header
            title="Provider Portal"
            subtitle="Manage services, bookings & earnings"
          />

          {/* Dynamic Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
