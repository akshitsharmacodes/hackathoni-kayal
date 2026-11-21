"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { BarChart3, Bell, Home, List, Map, Moon, Smartphone, Sun } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
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
  SidebarRail,
} from "@/components/ui/sidebar";

const NAV = [
  { href: "/dashboard", label: "Map", icon: Map },
  { href: "/dashboard/reports", label: "Reports", icon: List },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
] as const;

// D34 + 22 Nov: collapses to an icon rail (Ctrl/Cmd+B or the trigger); state is remembered by the sidebar cookie.
export function AppSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link href="/" aria-label="Kayal home" className="flex items-center gap-2 rounded-lg p-1">
          <span className="group-data-[collapsible=icon]:hidden">
            <Logo tagline markClassName="size-9" />
          </span>
          <LogoMark className="hidden size-8 group-data-[collapsible=icon]:block" />
        </Link>
        <p className="px-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Panchayat console · Alappuzha</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    tooltip={label}
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
        <SidebarGroup>
          <SidebarGroupLabel>Go to</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Home" render={<Link href="/" />} className="h-9">
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Citizen app" render={<Link href="/report" target="_blank" />} className="h-9">
                  <Smartphone />
                  <span>Citizen app</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={dark ? "Light mode" : "Dark mode"} onClick={() => setTheme(dark ? "light" : "dark")}>
              <Moon className="dark:hidden" />
              <Sun className="hidden dark:block" />
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
