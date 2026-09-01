"use client";

import Link from "next/link";
import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
    Pencil,
} from "lucide-react";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    getAgencyWorkersPaginated,
} from "@/lib/api/agencies";

import {
    deleteWorker,
    type Worker,
} from "@/lib/api/workers";

import {
    AgencyWorkerForm,
} from "./agency-worker-form";


type AgencyWorkersProps = {
    agencyId: string;
};


export function AgencyWorkers({
    agencyId,
}: AgencyWorkersProps) {

    const queryClient =
        useQueryClient();


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


    const [
        editingWorker,
        setEditingWorker,
    ] = useState<Worker | null>(null);


    const [
        deletingWorker,
        setDeletingWorker,
    ] = useState<Worker | null>(null);


    /*
     * ----------------------------------------------------------------------
     * Workers
     * ----------------------------------------------------------------------
     */

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useQuery({

        queryKey: [
            "agency-workers",
            agencyId,
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getAgencyWorkersPaginated(
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


    const workers =
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
            pageNumber * pageSize,
            totalNumber
        );


    /*
     * ----------------------------------------------------------------------
     * Search
     * ----------------------------------------------------------------------
     */

    function handleSearchChange(
        value: string
    ) {

        setSearch(value);

        setPageNumber(1);

    }


    /*
     * ----------------------------------------------------------------------
     * Delete
     * ----------------------------------------------------------------------
     */

    const deleteMutation =
        useMutation({

            mutationFn: async (
                workerId: string
            ) => {

                await deleteWorker(
                    workerId
                );

            },

            onSuccess: async () => {

                setDeletingWorker(
                    null
                );

                await queryClient.invalidateQueries({
                    queryKey: [
                        "agency-workers",
                        agencyId,
                    ],
                });

            },

        });


    /*
     * ----------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------
     */

    return (
        <div className="space-y-4">

            {/* ---------------------------------------------------------------- */}
            {/* Header */}
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
                        placeholder="Search workers..."
                        className="pl-9"
                    />

                </div>


                {/* Add Worker */}

                <Button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >

                    <Plus className="mr-2 size-4" />

                    Add Worker

                </Button>

            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Loading */}
            {/* ---------------------------------------------------------------- */}

            {isLoading && (

                <div className="rounded-lg border p-8 text-center">

                    <p className="text-sm text-muted-foreground">
                        Loading workers...
                    </p>

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Error */}
            {/* ---------------------------------------------------------------- */}

            {isError && (

                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                    <p className="text-sm font-medium text-destructive">
                        Failed to load workers.
                    </p>

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Empty */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                workers.length === 0 && (

                    <div className="rounded-lg border border-dashed p-8 text-center">

                        <Users className="mx-auto size-8 text-muted-foreground" />

                        <h3 className="mt-3 text-sm font-medium">
                            No workers found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {search
                                ? "No workers match your search."
                                : "This agency does not have any workers yet."}
                        </p>

                    </div>

                )}


            {/* ---------------------------------------------------------------- */}
            {/* Table */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                workers.length > 0 && (

                    <div className="overflow-hidden rounded-lg border">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b bg-muted/40">

                                    <tr>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Worker
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

                                        <th className="w-[60px] px-4 py-3" />

                                    </tr>

                                </thead>


                                <tbody>

                                    {workers.map(
                                        (worker) => (

                                            <tr
                                                key={
                                                    worker.id
                                                }
                                                className="
                                                    border-b
                                                    last:border-0
                                                    transition-colors
                                                    hover:bg-muted/40
                                                "
                                            >

                                                {/* Worker */}

                                                <td className="px-4 py-4">

                                                    <Link
                                                        href={`/workers/${worker.id}`}
                                                        className="font-medium hover:underline"
                                                    >

                                                        {
                                                            worker.firstName
                                                        }{" "}

                                                        {
                                                            worker.lastName
                                                        }

                                                    </Link>


                                                    <p className="mt-1 text-xs text-muted-foreground">

                                                        {
                                                            worker.workerNumber
                                                        }

                                                    </p>

                                                </td>


                                                {/* Email */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">

                                                        {
                                                            worker.email ||
                                                            "—"
                                                        }

                                                    </span>

                                                </td>


                                                {/* Phone */}

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-muted-foreground">

                                                        {
                                                            worker.phoneNumber ||
                                                            "—"
                                                        }

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
                                                                worker.isActive
                                                                    ? "bg-green-500/10 text-green-600"
                                                                    : "bg-muted text-muted-foreground"
                                                            }
                                                        `}
                                                    >

                                                        {
                                                            worker.isActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }

                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td className="px-4 py-4">

                                                    <DropdownMenu>

                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >

                                                                <MoreHorizontal className="size-4" />

                                                                <span className="sr-only">
                                                                    Open worker actions
                                                                </span>

                                                            </Button>

                                                        </DropdownMenuTrigger>


                                                        <DropdownMenuContent align="end">

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setEditingWorker(
                                                                        worker
                                                                    )
                                                                }
                                                            >

                                                                <Pencil className="mr-2 size-4" />

                                                                Edit

                                                            </DropdownMenuItem>


                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    setDeletingWorker(
                                                                        worker
                                                                    )
                                                                }
                                                            >

                                                                <Trash2 className="mr-2 size-4" />

                                                                Delete

                                                            </DropdownMenuItem>

                                                        </DropdownMenuContent>

                                                    </DropdownMenu>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* ---------------------------------------------------------------- */}
                        {/* Pagination */}
                        {/* ---------------------------------------------------------------- */}

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

                                    workers

                                </p>


                                <div className="flex items-center gap-2">

                                    <span className="text-sm text-muted-foreground">

                                        Rows per page

                                    </span>


                                    <Select
                                        value={String(pageSize)}
                                        onValueChange={(value) => {

                                            setPageSize(
                                                Number(value)
                                            );

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
            {/* Add Worker Dialog */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={createOpen}
                onOpenChange={
                    setCreateOpen
                }
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Add Worker
                        </DialogTitle>

                    </DialogHeader>


                    <AgencyWorkerForm
                        agencyId={
                            agencyId
                        }
                        onSuccess={async () => {

                            setCreateOpen(
                                false
                            );

                            await queryClient.invalidateQueries({
                                queryKey: [
                                    "agency-workers",
                                    agencyId,
                                ],
                            });

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
            {/* Edit Worker Dialog */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={
                    !!editingWorker
                }
                onOpenChange={(open) => {

                    if (!open) {
                        setEditingWorker(
                            null
                        );
                    }

                }}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Edit Worker
                        </DialogTitle>

                    </DialogHeader>


                    {editingWorker && (

                        <AgencyWorkerForm
                            agencyId={
                                agencyId
                            }
                            worker={
                                editingWorker
                            }
                            onSuccess={async () => {

                                setEditingWorker(
                                    null
                                );

                                await queryClient.invalidateQueries({
                                    queryKey: [
                                        "agency-workers",
                                        agencyId,
                                    ],
                                });

                            }}
                            onCancel={() =>
                                setEditingWorker(
                                    null
                                )
                            }
                        />

                    )}

                </DialogContent>

            </Dialog>


            {/* ---------------------------------------------------------------- */}
            {/* Delete Worker Dialog */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={
                    !!deletingWorker
                }
                onOpenChange={(open) => {

                    if (
                        !open &&
                        !deleteMutation.isPending
                    ) {

                        setDeletingWorker(
                            null
                        );

                    }

                }}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Delete Worker
                        </DialogTitle>

                    </DialogHeader>


                    {deletingWorker && (

                        <div className="space-y-5">

                            <p className="text-sm text-muted-foreground">

                                Are you sure you want to delete{" "}

                                <span className="font-medium text-foreground">

                                    {
                                        deletingWorker.firstName
                                    }{" "}

                                    {
                                        deletingWorker.lastName
                                    }

                                </span>

                                ?

                                This action cannot be undone.

                            </p>


                            {deleteMutation.isError && (

                                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">

                                    <p className="text-sm text-destructive">

                                        Failed to delete worker.
                                        Please try again.

                                    </p>

                                </div>

                            )}


                            <div className="flex justify-end gap-2 border-t pt-4">

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        deleteMutation.isPending
                                    }
                                    onClick={() =>
                                        setDeletingWorker(
                                            null
                                        )
                                    }
                                >

                                    Cancel

                                </Button>


                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={
                                        deleteMutation.isPending
                                    }
                                    onClick={() =>
                                        deleteMutation.mutate(
                                            deletingWorker.id
                                        )
                                    }
                                >

                                    {deleteMutation.isPending
                                        ? "Deleting..."
                                        : "Delete Worker"}

                                </Button>

                            </div>

                        </div>

                    )}

                </DialogContent>

            </Dialog>

        </div>
    );
}