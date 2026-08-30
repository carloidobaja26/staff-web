import type { ComponentType } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  UserRound,
  Wallet,
  Building2,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigation: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Workforce",
    items: [
      {
        label: "Workers",
        href: "/workers",
        icon: Users,
      },
      {
        label: "Agencies",
        href: "/agencies",
        icon: Building2,
      },
      {
        label: "Clients",
        href: "/clients",
        icon: UserRound,
      },
      {
        label: "Venues",
        href: "/venues",
        icon: MapPin,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Events",
        href: "/events",
        icon: CalendarDays,
      },
      {
        label: "Shifts",
        href: "/shifts",
        icon: ClipboardCheck,
      },
      {
        label: "Bookings",
        href: "/bookings",
        icon: ClipboardCheck,
      },
      {
        label: "Attendance",
        href: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Payroll",
        href: "/payroll",
        icon: Wallet,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];