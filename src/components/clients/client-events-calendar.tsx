"use client";

import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import {
    getClientEventsCalendar,
    type Event,
} from "@/lib/api/events";
import { useRouter } from "next/navigation";
type ClientEventsCalendarProps = {
    clientId: string;
};

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

export function ClientEventsCalendar({
    clientId,
}: ClientEventsCalendarProps) {
    const today = new Date();

    const [currentDate, setCurrentDate] =
        useState(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth() + 1;

    const { data: events = [], isLoading } =
        useQuery({
            queryKey: [
                "client-events-calendar",
                clientId,
                year,
                month,
            ],
            queryFn: () =>
                getClientEventsCalendar(
                    clientId,
                    year,
                    month
                ),
            enabled: !!clientId,
        });

    const calendarDays = useMemo(() => {
        const firstDay = new Date(
            year,
            month - 1,
            1
        ).getDay();

        const daysInMonth = new Date(
            year,
            month,
            0
        ).getDate();

        const previousMonthDays =
            new Date(
                year,
                month - 1,
                0
            ).getDate();

        const days = [];

        for (
            let i = firstDay - 1;
            i >= 0;
            i--
        ) {
            days.push({
                date:
                    previousMonthDays -
                    i,
                currentMonth: false,
            });
        }

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            days.push({
                date: day,
                currentMonth: true,
            });
        }

        while (days.length < 42) {
            days.push({
                date:
                    days.length -
                    firstDay -
                    daysInMonth +
                    1,
                currentMonth: false,
            });
        }

        return days;
    }, [year, month]);

    const getEventsForDay = (
        day: number
    ): Event[] => {
        return events.filter((event) => {
            const date = new Date(
                event.startDateTime
            );

            return (
                date.getFullYear() ===
                year &&
                date.getMonth() + 1 ===
                month &&
                date.getDate() === day
            );
        });
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(
                year,
                month - 2,
                1
            )
        );
    };

    const goToNextMonth = () => {
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
    const router = useRouter();
    return (
        <div className="rounded-xl border bg-card">
            {/* Calendar Header */}
            <div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <CalendarDays className="size-5 text-muted-foreground" />

                    <h2 className="font-semibold">
                        {monthNames[
                            month - 1
                        ]}{" "}
                        {year}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={
                            goToToday
                        }
                    >
                        Today
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={
                            goToPreviousMonth
                        }
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={
                            goToNextMonth
                        }
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    Loading calendar...
                </div>
            ) : (
                <>
                    {/* Week Header */}
                    <div className="grid grid-cols-7 border-b">
                        {dayNames.map(
                            (day) => (
                                <div
                                    key={day}
                                    className="border-r px-2 py-3 text-center text-xs font-medium text-muted-foreground last:border-r-0"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map(
                            (
                                calendarDay,
                                index
                            ) => {
                                const dayEvents =
                                    calendarDay.currentMonth
                                        ? getEventsForDay(
                                            calendarDay.date
                                        )
                                        : [];

                                const isToday =
                                    calendarDay.currentMonth &&
                                    calendarDay.date ===
                                    today.getDate() &&
                                    month ===
                                    today.getMonth() +
                                    1 &&
                                    year ===
                                    today.getFullYear();

                                return (
                                    <div
                                        key={
                                            index
                                        }
                                        className={`min-h-[120px] border-b border-r p-2 ${!calendarDay.currentMonth
                                                ? "bg-muted/30"
                                                : ""
                                            }`}
                                    >
                                        <div
                                            className={`mb-2 flex size-7 items-center justify-center rounded-full text-xs ${isToday
                                                    ? "bg-primary text-primary-foreground"
                                                    : calendarDay.currentMonth
                                                        ? "font-medium"
                                                        : "text-muted-foreground"
                                                }`}
                                        >
                                            {
                                                calendarDay.date
                                            }
                                        </div>
<div className="space-y-1">
    {dayEvents.map((event) => (
        <div
            key={event.id}
            role="button"
            tabIndex={0}
            onClick={() =>
                router.push(`/events/${event.id}`)
            }
            onKeyDown={(e) => {
                if (
                    e.key === "Enter" ||
                    e.key === " "
                ) {
                    e.preventDefault();
                    router.push(
                        `/events/${event.id}`
                    );
                }
            }}
            className="cursor-pointer truncate rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            title={`View ${event.name}`}
        >
            {event.name}
        </div>
    ))}
</div>

                                    </div>
                                );
                            }
                        )}
                    </div>
                </>
            )}
        </div>
    );

}
