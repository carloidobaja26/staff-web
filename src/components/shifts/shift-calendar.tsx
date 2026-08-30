"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";

import {
    useQuery,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    getShiftCalendar,
    ShiftStatus,
    type Shift,
} from "@/lib/api/shifts";

import {
    CURRENT_TENANT_ID,
} from "@/constants/tenant";


const statusLabels: Record<ShiftStatus, string> = {
    [ShiftStatus.Open]: "Open",
    [ShiftStatus.Filled]: "Filled",
    [ShiftStatus.InProgress]: "In Progress",
    [ShiftStatus.Completed]: "Completed",
    [ShiftStatus.Cancelled]: "Cancelled",
};


export function ShiftCalendar() {
    const today = new Date();

    const [currentDate, setCurrentDate] =
        useState(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );

    const [search, setSearch] =
        useState("");


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth() + 1;


    const {
        data: shifts = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: [
            "shift-calendar",
            CURRENT_TENANT_ID,
            year,
            month,
            search,
        ],

        queryFn: () =>
            getShiftCalendar(
                CURRENT_TENANT_ID,
                year,
                month,
                search
            ),
    });


    /*
     * Calendar days
     */

    const calendarDays = useMemo(() => {
        const firstDay = new Date(
            year,
            month - 1,
            1
        );

        const lastDay = new Date(
            year,
            month,
            0
        );

        const firstWeekday =
            firstDay.getDay();

        const daysInMonth =
            lastDay.getDate();

        const previousMonthDays =
            firstWeekday;

        const totalCells =
            Math.ceil(
                (
                    previousMonthDays +
                    daysInMonth
                ) / 7
            ) * 7;

        return Array.from(
            { length: totalCells },
            (_, index) => {
                const dayNumber =
                    index -
                    previousMonthDays +
                    1;

                const date = new Date(
                    year,
                    month - 1,
                    dayNumber
                );

                const isCurrentMonth =
                    date.getMonth() ===
                        month - 1;

                return {
                    date,
                    dayNumber:
                        date.getDate(),
                    isCurrentMonth,
                };
            }
        );
    }, [year, month]);


    /*
     * Group shifts by date
     */

    const shiftsByDate =
        useMemo(() => {
            const grouped =
                new Map<
                    string,
                    Shift[]
                >();

            shifts.forEach((shift) => {
                const date =
                    new Date(
                        shift.startDateTime
                    );

                const key =
                    formatDateKey(date);

                const existing =
                    grouped.get(key) ?? [];

                existing.push(shift);

                grouped.set(
                    key,
                    existing
                );
            });

            return grouped;
        }, [shifts]);


    /*
     * Month navigation
     */

    const previousMonth = () => {
        setCurrentDate(
            new Date(
                year,
                month - 2,
                1
            )
        );
    };


    const nextMonth = () => {
        setCurrentDate(
            new Date(
                year,
                month,
                1
            )
        );
    };


    const goToToday = () => {
        setCurrentDate(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );
    };


    /*
     * Loading
     */

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Loading shift calendar...
                </p>
            </div>
        );
    }


    /*
     * Error
     */

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                <p className="text-sm font-semibold text-destructive">
                    Failed to load shift calendar
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    Something went wrong while loading the shifts.
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => refetch()}
                >
                    Try Again
                </Button>

            </div>
        );
    }


    return (
        <div className="space-y-4">

            {/* Toolbar */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}

                <div className="relative w-full sm:max-w-sm">

                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search shifts..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        className="pl-9"
                    />

                </div>


                {/* Navigation */}

                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                    >
                        Today
                    </Button>


                    <Button
                        variant="outline"
                        size="icon"
                        onClick={previousMonth}
                    >
                        <ChevronLeft className="size-4" />

                        <span className="sr-only">
                            Previous month
                        </span>
                    </Button>


                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextMonth}
                    >
                        <ChevronRight className="size-4" />

                        <span className="sr-only">
                            Next month
                        </span>
                    </Button>

                </div>

            </div>


            {/* Month Header */}

            <div className="rounded-xl border bg-card">

                <div className="border-b px-4 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold">
                        {currentDate.toLocaleDateString(
                            undefined,
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {shifts.length}{" "}
                        {shifts.length === 1
                            ? "shift"
                            : "shifts"}{" "}
                        scheduled
                    </p>

                </div>


                {/* Weekdays */}

                <div className="grid grid-cols-7 border-b bg-muted/30">

                    {[
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                    ].map((day) => (
                        <div
                            key={day}
                            className="border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0 sm:text-sm"
                        >
                            {day}
                        </div>
                    ))}

                </div>


                {/* Calendar */}

                <div className="grid grid-cols-7">

                    {calendarDays.map(
                        ({
                            date,
                            dayNumber,
                            isCurrentMonth,
                        }) => {
                            const key =
                                formatDateKey(
                                    date
                                );

                            const dayShifts =
                                shiftsByDate.get(
                                    key
                                ) ?? [];

                            const isToday =
                                isSameDay(
                                    date,
                                    today
                                );

                            return (
                                <div
                                    key={key}
                                    className={`min-h-[120px] border-b border-r p-2 last:border-r-0 sm:min-h-[150px] ${
                                        !isCurrentMonth
                                            ? "bg-muted/10"
                                            : ""
                                    }`}
                                >

                                    {/* Day number */}

                                    <div className="mb-2 flex items-center justify-between">

                                        <span
                                            className={`flex size-7 items-center justify-center rounded-full text-sm ${
                                                isToday
                                                    ? "bg-primary font-semibold text-primary-foreground"
                                                    : isCurrentMonth
                                                        ? "font-medium"
                                                        : "text-muted-foreground"
                                            }`}
                                        >
                                            {dayNumber}
                                        </span>

                                    </div>


                                    {/* Shifts */}

                                    <div className="space-y-1">

                                        {dayShifts.map(
                                            (
                                                shift
                                            ) => (
                                                <Link
                                                    key={
                                                        shift.id
                                                    }
                                                    href={`/shifts/${shift.id}`}
                                                    className="block rounded-md border bg-background p-2 transition-colors hover:bg-muted"
                                                >

                                                    <div className="flex items-center justify-between gap-1">

                                                        <p className="min-w-0 truncate text-xs font-medium">
                                                            {
                                                                shift.name
                                                            }
                                                        </p>

                                                    </div>


                                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                                        {formatTime(
                                                            shift.startDateTime
                                                        )}{" "}
                                                        –{" "}
                                                        {formatTime(
                                                            shift.endDateTime
                                                        )}
                                                    </p>


                                                    <span
                                                        className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getStatusClass(
                                                            shift.status
                                                        )}`}
                                                    >
                                                        {
                                                            statusLabels[
                                                                shift.status
                                                            ]
                                                        }
                                                    </span>

                                                </Link>
                                            )
                                        )}

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>


                {/* Empty */}

                {shifts.length === 0 && (
                    <div className="border-t px-6 py-8 text-center">

                        <p className="text-sm font-medium">
                            No shifts found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {search
                                ? "Try a different search."
                                : "There are no shifts scheduled for this month."}
                        </p>

                    </div>
                )}

            </div>

        </div>
    );
}


/*
 * Helpers
 */

function formatDateKey(
    date: Date
): string {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function isSameDay(
    first: Date,
    second: Date
): boolean {
    return (
        first.getFullYear() ===
            second.getFullYear() &&
        first.getMonth() ===
            second.getMonth() &&
        first.getDate() ===
            second.getDate()
    );
}


function formatTime(
    value: string
): string {
    return new Date(
        value
    ).toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}


function getStatusClass(
    status: ShiftStatus
): string {
    switch (status) {
        case ShiftStatus.Open:
            return "bg-primary/10 text-primary";

        case ShiftStatus.Filled:
            return "bg-blue-500/10 text-blue-600";

        case ShiftStatus.InProgress:
            return "bg-yellow-500/10 text-yellow-600";

        case ShiftStatus.Completed:
            return "bg-green-500/10 text-green-600";

        case ShiftStatus.Cancelled:
            return "bg-destructive/10 text-destructive";

        default:
            return "bg-muted text-muted-foreground";
    }
}
