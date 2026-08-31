"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Pencil,
    FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getShift,
} from "@/lib/api/shifts";

import {
    ShiftDialog,
} from "@/components/shifts/shift-dialog";
import {
    ShiftRoles,
} from "@/components/shifts/shift-roles";

export default function ShiftDetailsPage() {
    const params = useParams();

    const shiftId =
        params.id as string;

    const [
        editOpen,
        setEditOpen,
    ] = useState(false);

    const queryClient =
        useQueryClient();


    const {
        data: shift,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "shift",
            shiftId,
        ],

        queryFn: () =>
            getShift(shiftId),

        enabled: !!shiftId,
    });


    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8">
                <p className="text-sm text-muted-foreground">
                    Loading shift...
                </p>
            </div>
        );
    }


    if (isError || !shift) {
        return (
            <div className="space-y-4">

                <Button
                    variant="outline"
                    asChild
                >
                    <Link href="/shifts">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Shifts
                    </Link>
                </Button>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load shift
                    </h2>


                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The shift could not be loaded."}
                    </p>


                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() =>
                            refetch()
                        }
                    >
                        Try Again
                    </Button>

                </div>

            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Top Actions */}
            <div className="flex items-center justify-between">

                <Button
                    variant="outline"
                    size="sm"
                    asChild
                >
                    <Link href="/shifts">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Shifts
                    </Link>
                </Button>


                <Button
                    onClick={() =>
                        setEditOpen(true)
                    }
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Shift
                </Button>

            </div>


            {/* Header */}
            <div className="rounded-xl border bg-card p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                            <h1 className="text-2xl font-semibold tracking-tight">
                                {shift.name}
                            </h1>


                            <ShiftStatusBadge
                                status={
                                    shift.status
                                }
                            />

                        </div>


                        {shift.description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {shift.description}
                            </p>
                        )}

                    </div>

                </div>

            </div>


            {/* Shift Information */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Shift Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Details and schedule for this shift.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <DetailItem
                        icon={FileText}
                        label="Event"
                        value={
                            shift.eventName ??
                            shift.eventId
                        }
                    />


                    <DetailItem
                        icon={Clock}
                        label="Start Date & Time"
                        value={formatDateTime(
                            shift.startDateTime
                        )}
                    />


                    <DetailItem
                        icon={Clock}
                        label="End Date & Time"
                        value={formatDateTime(
                            shift.endDateTime
                        )}
                    />


                    <DetailItem
                        icon={CalendarDays}
                        label="Status"
                        value={getShiftStatusLabel(
                            shift.status
                        )}
                    />

                </div>

            </div>

            {/* Shift Roles */}
            <ShiftRoles
                shiftId={shift.id}
            />

            {/* Edit Shift Dialog */}

            <ShiftDialog
                shift={shift}
                eventId={shift.eventId}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={() => {

                    queryClient.invalidateQueries({
                        queryKey: [
                            "shift",
                            shiftId,
                        ],
                    });


                    queryClient.invalidateQueries({
                        queryKey: [
                            "event-shifts",
                            shift.eventId,
                        ],
                    });


                    queryClient.invalidateQueries({
                        queryKey: ["shifts"],
                    });

                }}
            />

        </div>
    );
}


type DetailItemProps = {
    icon: React.ElementType;
    label: string;
    value?: string | null;
};


function DetailItem({
    icon: Icon,
    label,
    value,
}: DetailItemProps) {
    return (
        <div className="flex items-start gap-3">

            <div className="rounded-md bg-muted p-2">
                <Icon className="size-4 text-muted-foreground" />
            </div>


            <div className="min-w-0">

                <p className="text-sm text-muted-foreground">
                    {label}
                </p>


                <p className="mt-1 break-words font-medium">
                    {value || "—"}
                </p>

            </div>

        </div>
    );
}


function formatDateTime(
    value?: string | null
) {
    if (!value) {
        return "—";
    }

    return new Date(
        value
    ).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
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

    return (
        statuses[status] ??
        "Unknown"
    );
}


function ShiftStatusBadge({
    status,
}: {
    status: number;
}) {
    const label =
        getShiftStatusLabel(status);

    let className =
        "bg-muted text-muted-foreground";


    switch (status) {
        case 1:
            className =
                "bg-primary/10 text-primary";
            break;

        case 2:
            className =
                "bg-primary/10 text-primary";
            break;

        case 3:
            className =
                "bg-primary/10 text-primary";
            break;

        case 4:
            className =
                "bg-muted text-muted-foreground";
            break;

        case 5:
            className =
                "bg-destructive/10 text-destructive";
            break;
    }


    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
        >
            {label}
        </span>
    );
}
