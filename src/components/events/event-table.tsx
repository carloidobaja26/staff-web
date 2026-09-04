"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Search,
} from "lucide-react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    EventStatus,
    EventType,
    getEvents,
} from "@/lib/api/events";

import { EventDialog } from "./event-dialog";
import { EventActions } from "./event-actions";
import { useAgencyStore } from "@/stores/agency-store";

const statusLabels: Record<EventStatus, string> = {
    [EventStatus.Draft]: "Draft",
    [EventStatus.Scheduled]: "Scheduled",
    [EventStatus.Ongoing]: "Ongoing",
    [EventStatus.Completed]: "Completed",
    [EventStatus.Cancelled]: "Cancelled",
};


const typeLabels: Record<EventType, string> = {
    [EventType.Corporate]: "Corporate",
    [EventType.Concert]: "Concert",
    [EventType.Festival]: "Festival",
    [EventType.Wedding]: "Wedding",
    [EventType.Sports]: "Sports",
    [EventType.Exhibition]: "Exhibition",
    [EventType.TradeShow]: "Trade Show",
    [EventType.Private]: "Private",
    [EventType.Other]: "Other",
};


function getStatusClass(
    status: EventStatus
) {
    switch (status) {
        case EventStatus.Draft:
            return "bg-muted text-muted-foreground";

        case EventStatus.Scheduled:
            return "bg-primary/10 text-primary";

        case EventStatus.Ongoing:
            return "bg-yellow-500/10 text-yellow-600";

        case EventStatus.Completed:
            return "bg-green-500/10 text-green-600";

        case EventStatus.Cancelled:
            return "bg-destructive/10 text-destructive";

        default:
            return "bg-muted text-muted-foreground";
    }
}


function formatDateTime(
    value: string
) {
    return new Date(value).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
}


export function EventTable() {
    const queryClient =
        useQueryClient();
    const agencyId = useAgencyStore(
        (state) => state.agencyId
    );
    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");


    /*
     * Debounce search
     */

    useEffect(() => {
        const timer =
            setTimeout(() => {
                setDebouncedSearch(
                    search
                );

                setPageNumber(1);
            }, 400);

        return () =>
            clearTimeout(timer);
    }, [search]);


    /*
     * Get events
     */

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "events",
            pageNumber,
            pageSize,
            debouncedSearch,
        ],

        queryFn: () =>
            getEvents(
                pageNumber,
                pageSize,
                debouncedSearch
            ),
    });


    const events =
        data?.items ?? [];

    const totalNumber =
        data?.totalNumber ?? 0;


    const totalPages =
        Math.ceil(
            totalNumber / pageSize
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


    /*
     * Loading
     */

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">

                <p className="text-sm text-muted-foreground">
                    Loading events...
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
                    Failed to load events
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong."}
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
        );
    }

    if (!agencyId) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Please select an agency.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* Search + Add Event */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}

                <div className="relative w-full sm:max-w-sm">

                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search events..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        className="pl-9"
                    />

                </div>


                {/* Add Event */}

                <EventDialog
                    onSuccess={() => {
                        queryClient.invalidateQueries({
                            queryKey: ["events"],
                        });
                    }}
                />

            </div>


            {/* Table */}

            <div className="rounded-xl border bg-card">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="border-b bg-muted/30">

                            <tr>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Event
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Event Number
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Type
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Schedule
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Active
                                </th>

                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y">

                            {events.map(
                                (event) => (
                                    <tr
                                        key={
                                            event.id
                                        }
                                        className="transition-colors hover:bg-muted/30"
                                    >

                                        {/* Event */}

                                        <td className="px-4 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="hidden rounded-md bg-muted p-2 sm:block">

                                                    <CalendarDays className="size-4 text-muted-foreground" />

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="font-medium">
                                                        {
                                                            event.name
                                                        }
                                                    </p>

                                                    {event.description && (
                                                        <p className="mt-1 max-w-[250px] truncate text-sm text-muted-foreground">
                                                            {
                                                                event.description
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        {/* Event Number */}

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {
                                                event.eventNumber
                                            }
                                        </td>


                                        {/* Type */}

                                        <td className="px-4 py-4">

                                            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                {
                                                    typeLabels[
                                                        event.type
                                                    ]
                                                }
                                            </span>

                                        </td>


                                        {/* Schedule */}

                                        <td className="px-4 py-4">

                                            <div className="text-sm">

                                                <p className="font-medium">
                                                    {
                                                        formatDateTime(
                                                            event.startDateTime
                                                        )
                                                    }
                                                </p>

                                                <p className="mt-1 text-muted-foreground">
                                                    to{" "}
                                                    {
                                                        formatDateTime(
                                                            event.endDateTime
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* Status */}

                                        <td className="px-4 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    event.status
                                                )}`}
                                            >
                                                {
                                                    statusLabels[
                                                        event.status
                                                    ]
                                                }
                                            </span>

                                        </td>


                                        {/* Active */}

                                        <td className="px-4 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    event.isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {
                                                    event.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td className="px-4 py-4 text-right">

                                            <EventActions
                                                event={event}
                                                onSuccess={() => {
                                                    queryClient.invalidateQueries({
                                                        queryKey: [
                                                            "events",
                                                        ],
                                                    });
                                                }}
                                            />

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>


                {/* Empty */}

                {events.length === 0 && (
                    <div className="border-t px-6 py-10 text-center">

                        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">

                            <CalendarDays className="size-5 text-muted-foreground" />

                        </div>

                        <p className="mt-3 text-sm font-medium">
                            No events found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {debouncedSearch
                                ? "Try a different search."
                                : "Create your first event to get started."}
                        </p>

                    </div>
                )}


                {/* Pagination */}

                <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-muted-foreground">

                        Showing{" "}

                        <span className="font-medium text-foreground">
                            {startItem}–{endItem}
                        </span>{" "}

                        of{" "}

                        <span className="font-medium text-foreground">
                            {totalNumber}
                        </span>{" "}

                        events

                    </p>


                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        {/* Page Size */}

                        <div className="flex items-center gap-2">

                            <span className="text-sm text-muted-foreground">
                                Per page
                            </span>

                            <Select
                                value={String(
                                    pageSize
                                )}
                                onValueChange={(
                                    value
                                ) => {
                                    setPageSize(
                                        Number(
                                            value
                                        )
                                    );

                                    setPageNumber(
                                        1
                                    );
                                }}
                            >

                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>

                                    <SelectItem value="10">
                                        10
                                    </SelectItem>

                                    <SelectItem value="20">
                                        20
                                    </SelectItem>

                                    <SelectItem value="50">
                                        50
                                    </SelectItem>

                                    <SelectItem value="100">
                                        100
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                        </div>


                        {/* Pagination */}

                        <div className="flex items-center gap-2">

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    pageNumber ===
                                    1
                                }
                                onClick={() =>
                                    setPageNumber(
                                        (
                                            page
                                        ) =>
                                            page -
                                            1
                                    )
                                }
                            >
                                Previous
                            </Button>


                            <span className="whitespace-nowrap text-sm text-muted-foreground">

                                Page{" "}

                                <span className="font-medium text-foreground">
                                    {pageNumber}
                                </span>{" "}

                                of{" "}

                                <span className="font-medium text-foreground">
                                    {totalPages ||
                                        1}
                                </span>

                            </span>


                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    totalPages ===
                                        0 ||
                                    pageNumber >=
                                        totalPages
                                }
                                onClick={() =>
                                    setPageNumber(
                                        (
                                            page
                                        ) =>
                                            page +
                                            1
                                    )
                                }
                            >
                                Next
                            </Button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
