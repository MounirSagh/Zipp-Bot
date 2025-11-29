import type React from "react";
import { AppSidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SidebarProvider>
        <AppSidebar className="mx-4 py-3" />
        <SidebarInset>
          <Navbar />
          <main className="p-6 min-h-screen w-full backdrop-blur-3xl bg-white">
            {children}
            <SpeedInsights />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
