"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { navigation } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  collapsed?: boolean;
};

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r bg-background transition-[width] duration-200 md:flex md:flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center border-b",
          collapsed ? "justify-center px-2" : "justify-between px-6"
        )}
      >
        {!collapsed ? (
          <>
            <Link
              href="/dashboard"
              className="text-lg font-semibold tracking-tight"
            >
              StaffConnect
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="text-lg font-bold"
          >
            ABC
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-7">
          {navigation.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex h-9 items-center rounded-md text-sm transition-colors",
                        collapsed
                          ? "justify-center px-0"
                          : "gap-3 px-3",
                        isActive
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />

                      {!collapsed && (
                        <span>{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t p-3">
        <div
          className={cn(
            "flex items-center rounded-md py-2",
            collapsed
              ? "justify-center"
              : "gap-3 px-3"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            CB
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                Carlo Baja
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}