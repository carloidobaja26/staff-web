"use client";

import Link from "next/link";
import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Building2,
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
    getAgencyClientsPaginated
} from "@/lib/api/agencies";

import {
    Client,
    deleteClient,
} from "@/lib/api/clients";

import { ClientForm } from "@/components/clients/client-form";
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

type AgencyClientsProps = {
    agencyId: string;
};

export function AgencyClients({
    agencyId,
}: AgencyClientsProps) {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editClient, setEditClient] =
        useState<Client | null>(null);

    const [deleteClientTarget, setDeleteClientTarget] =
        useState<Client | null>(null);

    const [deleteError, setDeleteError] =
        useState<string | null>(null);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "agency-clients",
            agencyId,
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getAgencyClientsPaginated(
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

    const clients = data?.items ?? [];

    const totalNumber =
        data?.totalNumber ?? 0;

    const totalPages = Math.max(
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

    const endItem = Math.min(
        pageNumber * pageSize,
        totalNumber
    );

    function handleSearchChange(
        value: string
    ) {
        setSearch(value);
        setPageNumber(1);
    }

    function handlePageSizeChange(
        value: string
    ) {
        setPageSize(Number(value));
        setPageNumber(1);
    }

    function refreshClients() {
        queryClient.invalidateQueries({
            queryKey: [
                "agency-clients",
                agencyId,
            ],
        });
    }

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!deleteClientTarget) {
                throw new Error(
                    "No client selected."
                );
            }

            return deleteClient(
                deleteClientTarget.id
            );
        },

        onSuccess: async () => {
            setDeleteClientTarget(null);
            setDeleteError(null);

            await queryClient.invalidateQueries({
                queryKey: [
                    "agency-clients",
                    agencyId,
                ],
            });
        },

        onError: (error) => {
            setDeleteError(
                getApiErrorMessage(
                    error,
                    "Failed to delete client."
                )
            );
        },
    });

    function handleDelete() {
        setDeleteError(null);
        deleteMutation.mutate();
    }

    return (
        <div className="space-y-4">

            {/* Header / Search / Add */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

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
                        placeholder="Search clients..."
                        className="pl-9"
                    />

                </div>

                <Button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >
                    <Plus className="mr-2 size-4" />
                    Add Client
                </Button>

            </div>


            {/* Loading */}

            {isLoading && (
                <div className="rounded-lg border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading clients...
                    </p>
                </div>
            )}


            {/* Error */}

            {isError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                    <p className="text-sm font-medium text-destructive">
                        Failed to load clients.
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {getApiErrorMessage(
                            error,
                            "Unable to load agency clients."
                        )}
                    </p>

                </div>
            )}


            {/* Empty */}

            {!isLoading &&
                !isError &&
                clients.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center">

                        <Building2 className="mx-auto size-8 text-muted-foreground" />

                        <h3 className="mt-3 text-sm font-medium">
                            No clients found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            This agency does not have any
                            clients yet.
                        </p>

                    </div>
                )}


            {/* Table */}

            {!isLoading &&
                !isError &&
                clients.length > 0 && (
                    <div className="overflow-hidden rounded-lg border">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b bg-muted/40">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Client
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Email
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Phone
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

                                    {clients.map(
                                        (client :Client) => (
                                            <tr
                                                key={client.id}
                                                className="
                                                    border-b
                                                    last:border-0
                                                    transition-colors
                                                    hover:bg-muted/40
                                                "
                                            >

                                                {/* Client */}

                                                <td className="px-4 py-4">

                                                    <Link
                                                        href={`/clients/${client.id}`}
                                                        className="
                                                            group
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">

                                                            <Building2 className="size-4 text-muted-foreground" />

                                                        </div>

                                                        <div>

                                                            <p className="font-medium group-hover:underline">
                                                                {client.name}
                                                            </p>
                                                        </div>

                                                    </Link>

                                                </td>


                                                {/* Email */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">
                                                        {client.email || "—"}
                                                    </span>

                                                </td>


                                                {/* Phone */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">
                                                        {client.phoneNumber || "—"}
                                                    </span>

                                                </td>


                                                {/* Status */}

                                                <td className="px-4 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            ${
                                                                client.isActive
                                                                    ? "bg-green-500/10 text-green-600"
                                                                    : "bg-muted text-muted-foreground"
                                                            }
                                                        `}
                                                    >
                                                        {client.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td className="px-4 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setEditClient(
                                                                    client
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 size-4" />
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => {
                                                                setDeleteError(null);
                                                                setDeleteClientTarget(
                                                                    client
                                                                );
                                                            }}
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


                                <div className="flex items-center gap-1">

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        (page) => (
                                            <Button
                                                key={page}
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


            {/* Create Client */}

            <Dialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Client
                        </DialogTitle>

                    </DialogHeader>

                    <ClientForm
                        agencyId={agencyId}
                        onSuccess={() => {
                            setCreateOpen(false);
                            setPageNumber(1);
                            refreshClients();
                        }}
                        onCancel={() =>
                            setCreateOpen(false)
                        }
                    />

                </DialogContent>

            </Dialog>


            {/* Edit Client */}

            <Dialog
                open={!!editClient}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditClient(null);
                    }
                }}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Edit Client
                        </DialogTitle>

                    </DialogHeader>

                    {editClient && (
                        <ClientForm
                            client={editClient}
                            agencyId={agencyId}
                            onSuccess={() => {
                                setEditClient(null);
                                refreshClients();
                            }}
                            onCancel={() =>
                                setEditClient(null)
                            }
                        />
                    )}

                </DialogContent>

            </Dialog>


            {/* Delete Client */}

            {deleteClientTarget && (
                <DeleteClientDialog
                    client={deleteClientTarget}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeleteClientTarget(null);
                        }
                    }}
                />
            )}

        </div>
    );
}
