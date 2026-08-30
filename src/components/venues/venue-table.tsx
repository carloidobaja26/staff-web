"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { getVenues } from "@/lib/api/venues";
import { VenueDialog } from "./venue-dialog";
import { VenueActions } from "./venue-actions";


export function VenueTable() {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");


    /* =========================
       Search Debounce
    ========================= */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPageNumber(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    /* =========================
       Get Venues
    ========================= */

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "venues",
            pageNumber,
            pageSize,
            debouncedSearch,
        ],
        queryFn: () =>
            getVenues(
                pageNumber,
                pageSize,
                debouncedSearch
            ),
    });


    const venues = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;

    const totalPages =
        Math.ceil(totalNumber / pageSize);


    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) * pageSize + 1;

    const endItem = Math.min(
        pageNumber * pageSize,
        totalNumber
    );


    /* =========================
       Loading
    ========================= */

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Loading venues...
                </p>
            </div>
        );
    }


    /* =========================
       Error
    ========================= */

    if (isError) {
        return (
            <div className="space-y-4">

                <div className="flex items-center justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search venues..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="pl-9"
                        />
                    </div>

                    <VenueDialog
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["venues"],
                            });
                        }}
                    />
                </div>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load venues
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong while loading venues."}
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


    return (
        <div className="space-y-4">

            {/* Search + Add Venue */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Search */}
                <div className="relative w-full sm:max-w-sm">

                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search venues..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="pl-9"
                    />

                </div>


                {/* Add Venue */}
                <VenueDialog
                    onSuccess={() => {
                        queryClient.invalidateQueries({
                            queryKey: ["venues"],
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
                                    Venue Name
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    City
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Province
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Contact Person
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Contact Number
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Address
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Action
                                </th>

                            </tr>
                        </thead>


                        <tbody className="divide-y">

                            {venues.map((venue) => (
                                <tr
                                    key={venue.id}
                                    className="transition-colors hover:bg-muted/30"
                                >

                                    {/* Name */}
                                    <td className="px-4 py-4">
                                        <p className="font-medium">
                                            {venue.name}
                                        </p>
                                    </td>


                                    {/* City */}
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {venue.city || "—"}
                                    </td>


                                    {/* Province */}
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {venue.province || "—"}
                                    </td>


                                    {/* Contact Person */}
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {venue.contactPerson || "—"}
                                    </td>


                                    {/* Contact Number */}
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {venue.contactNumber || "—"}
                                    </td>


                                    {/* Address */}
                                    <td className="max-w-xs px-4 py-4 text-sm text-muted-foreground">
                                        <span className="line-clamp-2">
                                            {venue.address || "—"}
                                        </span>
                                    </td>


                                    {/* Status */}
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                venue.isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {venue.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>


                                    {/* Actions */}
                                    <td className="px-4 py-4">
                                        <VenueActions
                                            venue={venue}
                                            onSuccess={() => {
                                                queryClient.invalidateQueries({
                                                    queryKey: ["venues"],
                                                });
                                            }}
                                        />
                                    </td>

                                </tr>
                            ))}


                            {/* Empty State */}
                            {venues.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-12 text-center"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                No venues found
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {debouncedSearch
                                                    ? "Try adjusting your search."
                                                    : "Add your first venue to get started."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
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
                        venues
                    </p>


                    <div className="flex items-center gap-3">

                        {/* Page Size */}
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
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


                        {/* Previous */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pageNumber === 1}
                            onClick={() =>
                                setPageNumber(
                                    (page) => page - 1
                                )
                            }
                        >
                            Previous
                        </Button>


                        {/* Page Number */}
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                            Page{" "}
                            <span className="font-medium text-foreground">
                                {pageNumber}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-foreground">
                                {totalPages || 1}
                            </span>
                        </span>


                        {/* Next */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                pageNumber >= totalPages ||
                                totalPages === 0
                            }
                            onClick={() =>
                                setPageNumber(
                                    (page) => page + 1
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

