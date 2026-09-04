"use client";

import Link from "next/link";
import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    Button,
} from "@/components/ui/button";

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
    getAgenciesPaginated,
    type Agency,
} from "@/lib/api/agencies";

import {
    CURRENT_TENANT_ID,
} from "@/constants/tenant";

import { AgencyForm } from "./agency-form";
import { useAgencyStore } from "@/stores/agency-store";


export function AgencyTable() {

    const queryClient =
        useQueryClient();


    /* ---------------------------------------------------------------------- */
    /* State                                                                  */
    /* ---------------------------------------------------------------------- */

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [createOpen, setCreateOpen] =
        useState(false);


    /* ---------------------------------------------------------------------- */
    /* Agencies                                                               */
    /* ---------------------------------------------------------------------- */

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({

        queryKey: [
            "agencies",
            CURRENT_TENANT_ID,
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getAgenciesPaginated(
                {
                    pageNumber,
                    pageSize,
                    search:
                        search.trim() ||
                        undefined,
                }
            ),

    });


    /* ---------------------------------------------------------------------- */
    /* Pagination                                                             */
    /* ---------------------------------------------------------------------- */

    const agencies =
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
    /* Create                                                                  */
    /* ---------------------------------------------------------------------- */

    function handleCreateSuccess() {

        setCreateOpen(false);

        setPageNumber(1);

        queryClient.invalidateQueries({
            queryKey: [
                "agencies",
                CURRENT_TENANT_ID,
            ],
        });

    }


    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (

        <div className="space-y-4">

            {/* ---------------------------------------------------------------- */}
            {/* Search + Add Agency                                              */}
            {/* ---------------------------------------------------------------- */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                {/* Search */}

                <div
                    className="
                        relative
                        w-full
                        sm:max-w-sm
                    "
                >

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
                        placeholder="Search agencies..."
                        className="pl-9"
                    />

                </div>


                {/* Add Agency */}

                <Button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                >

                    <Plus className="mr-2 size-4" />

                    Add Agency

                </Button>

            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Loading                                                           */}
            {/* ---------------------------------------------------------------- */}

            {isLoading && (

                <div
                    className="
                        rounded-xl
                        border
                        p-10
                        text-center
                    "
                >

                    <p
                        className="
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Loading agencies...
                    </p>

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Error                                                             */}
            {/* ---------------------------------------------------------------- */}

            {isError && (

                <div
                    className="
                        rounded-xl
                        border
                        border-destructive/30
                        bg-destructive/5
                        p-4
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-destructive
                        "
                    >
                        Failed to load agencies.
                    </p>


                    {error instanceof Error && (

                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            {error.message}
                        </p>

                    )}

                </div>

            )}


            {/* ---------------------------------------------------------------- */}
            {/* Table                                                             */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                agencies.length > 0 && (

                    <div
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                        "
                    >

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                {/* Header */}

                                <thead
                                    className="
                                        border-b
                                        bg-muted/40
                                    "
                                >

                                    <tr>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            Agency
                                        </th>


                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            Contact
                                        </th>


                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            Phone
                                        </th>


                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                font-medium
                                                text-muted-foreground
                                            "
                                        >
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                {/* Body */}

                                <tbody>

                                    {agencies.map(
                                        (agency) => (

                                            <AgencyRow
                                                key={
                                                    agency.id
                                                }
                                                agency={
                                                    agency
                                                }
                                            />

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* ---------------------------------------------------- */}
                        {/* Pagination                                           */}
                        {/* ---------------------------------------------------- */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                border-t
                                px-4
                                py-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            {/* Left side */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        text-muted-foreground
                                    "
                                >

                                    Showing{" "}

                                    <span
                                        className="
                                            font-medium
                                            text-foreground
                                        "
                                    >
                                        {startItem}–
                                        {endItem}
                                    </span>

                                    {" "}of{" "}

                                    <span
                                        className="
                                            font-medium
                                            text-foreground
                                        "
                                    >
                                        {totalNumber}
                                    </span>

                                    {" "}agencies

                                </p>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className="
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        Rows per page
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

                                        <SelectTrigger
                                            className="w-[70px]"
                                        >
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

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                {/* Previous */}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        pageNumber ===
                                            1 ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPageNumber(
                                            (page) =>
                                                page - 1
                                        )
                                    }
                                >

                                    <ChevronLeft
                                        className="
                                            mr-1
                                            size-4
                                        "
                                    />

                                    Previous

                                </Button>


                                {/* Page numbers */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    {Array.from(
                                        {
                                            length:
                                                totalPages,
                                        },
                                        (
                                            _,
                                            index
                                        ) =>
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

                                    <ChevronRight
                                        className="
                                            ml-1
                                            size-4
                                        "
                                    />

                                </Button>

                            </div>

                        </div>

                    </div>

                )}


            {/* ---------------------------------------------------------------- */}
            {/* Empty State                                                      */}
            {/* ---------------------------------------------------------------- */}

            {!isLoading &&
                !isError &&
                agencies.length === 0 && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            p-10
                            text-center
                        "
                    >

                        <Building2
                            className="
                                mx-auto
                                size-10
                                text-muted-foreground
                            "
                        />


                        <h3
                            className="
                                mt-3
                                font-medium
                            "
                        >
                            No agencies found
                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-muted-foreground
                            "
                        >
                            {search
                                ? "Try adjusting your search."
                                : "Create an agency to start managing workers, clients, and events."
                            }
                        </p>


                        {!search && (

                            <Button
                                className="mt-4"
                                onClick={() =>
                                    setCreateOpen(
                                        true
                                    )
                                }
                            >

                                <Plus
                                    className="
                                        mr-2
                                        size-4
                                    "
                                />

                                Add Agency

                            </Button>

                        )}

                    </div>

                )}


            {/* ---------------------------------------------------------------- */}
            {/* Create Agency Dialog                                             */}
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
                            Add Agency
                        </DialogTitle>

                    </DialogHeader>


                    <AgencyForm
                        onSuccess={
                            handleCreateSuccess
                        }
                        onCancel={() =>
                            setCreateOpen(
                                false
                            )
                        }
                    />

                </DialogContent>

            </Dialog>

        </div>

    );

}


/* ========================================================================== */
/* Agency Row                                                                 */
/* ========================================================================== */

type AgencyRowProps = {
    agency: Agency;
};


function AgencyRow({
    agency,
}: AgencyRowProps) {
const setAgencyId = useAgencyStore(
    (state) => state.setAgencyId
);
    return (

        <tr
            className="
                border-b
                last:border-0
                transition-colors
                hover:bg-muted/40
            "
        >

            {/* Agency */}

            <td className="px-4 py-4">

                <Link
                    href={`/agencies/${agency.id}`}
                    className="
                        group
                        flex
                        items-center
                        gap-3
                    "
                    onClick={() => {
                        setAgencyId(agency.id);
                    }}
                >

                    <div
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-muted
                        "
                    >

                        <Building2
                            className="
                                size-4
                                text-muted-foreground
                            "
                        />

                    </div>


                    <div>

                        <p
                            className="
                                font-medium
                                group-hover:underline
                            "
                        >
                            {agency.name}
                        </p>


                        {agency.description && (

                            <p
                                className="
                                    mt-1
                                    max-w-xs
                                    truncate
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                {agency.description}
                            </p>

                        )}

                    </div>

                </Link>

            </td>


            {/* Contact */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {agency.email || "—"}
                </span>

            </td>


            {/* Phone */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {agency.phoneNumber || "—"}
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
                            agency.isActive
                                ? "bg-green-500/10 text-green-600"
                                : "bg-muted text-muted-foreground"
                        }
                    `}
                >
                    {agency.isActive
                        ? "Active"
                        : "Inactive"}
                </span>

            </td>

        </tr>

    );

}