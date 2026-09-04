"use client";

import Link from "next/link";
import { useState } from "react";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    Building2,
    ChevronLeft,
    ChevronRight,
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
    getOverallPayroll,
    type OverallPayroll,
} from "@/lib/api/payroll";
import { formatCurrency } from "@/lib/helpers/format-currency";


export function PayrollTable() {

    /* ---------------------------------------------------------------------- */
    /* State                                                                  */
    /* ---------------------------------------------------------------------- */

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");


    /* ---------------------------------------------------------------------- */
    /* Payroll                                                                */
    /* ---------------------------------------------------------------------- */

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({

        queryKey: [
            "overall-payroll",
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getOverallPayroll(
                pageNumber,
                pageSize,
                search.trim() ||
                    undefined
            ),

    });


    /* ---------------------------------------------------------------------- */
    /* Pagination                                                             */
    /* ---------------------------------------------------------------------- */

    const payroll =
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
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (

        <div className="space-y-4">

            {/* ---------------------------------------------------------------- */}
            {/* Search                                                            */}
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
                        Loading payroll...
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
                        Failed to load payroll.
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
                payroll.length > 0 && (

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
                                            Workers
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
                                            Events
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
                                            Generated Payroll
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
                                            Pending
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
                                            Approved
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
                                            Paid
                                        </th>

                                    </tr>

                                </thead>


                                {/* Body */}

                                <tbody>

                                    {payroll.map(
                                        (
                                            agency
                                        ) => (

                                            <PayrollRow
                                                key={
                                                    agency.agencyId
                                                }
                                                payroll={
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
                                            (
                                                page
                                            ) =>
                                                page -
                                                1
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
                                                disabled={
                                                    isFetching
                                                }
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
                                            (
                                                page
                                            ) =>
                                                page +
                                                1
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
                payroll.length === 0 && (

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
                            No payroll found
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
                                : "No agency payroll records are available yet."
                            }
                        </p>

                    </div>

                )}

        </div>

    );

}


/* ========================================================================== */
/* Payroll Row                                                                */
/* ========================================================================== */

type PayrollRowProps = {
    payroll: OverallPayroll;
};


function PayrollRow({
    payroll,
}: PayrollRowProps) {

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
                    href={`/payroll/agency/${payroll.agencyId}`}
                    className="
                        group
                        flex
                        items-center
                        gap-3
                    "
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
                            {payroll.agencyName}
                        </p>

                    </div>

                </Link>

            </td>


            {/* Workers */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {payroll.workersCount}
                </span>

            </td>


            {/* Events */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {payroll.eventsCount}
                </span>

            </td>


            {/* Generated Payroll */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        font-medium
                    "
                >
                    {payroll.generatedPayrollCount}
                </span>

            </td>


            {/* Pending */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {formatCurrency(
                        payroll.totalPendingPayrollAmount
                    )}
                </span>

            </td>


            {/* Approved */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {formatCurrency(
                        payroll.totalApprovedPayrollAmount
                    )}
                </span>

            </td>


            {/* Paid */}

            <td className="px-4 py-4">

                <span
                    className="
                        text-sm
                        text-muted-foreground
                    "
                >
                    {formatCurrency(
                        payroll.totalPaidPayrollAmount
                    )}
                </span>

            </td>

        </tr>

    );

}


/* ========================================================================== */
/* Currency Helper                                                            */
/* ========================================================================== */

