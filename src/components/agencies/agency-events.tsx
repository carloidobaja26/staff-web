"use client";

import Link from "next/link";
import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";

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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    getAgencyEventsPaginated,
    type AgencyEvent,
} from "@/lib/api/agencies";

import {
    getEvent,
    type Event,
} from "@/lib/api/events";

import { EventForm } from "@/components/events/event-form";
import { DeleteEventDialog } from "@/components/events/delete-event-dialog";

import { getApiErrorMessage } from "@/lib/helpers/api-error";


type AgencyEventsProps = {
    agencyId: string;
};


export function AgencyEvents({
    agencyId,
}: AgencyEventsProps) {

    const queryClient =
        useQueryClient();


    /* ---------------------------------------------------------------------- */
    /* State                                                                  */
    /* ---------------------------------------------------------------------- */

    const [
        pageNumber,
        setPageNumber,
    ] = useState(1);


    const [
        pageSize,
        setPageSize,
    ] = useState(10);


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        createOpen,
        setCreateOpen,
    ] = useState(false);


    /*
     * Full event used by EventForm.
     *
     * The agency events endpoint returns AgencyEvent,
     * while EventForm expects the complete Event.
     */
    const [
        editEvent,
        setEditEvent,
    ] = useState<Event | null>(null);


    /*
     * AgencyEvent is enough for deleting because
     * the delete operation only needs the event id
     * and basic event information.
     */
    const [
        deleteEventTarget,
        setDeleteEventTarget,
    ] = useState<AgencyEvent | null>(null);


    const [
        isLoadingEvent,
        setIsLoadingEvent,
    ] = useState(false);


    /* ---------------------------------------------------------------------- */
    /* Agency Events                                                          */
    /* ---------------------------------------------------------------------- */

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({

        queryKey: [
            "agency-events",
            agencyId,
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getAgencyEventsPaginated(
                agencyId,
                {
                    pageNumber,
                    pageSize,
                    search:
                        search.trim() ||
                        undefined,
                }
            ),

        enabled: !!agencyId,

    });


    const events =
        data?.items ?? [];


    const totalNumber =
        data?.totalNumber ?? 0;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalNumber /
                pageSize
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
            pageNumber *
                pageSize,
            totalNumber
        );


    /* ---------------------------------------------------------------------- */
    /* Search                                                                 */
    /* ---------------------------------------------------------------------- */

    function handleSearchChange(
        value: string
    ) {

        setSearch(value);

        setPageNumber(1);

    }


    /* ---------------------------------------------------------------------- */
    /* Page Size                                                               */
    /* ---------------------------------------------------------------------- */

    function handlePageSizeChange(
        value: string
    ) {

        setPageSize(
            Number(value)
        );

        setPageNumber(1);

    }


    /* ---------------------------------------------------------------------- */
    /* Refresh                                                                */
    /* ---------------------------------------------------------------------- */

    function refreshEvents() {

        queryClient.invalidateQueries({
            queryKey: [
                "agency-events",
                agencyId,
            ],
        });

    }


    /* ---------------------------------------------------------------------- */
    /* Edit Event                                                              */
    /* ---------------------------------------------------------------------- */

    async function handleEditEvent(
        agencyEvent: AgencyEvent
    ) {

        try {

            setIsLoadingEvent(true);

            const event =
                await getEvent(
                    agencyEvent.id
                );

            setEditEvent(event);

        } catch (error) {

            console.error(
                "Failed to load event:",
                error
            );

        } finally {

            setIsLoadingEvent(false);

        }

    }


    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="space-y-4">


            {/* ---------------------------------------------------------------- */}
            {/* Search + Add Event                                                */}
            {/* ---------------------------------------------------------------- */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}

                <div className="relative w-full sm:max-w-sm">

                    <Search
                        className="
                            absolute
                            left-3
                            top-1/2
                            size-4
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />

                    <Input
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search events..."
                        className="pl-9"
                    />

                </div>


                {/* Add Event */}

                <Button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >

                    <Plus className="mr-2 size-4" />

                    Add Event

                </Button>

            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Loading                                                           */}
            {/* ---------------------------------------------------------------- */}

            {isLoading && (

                <div className="rounded-lg border p-8 text-center">

                    <p className="text-sm text-muted-foreground">
                        Loading events...
                    </p>

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Error                                                             */}
            {/* ---------------------------------------------------------------- */}

            {isError && (

                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                    <p className="text-sm font-medium text-destructive">
                        Failed to load events.
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {getApiErrorMessage(
                            error,
                            "Unable to load agency events."
                        )}
                    </p>

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Empty                                                             */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                events.length === 0 && (

                    <div className="rounded-lg border border-dashed p-8 text-center">

                        <CalendarDays className="mx-auto size-8 text-muted-foreground" />

                        <h3 className="mt-3 text-sm font-medium">
                            No events found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            This agency does not have any
                            events yet.
                        </p>

                    </div>

                )}


            {/* ---------------------------------------------------------------- */}
            {/* Table                                                             */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                events.length > 0 && (

                    <div className="overflow-hidden rounded-lg border">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b bg-muted/40">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Event
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Client
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Start
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            End
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
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
                                                className="
                                                    border-b
                                                    last:border-0
                                                    transition-colors
                                                    hover:bg-muted/40
                                                "
                                            >

                                                {/* ------------------------------------------------ */}
                                                {/* Event                                              */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        className="
                                                            group
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">

                                                            <CalendarDays className="size-4 text-muted-foreground" />

                                                        </div>


                                                        <div>

                                                            <p className="font-medium group-hover:underline">

                                                                {
                                                                    event.name
                                                                }

                                                            </p>


                                                            {event.eventNumber && (

                                                                <p className="mt-1 text-xs text-muted-foreground">

                                                                    {
                                                                        event.eventNumber
                                                                    }

                                                                </p>

                                                            )}

                                                        </div>

                                                    </Link>

                                                </td>


                                                {/* ------------------------------------------------ */}
                                                {/* Client                                             */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">

                                                        {
                                                            event.clientName ||
                                                            "—"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ------------------------------------------------ */}
                                                {/* Start                                              */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">

                                                        {
                                                            formatDateTime(
                                                                event.startDateTime
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* ------------------------------------------------ */}
                                                {/* End                                                */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">

                                                        {
                                                            formatDateTime(
                                                                event.endDateTime
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* ------------------------------------------------ */}
                                                {/* Status                                             */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            ${getStatusClass(
                                                                event.status
                                                            )}
                                                        `}
                                                    >

                                                        {
                                                            formatStatus(
                                                                event.status
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* ------------------------------------------------ */}
                                                {/* Actions                                            */}
                                                {/* ------------------------------------------------ */}

                                                <td className="px-4 py-4">

                                                    <div className="flex justify-end gap-2">


                                                        {/* Edit */}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={
                                                                isLoadingEvent
                                                            }
                                                            onClick={() =>
                                                                handleEditEvent(
                                                                    event
                                                                )
                                                            }
                                                        >

                                                            <Pencil className="mr-2 size-4" />

                                                            {isLoadingEvent
                                                                ? "Loading..."
                                                                : "Edit"}

                                                        </Button>


                                                        {/* Delete */}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setDeleteEventTarget(
                                                                    event
                                                                )
                                                            }
                                                        >

                                                            <Trash2 className="mr-2 size-4" />

                                                            Delete

                                                        </Button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* ---------------------------------------------------- */}
                        {/* Pagination                                            */}
                        {/* ---------------------------------------------------- */}

                        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">


                            {/* Left side */}

                            <div className="flex items-center gap-4">

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


                                {/* Rows per page */}

                                <div className="flex items-center gap-2">

                                    <span className="text-sm text-muted-foreground">

                                        Rows per page

                                    </span>


                                    <Select
                                        value={String(
                                            pageSize
                                        )}
                                        onValueChange={
                                            handlePageSizeChange
                                        }
                                    >

                                        <SelectTrigger className="w-[70px]">

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

                            </div>


                            {/* Right side */}

                            <div className="flex items-center gap-2">


                                {/* Previous */}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        pageNumber === 1 ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPageNumber(
                                            (page) =>
                                                page - 1
                                        )
                                    }
                                >

                                    <ChevronLeft className="mr-1 size-4" />

                                    Previous

                                </Button>


                                {/* Page numbers */}

                                <div className="flex items-center gap-1">

                                    {Array.from(
                                        {
                                            length:
                                                totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        (page) => (

                                            <Button
                                                key={
                                                    page
                                                }
                                                variant={
                                                    pageNumber ===
                                                    page
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                disabled={
                                                    isFetching
                                                }
                                                onClick={() =>
                                                    setPageNumber(
                                                        page
                                                    )
                                                }
                                            >

                                                {page}

                                            </Button>

                                        )
                                    )}

                                </div>


                                {/* Next */}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        pageNumber >=
                                            totalPages ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPageNumber(
                                            (page) =>
                                                page + 1
                                        )
                                    }
                                >

                                    Next

                                    <ChevronRight className="ml-1 size-4" />

                                </Button>

                            </div>

                        </div>

                    </div>

                )}


            {/* ---------------------------------------------------------------- */}
            {/* Create Event Dialog                                               */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Event
                        </DialogTitle>

                    </DialogHeader>


                    <EventForm
                        agencyId={agencyId}
                        onSuccess={() => {

                            setCreateOpen(
                                false
                            );

                            setPageNumber(1);

                            refreshEvents();

                        }}
                        onCancel={() =>
                            setCreateOpen(
                                false
                            )
                        }
                    />

                </DialogContent>

            </Dialog>


            {/* ---------------------------------------------------------------- */}
            {/* Edit Event Dialog                                                 */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={!!editEvent}
                onOpenChange={(open) => {

                    if (!open) {

                        setEditEvent(
                            null
                        );

                    }

                }}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Edit Event
                        </DialogTitle>

                    </DialogHeader>


                    {editEvent && (

                        <EventForm
                            event={editEvent}
                            agencyId={agencyId}
                            onSuccess={() => {

                                setEditEvent(
                                    null
                                );

                                refreshEvents();

                            }}
                            onCancel={() =>
                                setEditEvent(
                                    null
                                )
                            }
                        />

                    )}

                </DialogContent>

            </Dialog>


            {/* ---------------------------------------------------------------- */}
            {/* Delete Event Dialog                                               */}
            {/* ---------------------------------------------------------------- */}

            {deleteEventTarget && (

                <DeleteEventDialog
                    event={deleteEventTarget}
                    open={true}
                    onOpenChange={(open) => {

                        if (!open) {

                            setDeleteEventTarget(
                                null
                            );

                        }

                    }}
                    onSuccess={() => {

                        setDeleteEventTarget(
                            null
                        );

                        refreshEvents();

                    }}
                />

            )}

        </div>
    );
}


/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */


function formatDateTime(
    value?: string | null
): string {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(date);

}


function formatStatus(
    status: unknown
): string {

    if (
        typeof status !==
        "string"
    ) {

        return "Unknown";

    }


    return status
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )
        .replace(
            /^./,
            (value) =>
                value.toUpperCase()
        );

}


function getStatusClass(
    status: unknown
): string {

    switch (status) {

        case "Draft":

            return "bg-muted text-muted-foreground";


        case "Scheduled":

            return "bg-blue-500/10 text-blue-600";


        case "Ongoing":

            return "bg-yellow-500/10 text-yellow-600";


        case "Completed":

            return "bg-green-500/10 text-green-600";


        case "Cancelled":

            return "bg-destructive/10 text-destructive";


        default:

            return "bg-muted text-muted-foreground";

    }

}