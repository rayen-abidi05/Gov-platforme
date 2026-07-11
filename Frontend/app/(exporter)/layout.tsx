"use client";

import { useCompany } from "@/hooks/useCompany";

export default function ExporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isError } = useCompany();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load company.</div>;
  }

  return children;
}