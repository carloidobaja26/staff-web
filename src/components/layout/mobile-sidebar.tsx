"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="size-5" />

          <span className="sr-only">
            Open navigation
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/dashboard"
              className="text-lg font-semibold tracking-tight"
            >
              StaffConnect
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <div className="space-y-7">
              {navigation.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(
                          `${item.href}/`
                        );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                            isActive
                              ? "bg-accent font-medium text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                          )}
                        >
                          <Icon className="size-4 shrink-0" />

                          <span>
                            {item.label}
                          </span>
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
            <div className="flex items-center gap-3 rounded-md px-3 py-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                CB
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Carlo Baja
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}