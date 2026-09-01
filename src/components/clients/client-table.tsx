
"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getClients } from "@/lib/api/clients";
import { ClientDialog } from "./client-dialog";
import { ClientActions } from "./client-actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export function ClientTable() {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [pageSize, setPageSize] = useState(10);

    /*
     * Debounce search.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPageNumber(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    /*
     * Get clients.
     */
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "clients",
            pageNumber,
            pageSize,
            debouncedSearch,
        ],
        queryFn: () =>
            getClients(
                pageNumber,
                pageSize,
                debouncedSearch
            ),
    });

    const clients = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;

    const totalPages = Math.ceil(
        totalNumber / pageSize
    );

    /*
     * If deleting/updating data causes the current page
     * to no longer exist, move to the last valid page.
     */
    useEffect(() => {
        if (
            data &&
            totalPages > 0 &&
            pageNumber > totalPages
        ) {
            setPageNumber(totalPages);
        }
    }, [data, pageNumber, totalPages]);

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) * pageSize + 1;

    const endItem =
        totalNumber === 0
            ? 0
            : Math.min(
                pageNumber * pageSize,
                totalNumber
            );

    const isSearching = debouncedSearch.length > 0;

    /*
     * Refresh client list after create/update/delete.
     */
    const handleClientMutationSuccess = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["clients"],
        });
    };

    /*
     * Initial loading.
     */
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search clients..."
                            value=""
                            disabled
                            className="pl-9"
                        />
                    </div>

                    <ClientDialog
                        onSuccess={handleClientMutationSuccess}
                    />
                </div>

                <div className="rounded-xl border bg-card p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading clients...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * Loading error.
     */
    if (isError) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="pl-9"
                        />
                    </div>

                    <ClientDialog
                        onSuccess={
                            handleClientMutationSuccess
                        }
                    />
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center">
                    <p className="text-sm font-medium text-destructive">
                        Failed to load clients
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong while loading clients."}
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
            {/* Search + Add Client */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                <ClientDialog
                    onSuccess={
                        handleClientMutationSuccess
                    }
                />
            </div>

            {/* Empty State */}
            {clients.length === 0 ? (
                <div className="rounded-xl border bg-card">
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                            <Search className="size-5 text-muted-foreground" />
                        </div>

                        {isSearching ? (
                            <>
                                <h3 className="text-sm font-semibold">
                                    No clients found
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    No clients match{" "}
                                    <span className="font-medium text-foreground">
                                        "{debouncedSearch}"
                                    </span>
                                    .
                                </p>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-sm font-semibold">
                                    No clients yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    You haven't added any
                                    clients yet. Use the{" "}
                                    <span className="font-medium text-foreground">
                                        Add Client
                                    </span>{" "}
                                    button above to get started.
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
                                        Client Name
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Company Name
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Contact Person
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Email
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Client Number
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Notes
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
                                {clients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium">
                                                {client.name}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {client.companyName ||
                                                "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {client.contactPerson ||
                                                "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {client.email ||
                                                "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {client.phoneNumber ||
                                                "—"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {client.clientNumber}
                                        </td>

                                        <td className="max-w-xs px-4 py-4 text-sm text-muted-foreground">
                                            <p className="truncate">
                                                {client.notes ||
                                                    "—"}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${client.isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {client.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <ClientActions
                                                client={client}
                                                onSuccess={
                                                    handleClientMutationSuccess
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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
                                clients
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Rows per page
                                </span>

                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value));
                                        setPageNumber(1);
                                    }}
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
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    pageNumber === 1 ||
                                    isFetching
                                }
                                onClick={() =>
                                    setPageNumber(
                                        (page) => page - 1
                                    )
                                }
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            pageNumber === page
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        disabled={isFetching}
                                        onClick={() =>
                                            setPageNumber(page)
                                        }
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    pageNumber >= totalPages ||
                                    isFetching
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
            )}

            {/* Background refetch indicator */}
            {isFetching && !isLoading && (
                <p className="text-center text-xs text-muted-foreground">
                    Updating clients...
                </p>
            )}
        </div>
    );
}

