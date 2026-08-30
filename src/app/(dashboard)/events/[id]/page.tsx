"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Hash,
    MapPin,
    Pencil,
    Building2,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getEvent,
    type Event,
} from "@/lib/api/events";

import { EventDialog } from "@/components/events/event-dialog";


export default function EventDetailsPage() {
    const params = useParams();

    const eventId = params.id as string;

    const [editOpen, setEditOpen] = useState(false);

    const queryClient = useQueryClient();

    const {
        data: event,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEvent(eventId),
        enabled: !!eventId,
    });


    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8">
                <p className="text-sm text-muted-foreground">
                    Loading event...
                </p>
            </div>
        );
    }


    if (isError || !event) {
        return (
            <div className="space-y-4">

                <Button
                    variant="outline"
                    size="sm"
                    asChild
                >
                    <Link href="/events">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Events
                    </Link>
                </Button>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load event
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The event could not be loaded."}
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
            </div>
        );
    }


    const fullDateTime = (
        value: string
    ) => {
        return new Date(value).toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    const eventType = getEventTypeLabel(
        event.type
    );

    const eventStatus = getEventStatusLabel(
        event.status
    );


    return (
        <div className="space-y-6">

            {/* Back */}
            <Button
                variant="outline"
                size="sm"
                asChild
            >
                <Link
                    href={`/clients/${event.clientId}`}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Client
                </Link>
            </Button>


            {/* Header */}
            <div className="rounded-xl border bg-card p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                            <div>

                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {event.name}
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Event Number:{" "}
                                    {event.eventNumber}
                                </p>

                            </div>


                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                    event.status
                                )}`}
                            >
                                {eventStatus}
                            </span>

                        </div>

                    </div>


                    <div className="flex shrink-0">

                        <Button
                            type="button"
                            onClick={() =>
                                setEditOpen(true)
                            }
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit Event
                        </Button>

                    </div>

                </div>

            </div>


            {/* Event Information */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Event Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Details and scheduling information
                        for this event.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <DetailItem
                        icon={Hash}
                        label="Event Number"
                        value={event.eventNumber}
                    />

                    <DetailItem
                        icon={CalendarDays}
                        label="Event Type"
                        value={eventType}
                    />

                    <DetailItem
                        icon={UserRound}
                        label="Client"
                        value={event.clientName}
                    />

                    <DetailItem
                        icon={Building2}
                        label="Agency"
                        value={event.agencyName}
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Venue"
                        value={event.venueName}
                    />

                    <DetailItem
                        icon={Clock}
                        label="Start"
                        value={fullDateTime(
                            event.startDateTime
                        )}
                    />

                    <DetailItem
                        icon={Clock}
                        label="End"
                        value={fullDateTime(
                            event.endDateTime
                        )}
                    />

                </div>

            </div>


            {/* Description */}
            {event.description && (
                <div className="rounded-xl border bg-card">

                    <div className="border-b px-6 py-4">

                        <h2 className="font-semibold">
                            Description
                        </h2>

                    </div>

                    <div className="p-6">

                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {event.description}
                        </p>

                    </div>

                </div>
            )}


            {/* Edit Event Dialog */}
            <EventDialog
                event={event}
                clientId={event.clientId}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={() => {

                    queryClient.invalidateQueries({
                        queryKey: [
                            "event",
                            eventId,
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: [
                            "events",
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: [
                            "client-events",
                            event.clientId,
                        ],
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


function getEventTypeLabel(
    type: number
) {
    const types: Record<number, string> = {
        1: "Corporate",
        2: "Concert",
        3: "Festival",
        4: "Wedding",
        5: "Sports",
        6: "Exhibition",
        7: "Trade Show",
        8: "Private",
        9: "Other",
    };

    return types[type] ?? "Unknown";
}


function getEventStatusLabel(
    status: number
) {
    const statuses: Record<number, string> = {
        1: "Draft",
        2: "Scheduled",
        3: "Ongoing",
        4: "Completed",
        5: "Cancelled",
    };

    return statuses[status] ?? "Unknown";
}


function getStatusClass(
    status: number
) {
    switch (status) {
        case 1:
            return "bg-muted text-muted-foreground";

        case 2:
            return "bg-primary/10 text-primary";

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
