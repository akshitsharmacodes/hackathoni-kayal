"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { BarChart3, Bell, List, Map, Moon, Smartphone, Sun } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV = [
  { href: "/dashboard", label: "Map", icon: Map },
  { href: "/dashboard/reports", label: "Reports", icon: List },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
] as const;

// D34: sidebar nav (Map · Reports · Alerts · Insights) + theme toggle (D35).
export function AppSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-5 pb-3">
        <Link href="/dashboard" className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-primary">കായൽ</span>
          <span className="text-sm font-medium text-muted-foreground">Kayal</span>
        </Link>
        <p className="text-xs text-muted-foreground">Panchayat console · Alappuzha</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={href === "/dashboard" ? pathname === href : pathname.startsWith(href)}
                    render={<Link href={href} />}
                    className="h-9 data-active:bg-sidebar-accent data-active:font-medium"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/report" target="_blank" />}>
              <Smartphone />
              <span>Open citizen app</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(dark ? "light" : "dark")}>
              {dark ? <Sun /> : <Moon />}
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
