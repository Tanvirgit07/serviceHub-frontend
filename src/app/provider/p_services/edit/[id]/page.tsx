import React from "react";
import EditService from "../../_components/EditService";

export const metadata = {
  title: "Edit Service - Provider Portal",
  description: "Update rates, description, inclusions, and photos for your service listing",
};

export default function Page({ params }: { params: { id: string } }) {
  return <EditService serviceId={params.id} />;
}
