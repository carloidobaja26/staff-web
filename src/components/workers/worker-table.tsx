"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { getWorkers } from "@/lib/api/workers";
import { WorkerDialog } from "./worker-dialog";
import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

export function WorkerTable() {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const {
        data: workers = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["workers"],
        queryFn: getWorkers,
    });

    /*
     * Search workers locally.
     */
    const filteredWorkers = useMemo(() => {
        const searchTerm = search
            .trim()
            .toLowerCase();

        if (!searchTerm) {
            return workers;
        }

        return workers.filter((worker) => {
            const fullName =
                `${worker.firstName} ${worker.lastName}`.toLowerCase();

            return (
                fullName.includes(searchTerm) ||
                worker.workerNumber
                    .toLowerCase()
                    .includes(searchTerm) ||
                worker.email
                    .toLowerCase()
                    .includes(searchTerm) ||
                worker.phoneNumber
                    ?.toLowerCase()
                    .includes(searchTerm)
            );
        });
    }, [workers, search]);

    /*
     * Total pages based on filtered results.
     */
    const totalNumber = filteredWorkers.length;

    const totalPages = Math.ceil(
        totalNumber / pageSize
    );

    /*
     * Current page workers.
     */
    const paginatedWorkers = useMemo(() => {
        const startIndex =
            (pageNumber - 1) * pageSize;

        const endIndex =
            startIndex + pageSize;

        return filteredWorkers.slice(
            startIndex,
            endIndex
        );
    }, [
        filteredWorkers,
        pageNumber,
        pageSize,
    ]);

    /*
     * Reset to page 1 when searching.
     */
    const handleSearchChange = (
        value: string
    ) => {
        setSearch(value);
        setPageNumber(1);
    };

    /*
     * Change page size.
     */
    const handlePageSizeChange = (
        value: string
    ) => {
        setPageSize(Number(value));
        setPageNumber(1);
    };

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) *
                    pageSize +
                1;

    const endItem =
        totalNumber === 0
            ? 0
            : Math.min(
                  pageNumber * pageSize,
                  totalNumber
              );

    /*
     * Loading.
     */
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search workers..."
                        value={search}
                        disabled
                        className="pl-9"
                    />
                </div>

                <div className="rounded-xl border bg-card p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading workers...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * Error.
     */
    if (isError) {
        return (
            <div className="space-y-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search workers..."
                        value={search}
                        onChange={(e) =>
                            handleSearchChange(
                                e.target.value
                            )
                        }
                        className="pl-9"
                    />
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center">
                    <p className="text-sm font-medium text-destructive">
                        Failed to load workers
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong while loading workers."}
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
            {/* Search + Add Worker */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search workers..."
                        value={search}
                        onChange={(e) =>
                            handleSearchChange(e.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                <WorkerDialog
                    onSuccess={() => {
                        queryClient.invalidateQueries({
                            queryKey: ["workers"],
                        });
                    }}
                />
            </div>

            {/* Empty */}
            {filteredWorkers.length === 0 ? (
                <div className="rounded-xl border bg-card">
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <Search className="mb-4 size-8 text-muted-foreground" />

                        {search ? (
                            <>
                                <h3 className="text-sm font-semibold">
                                    No workers found
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    No workers match
                                    your search.
                                </p>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() =>
                                        handleSearchChange(
                                            ""
                                        )
                                    }
                                >
                                    Clear Search
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-sm font-semibold">
                                    No workers yet
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Workers will appear
                                    here once they are
                                    added.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Worker
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Worker Number
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Email
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Birth Date
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
                                {paginatedWorkers.map(
                                    (worker) => (
                                        <tr
                                            key={
                                                worker.id
                                            }
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-4">
                                                <p className="font-medium">
                                                    {
                                                        worker.firstName
                                                    }{" "}
                                                    {
                                                        worker.lastName
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {
                                                    worker.workerNumber
                                                }
                                            </td>

                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {
                                                    worker.email
                                                }
                                            </td>

                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {worker.phoneNumber ||
                                                    "—"}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {worker.birthDate
                                                    ? new Date(
                                                          worker.birthDate
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        worker.isActive
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {worker.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                —
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                Showing{" "}
                                <span className="font-medium text-foreground">
                                    {startItem}–{endItem}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-foreground">
                                    {totalNumber}
                                </span>{" "}
                                workers
                            </p>

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

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    {
                                        length:
                                            totalPages,
                                    },
                                    (
                                        _,
                                        index
                                    ) =>
                                        index +
                                        1
                                ).map(
                                    (
                                        page
                                    ) => (
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
                                            onClick={() =>
                                                setPageNumber(
                                                    page
                                                )
                                            }
                                        >
                                            {
                                                page
                                            }
                                        </Button>
                                    )
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
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
            )}
        </div>
    );
}

