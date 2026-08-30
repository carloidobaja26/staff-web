"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
    getShifts,
    type Shift,
    ShiftStatus,
} from "@/lib/api/shifts";

import { ShiftDialog } from "./shift-dialog";
import { ShiftActions } from "./shift-actions";


const statusLabels: Record<ShiftStatus, string> = {
    [ShiftStatus.Open]: "Open",
    [ShiftStatus.Filled]: "Filled",
    [ShiftStatus.InProgress]: "In Progress",
    [ShiftStatus.Completed]: "Completed",
    [ShiftStatus.Cancelled]: "Cancelled",
};


export function ShiftTable() {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");


    /*
     * Debounce search
     */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPageNumber(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    /*
     * Query
     */

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "shifts",
            pageNumber,
            pageSize,
            debouncedSearch,
        ],

        queryFn: () =>
            getShifts(
                pageNumber,
                pageSize,
                debouncedSearch
            ),
    });


    const shifts: Shift[] =
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
                    Loading shifts...
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
                    Failed to load shifts
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
                        queryClient.invalidateQueries({
                            queryKey: ["shifts"],
                        })
                    }
                >
                    Try Again
                </Button>
            </div>
        );
    }


    return (
        <div className="space-y-4">

            {/* Search + Add */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

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


                <ShiftDialog
                    onSuccess={() => {
                        queryClient.invalidateQueries({
                            queryKey: ["shifts"],
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
                                    Shift
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Event
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Start
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    End
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Active
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y">

                            {shifts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center"
                                    >
                                        <p className="text-sm font-medium">
                                            No shifts found
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {debouncedSearch
                                                ? "Try a different search."
                                                : "Create your first shift to get started."}
                                        </p>
                                    </td>

                                </tr>

                            ) : (

                                shifts.map((shift) => (

                                    <tr
                                        key={shift.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >

                                        <td className="px-4 py-4">
                                            <p className="font-medium">
                                                {shift.name}
                                            </p>

                                            {shift.description && (
                                                <p className="mt-1 max-w-xs truncate text-sm text-muted-foreground">
                                                    {shift.description}
                                                </p>
                                            )}
                                        </td>


                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {shift.eventId}
                                        </td>


                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {formatDateTime(
                                                shift.startDateTime
                                            )}
                                        </td>


                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {formatDateTime(
                                                shift.endDateTime
                                            )}
                                        </td>


                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    shift.status
                                                )}`}
                                            >
                                                {
                                                    statusLabels[
                                                        shift.status
                                                    ]
                                                }
                                            </span>
                                        </td>


                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    shift.isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {shift.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>


                                        <td className="px-4 py-4">
                                            <ShiftActions
                                                shift={shift}
                                                onSuccess={() => {
                                                    queryClient.invalidateQueries({
                                                        queryKey: [
                                                            "shifts",
                                                        ],
                                                    });
                                                }}
                                            />
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


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

                        shifts

                    </p>


                    <div className="flex items-center gap-3">

                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(
                                    Number(value)
                                );

                                setPageNumber(1);
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


                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                pageNumber === 1
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


                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                            Page{" "}
                            {pageNumber} of{" "}
                            {totalPages || 1}
                        </span>


                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                totalPages === 0 ||
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

            </div>

        </div>
    );
}


/*
 * Helpers
 */

function formatDateTime(
    value: string
): string {
    return new Date(value).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
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
