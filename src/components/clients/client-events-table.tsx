"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Eye, Pencil, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    getClientEvents,
    type Event,
} from "@/lib/api/events";

import { EventDialog } from "@/components/events/event-dialog";

type ClientEventsTableProps = {
    clientId: string;
};

const eventStatusLabels: Record<number, string> = {
    1: "Draft",
    2: "Scheduled",
    3: "Ongoing",
    4: "Completed",
    5: "Cancelled",
};

const eventTypeLabels: Record<number, string> = {
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

function formatDate(value: string) {
    return new Date(value).toLocaleDateString();
}

export function ClientEventsTable({
    clientId,
}: ClientEventsTableProps) {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [editEvent, setEditEvent] =
        useState<Event | undefined>();

    const [editOpen, setEditOpen] =
        useState(false);

    const { data, isLoading, isError } =
        useQuery({
            queryKey: [
                "client-events",
                clientId,
                pageNumber,
                pageSize,
                search,
            ],
            queryFn: () =>
                getClientEvents(
                    clientId,
                    pageNumber,
                    pageSize,
                    search
                ),
            enabled: !!clientId,
        });

    const events = data?.items ?? [];

    const totalNumber =
        data?.totalNumber ?? 0;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalNumber / pageSize
            )
        );

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) *
            pageSize +
            1;

    const endItem =
        Math.min(
            pageNumber * pageSize,
            totalNumber
        );

    const handleSearch = (
        value: string
    ) => {
        setSearch(value);
        setPageNumber(1);
    };

    const handleEdit = (
        event: Event
    ) => {
        setEditEvent(event);
        setEditOpen(true);
    };

    const handleSuccess = () => {
        setEditOpen(false);
        setEditEvent(undefined);

        queryClient.invalidateQueries({
            queryKey: [
                "client-events",
                clientId,
            ],
        });
    };

    return (
        <div className="rounded-xl border bg-card">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-semibold">
                        Events
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Events associated with this client.
                    </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search events..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    Loading events...
                </div>
            ) : isError ? (
                <div className="p-8 text-center text-sm text-destructive">
                    Failed to load events.
                </div>
            ) : events.length === 0 ? (
                <div className="p-10 text-center">
                    <CalendarDays className="mx-auto size-8 text-muted-foreground" />

                    <h3 className="mt-3 font-medium">
                        No events found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        This client doesn't have any events yet.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-3 font-medium">
                                    Event
                                </th>

                                <th className="px-6 py-3 font-medium">
                                    Event Number
                                </th>

                                <th className="px-6 py-3 font-medium">
                                    Type
                                </th>

                                <th className="px-6 py-3 font-medium">
                                    Start
                                </th>

                                <th className="px-6 py-3 font-medium">
                                    Status
                                </th>

                                <th className="px-6 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {events.map(
                                (event) => (
                                    <tr
                                        key={
                                            event.id
                                        }
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium">
                                                {
                                                    event.name
                                                }
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {
                                                event.eventNumber
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            {
                                                eventTypeLabels[
                                                event.type
                                                ] ??
                                                "Other"
                                            }
                                        </td>

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDate(
                                                event.startDateTime
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                {
                                                    eventStatusLabels[
                                                    event.status
                                                    ] ??
                                                    "Unknown"
                                                }
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/events/${event.id}`}
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEdit(
                                                            event
                                                        )
                                                    }
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                        {startItem}–
                        {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                        {totalNumber}
                    </span>{" "}
                    events
                </p>

                <div className="flex items-center gap-3">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(
                                Number(
                                    e.target
                                        .value
                                )
                            );
                            setPageNumber(1);
                        }}
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                    >
                        <option value={10}>
                            10
                        </option>
                        <option value={20}>
                            20
                        </option>
                        <option value={50}>
                            50
                        </option>
                        <option value={100}>
                            100
                        </option>
                    </select>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            pageNumber <= 1
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) =>
                                    page - 1
                            )
                        }
                    >
                        Previous
                    </Button>

                    <span className="text-sm whitespace-nowrap">
                        Page{" "}
                        <span className="font-medium">
                            {pageNumber}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                            {totalPages}
                        </span>
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            pageNumber >=
                            totalPages
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) =>
                                    page + 1
                            )
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit */}
            <EventDialog
                event={editEvent}
                clientId={clientId}
                open={editOpen}
                onOpenChange={
                    setEditOpen
                }
                onSuccess={
                    handleSuccess
                }
            />
        </div>
    );

}
