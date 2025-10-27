import type React from "react";
import { AppSidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background - fixed to viewport */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Base gradient - neutral tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-500/15 to-blue-600/5  animate-gradient-slow"></div>
        
        {/* Animated gradient orbs - neutral tones */}
        <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-blue-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-blue-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        

      </div>  
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className="flex-1 p-6 pt-6 min-h-screen bg-transparent">
            {children}
            <SpeedInsights />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
