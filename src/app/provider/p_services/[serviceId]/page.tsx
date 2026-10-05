import React from "react";
import ServiceDetails from "../_components/ServiceDetails";

export const metadata = {
  title: "Service Details - Provider Portal",
  description: "View and manage service performance, inclusions, and settings.",
};

export default function Page({ params }: { params: { serviceId: string } }) {
  return <ServiceDetails serviceId={params.serviceId} />;
}
