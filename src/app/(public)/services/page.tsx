import React, { Suspense } from "react";
import ServiceList from "./_components/ServiceList";

export const metadata = {
  title: "Services - ServiceHub",
  description: "Browse, search, and book verified local services on ServiceHub",
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">Loading services...</p>
        </div>
      }
    >
      <ServiceList />
    </Suspense>
  );
}
