import React from "react";
import POrderDetails from "../_components/POrderDetails";

export const metadata = {
  title: "Booking Details - Provider Portal",
  description: "View customer details, appointment schedule, and manage order execution status",
};

export default function Page({ params }: { params: { orderId: string } }) {
  return <POrderDetails orderId={params.orderId} />;
}
