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
  Ticket,
  Users,
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
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/customers",
    label: "Customers",
    icon: Users,
  },
  {
    path: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/tickets",
    label: "Tickets",
    icon: Ticket,
  }
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { signOut } = useClerk();
  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader className="border-b border-white/10 backdrop-blur-md text-white">
        <div className="flex items-center justify-center py-1.5">
          <div
            className={cn(
              "transition-opacity duration-200",
              state === "collapsed" && "opacity-0"
            )}
          >
            <div className="flex items-center gap-1">
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Major Mono Display', monospace" }}
              >
                Zipp
              </h1>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="backdrop-blur-3xl bg-gradient-to-b from- via-neutral-900 to-purple-950/15">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 text-white">
              {mainNavItems.map((item) => (
                <SidebarNavItem key={item.path} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" backdrop-blur-md  border-white/10 bg-purple-950/15">
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="w-full text-white backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          Logout
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
