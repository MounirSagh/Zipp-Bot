"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/clerk-react";
export function Navbar() {
  return (
    <header className="flex bg-neutral-800  backdrop-blur-md border-b border-white/10 text-white justify-between px-10 h-15 py-2 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="">
        <div className="lg:hidden">
          <SidebarTrigger className="-ml-1" />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <UserButton />
      </div>
    </header>
  );
}
