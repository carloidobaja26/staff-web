"use client";

import Link from "next/link";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    CalendarDays,
    Clock,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getEventShifts,
    type Shift,
} from "@/lib/api/shifts";

import { ShiftDialog } from "@/components/shifts/shift-dialog";
import { ShiftActions } from "@/components/shifts/shift-actions";


type EventShiftsProps = {
    eventId: string;
};


export function EventShifts({
    eventId,
}: EventShiftsProps) {
    const queryClient = useQueryClient();

    const {
        data: shifts = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "event-shifts",
            eventId,
        ],
        queryFn: () =>
            getEventShifts(eventId),
        enabled: !!eventId,
    });


    const handleSuccess = () => {
        queryClient.invalidateQueries({
            queryKey: [
                "event-shifts",
                eventId,
            ],
        });

        queryClient.invalidateQueries({
            queryKey: ["shifts"],
        });
    };


    return (
        <div className="rounded-xl border bg-card">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="font-semibold">
                        Shifts
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage staffing shifts for this event.
                    </p>
                </div>


                <ShiftDialog
                    eventId={eventId}
                    onSuccess={handleSuccess}
                />

            </div>


            {/* Loading */}
            {isLoading && (
                <div className="p-6">
                    <p className="text-sm text-muted-foreground">
                        Loading shifts...
                    </p>
                </div>
            )}


            {/* Error */}
            {isError && (
                <div className="p-6">
                    <p className="text-sm text-destructive">
                        Failed to load shifts.
                    </p>
                </div>
            )}


            {/* Empty State */}
            {!isLoading &&
                !isError &&
                shifts.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-10 text-center">

                        <div className="rounded-full bg-muted p-3">
                            <CalendarDays className="size-6 text-muted-foreground" />
                        </div>


                        <h3 className="mt-4 font-medium">
                            No shifts yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Create a shift to start planning
                            staffing for this event.
                        </p>

                    </div>
                )}


            {/* Shift List */}
            {!isLoading &&
                !isError &&
                shifts.length > 0 && (
                    <div className="divide-y">

                        {shifts.map((shift) => (
                            <EventShiftRow
                                key={shift.id}
                                shift={shift}
                                eventId={eventId}
                                onSuccess={handleSuccess}
                            />
                        ))}

                    </div>
                )}

        </div>
    );
}


type EventShiftRowProps = {
    shift: Shift;
    eventId: string;
    onSuccess: () => void;
};


function EventShiftRow({
    shift,
    eventId,
    onSuccess,
}: EventShiftRowProps) {
    const formatDateTime = (
        value: string
    ) => {
        return new Date(
            value
        ).toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    return (
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Shift Information */}
            <Link
                href={`/shifts/${shift.id}`}
                className="group min-w-0 flex-1"
            >

                <div className="flex items-start gap-3">

                    <div className="rounded-md bg-muted p-2">
                        <Clock className="size-4 text-muted-foreground" />
                    </div>


                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate font-medium group-hover:underline">
                                {shift.name}
                            </h3>


                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getShiftStatusClass(
                                    shift.status
                                )}`}
                            >
                                {getShiftStatusLabel(
                                    shift.status
                                )}
                            </span>

                        </div>


                        {shift.description && (
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                {shift.description}
                            </p>
                        )}


                        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">

                            <span>
                                Start:{" "}
                                {formatDateTime(
                                    shift.startDateTime
                                )}
                            </span>

                            <span className="hidden sm:inline">
                                •
                            </span>

                            <span>
                                End:{" "}
                                {formatDateTime(
                                    shift.endDateTime
                                )}
                            </span>

                        </div>

                    </div>

                </div>

            </Link>


            {/* Actions */}
            <div className="flex shrink-0">

                <ShiftActions
                    shift={shift}
                    eventId={eventId}
                    onSuccess={onSuccess}
                />

            </div>

        </div>
    );
}


function getShiftStatusLabel(
    status: number
) {
    const statuses: Record<
        number,
        string
    > = {
        1: "Open",
        2: "Filled",
        3: "In Progress",
        4: "Completed",
        5: "Cancelled",
    };

    return statuses[status] ?? "Unknown";
}


function getShiftStatusClass(
    status: number
) {
    switch (status) {
        case 1:
            return "bg-primary/10 text-primary";

        case 2:
            return "bg-muted text-muted-foreground";

        case 3:
            return "bg-primary/10 text-primary";

        case 4:
            return "bg-muted text-muted-foreground";

        case 5:
            return "bg-destructive/10 text-destructive";

        default:
            return "bg-muted text-muted-foreground";
    }
}
