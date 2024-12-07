import React from "react";
import AppLayout from "../components/AppLayout";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout sidebarOnly>
      {children}
    </AppLayout>
  );
}
