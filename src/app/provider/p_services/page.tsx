import React from "react";
import PServicesList from "./_components/PServicesList";

export const metadata = {
  title: "My Services - Provider Portal",
  description: "Manage your active services, pricing, and availability.",
};

export default function ProviderServicesPage() {
  return <PServicesList />;
}
