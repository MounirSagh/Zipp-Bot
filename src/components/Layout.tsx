"use client";

import type React from "react";

import { AppSidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="flex-1 p-6 pt-6 bg-black min-h-screen">
          {children}
           <SpeedInsights />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
