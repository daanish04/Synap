import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="h-10 w-10" />
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
