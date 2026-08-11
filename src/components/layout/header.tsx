"use client";

import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

type HeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export function Header({
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Mobile */}
        <MobileSidebar />

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onToggleSidebar}
          title={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}

          <span className="sr-only">
            {sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"}
          </span>
        </Button>

        <div className="ml-1">
          <h1 className="text-sm font-semibold">
            Dashboard
          </h1>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Overview of your staffing operations
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="size-4" />

          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />

          <span className="sr-only">
            Notifications
          </span>
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}