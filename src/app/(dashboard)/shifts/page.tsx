"use client";

import { useState } from "react";
import {
    CalendarDays,
    List,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ShiftTable } from "@/components/shifts/shift-table";
import { ShiftCalendar } from "@/components/shifts/shift-calendar";

type ShiftView = "list" | "calendar";

export default function ShiftsPage() {
    const [view, setView] =
        useState<ShiftView>("list");

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Shifts
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage scheduled shifts and staffing requirements.
                    </p>
                </div>


                {/* View Toggle */}

                <div className="inline-flex w-fit rounded-lg border bg-muted/30 p-1">

                    <Button
                        type="button"
                        size="sm"
                        variant={
                            view === "list"
                                ? "default"
                                : "ghost"
                        }
                        onClick={() =>
                            setView("list")
                        }
                        className="gap-2"
                    >
                        <List className="size-4" />
                        List
                    </Button>


                    <Button
                        type="button"
                        size="sm"
                        variant={
                            view === "calendar"
                                ? "default"
                                : "ghost"
                        }
                        onClick={() =>
                            setView("calendar")
                        }
                        className="gap-2"
                    >
                        <CalendarDays className="size-4" />
                        Calendar
                    </Button>

                </div>

            </div>


            {/* View */}

            {view === "list" ? (
                <ShiftTable />
            ) : (
                <ShiftCalendar />
            )}

        </div>
    );
}
