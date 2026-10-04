import React from "react";
import DashboardOverview from "./_components/DashboardOverview";

export const metadata = {
  title: "Provider Dashboard - ServiceHub",
  description: "Overview of services, bookings, ratings, and revenue",
};

export default function Page() {
  return <DashboardOverview />;
}
