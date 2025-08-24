import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <SidebarTrigger className="h-12 w-12" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
