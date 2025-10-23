"use client";

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Building,
  ClipboardList,
  HandHelping,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const mainNavItems = [
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/general",
    label: "General",
    icon: Home,
  },
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments",
    label: "Departments",
    icon: Building,
  },
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services",
    label: "Services",
    icon: HandHelping,
  },
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/common-issues",
    label: "Common Issues",
    icon: ClipboardList,
  },
];

function SidebarNavItem({
  path,
  label,
  icon: Icon,
}: {
  path: string;
  label: string;
  icon: React.ElementType;
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <NavLink to={path}>
          <Icon className="h-4 w-4" />
          <span className="text-xs">{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// Sidebar component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { signOut } = useClerk();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-black text-white">
        <div className="flex items-center justify-center gap-2 py-3">
          <div
            className={cn(
              "transition-opacity duration-200",
              state === "collapsed" && "opacity-0"
            )}
          >
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold text-white"  style={{ fontFamily: "'Major Mono Display', monospace" }}>
                ZIPP
              </h1>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 text-white">
              {mainNavItems.map((item) => (
                <SidebarNavItem key={item.path} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <Button onClick={() => signOut()} variant="outline" className="w-full text-black bg-white">
          Logout
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
