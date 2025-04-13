"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  File,
  Folder,
  Frame,
  GalleryVerticalEnd,
  HandCoins,
  HelpCircle,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  TrendingUp,
} from "lucide-react";

import { NavMain } from "@/components/shared/nav-main";
import { NavProjects } from "@/components/shared/nav-projects";
import { NavUser } from "@/components/shared/nav-user";
import { TeamSwitcher } from "@/components/shared/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      // avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Transfer Book",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Transfer Book",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: t("sidebar.dashboard"),
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
        //   items: [
        //     {
        //       title: "History",
        //       url: "#",
        //     },
        //     {
        //       title: "Starred",
        //       url: "#",
        //     },
        //     {
        //       title: "Settings",
        //       url: "#",
        //     },
        //   ],
      },
    ],
    pages: [
      {
        name: t("sidebar.invoices"),
        url: "/dashboard/invoices",
        icon: Frame,
      },
      {
        name: t("sidebar.expenses"),
        url: "/dashboard/expenses",
        icon: PieChart,
      },
      {
        name: t("sidebar.gen-invoice"),
        url: "/dashboard/invoices/create",
        icon: Map,
      },
      {
        name: t("sidebar.dividends"),
        url: "/dashboard/dividends",
        icon: HandCoins,
      },
      {
        name: t("sidebar.revenue"),
        url: "/dashboard/revenue",
        icon: TrendingUp,
      },
      {
        name: t("sidebar.documents"),
        url: "/dashboard/documents",
        icon: File,
      },
      {
        name: t("sidebar.assets"),
        url: "/dashboard/assets",
        icon: Folder,
      },
      {
        name: t("sidebar.company-info"),
        url: "/dashboard/company-info",
        icon: Settings,
      },
      {
        name: t("sidebar.faq"),
        url: "/dashboard/faq",
        icon: HelpCircle,
      },
    ],
  };
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: user?.user_metadata?.name ?? "",
              logo: GalleryVerticalEnd,
              plan: user?.user_metadata?.name ?? "",
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.pages} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
