import React from "react";
import ProviderCustomers from "./_components/ProviderCustomers";

export const metadata = {
  title: "Customers - Provider Portal",
  description: "View and manage clients who booked your services.",
};

export default function ProviderCustomerPage() {
  return <ProviderCustomers />;
}
