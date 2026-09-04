"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    getAgencyPayrollPaged,
    type AgencyPayrollRecord,
} from "@/lib/api/payroll";
import { PayrollStatusBadge } from "./payroll-status-badge";
import { formatCurrency } from "@/lib/helpers/format-currency";
import { ApprovePayrollButton } from "./approve-payroll-button";

type PayrollAgencyTableProps = {
    agencyId: string;
};

export function PayrollAgencyTable({
    agencyId,
}: PayrollAgencyTableProps) {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "agency-payroll",
            agencyId,
            pageNumber,
            pageSize,
            search,
        ],
        queryFn: () =>
            getAgencyPayrollPaged(
                agencyId,
                pageNumber,
                pageSize,
                search.trim() || undefined
            ),
        enabled: !!agencyId,
    });

    const payroll = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;

    const totalPages = Math.max(
        1,
        Math.ceil(totalNumber / pageSize)
    );

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) * pageSize + 1;

    const endItem = Math.min(
        pageNumber * pageSize,
        totalNumber
    );

    function handleSearchChange(value: string) {
        setSearch(value);
        setPageNumber(1);
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search payroll..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="rounded-xl border p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading payroll...
                    </p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">
                        Failed to load payroll.
                    </p>

                    {error instanceof Error && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {error.message}
                        </p>
                    )}
                </div>
            )}

            {/* Table */}
            {!isLoading &&
                !isError &&
                payroll.length > 0 && (
                    <div className="overflow-hidden rounded-xl border">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Worker
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Event
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Shift
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Net Pay
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payroll.map((payroll) => (
                                        <PayrollRow
                                            key={payroll.id}
                                            payroll={payroll}
                                            queryClient={queryClient}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
                                    payroll records
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
                                            (page) => page - 1
                                        )
                                    }
                                >
                                    <ChevronLeft className="mr-1 size-4" />
                                    Previous
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
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
                                                setPageNumber(
                                                    page
                                                )
                                            }
                                        >
                                            {page}
                                        </Button>
                                    ))}
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
                                            (page) => page + 1
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

            {/* Empty */}
            {!isLoading &&
                !isError &&
                payroll.length === 0 && (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <h3 className="font-medium">
                            No payroll found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {search
                                ? "Try adjusting your search."
                                : "No payroll records are available for this agency."}
                        </p>
                    </div>
                )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Payroll Row                                                                */
/* -------------------------------------------------------------------------- */

type PayrollRowProps = {
    payroll: AgencyPayrollRecord;
    queryClient: ReturnType<typeof useQueryClient>;
};

function PayrollRow({
    payroll,
    queryClient,
}: PayrollRowProps) {
    return (
        <tr className="border-b last:border-0 transition-colors hover:bg-muted/40">
            <td className="px-4 py-4">
                <Link
                    href={`/workers/${payroll.workerId}`}
                    className="font-medium hover:underline"
                >
                    {payroll.workerName}
                </Link>
            </td>

            <td className="px-4 py-4">
                <Link
                    href={`/events/${payroll.eventId}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                    {payroll.eventName}
                </Link>
            </td>

            <td className="px-4 py-4">
                <Link
                    href={`/shifts/${payroll.shiftId}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                    {payroll.shiftName}
                </Link>
            </td>


            <td className="px-4 py-4">
                <span className="text-sm font-medium">
                    {formatCurrency(payroll.netPay)}
                </span>
            </td>

            <td className="px-4 py-4">
                <PayrollStatusBadge
                    status={payroll.status}
                />
            </td>

            <td className="px-4 py-4 text-center">
                <div className="flex justify-center">
                    <PayrollAction
                        payroll={payroll}
                        queryClient={queryClient}
                    />
                </div>
            </td>
        </tr>
    );
}

/* -------------------------------------------------------------------------- */
/* Payroll Action                                                             */
/* -------------------------------------------------------------------------- */

function PayrollAction({
    payroll,
    queryClient,
}: {
    payroll: AgencyPayrollRecord;
    queryClient: ReturnType<typeof useQueryClient>;
}) {
    // Pending
    if (payroll.status === 1) {
        return (
            <ApprovePayrollButton
                payrollId={payroll.id}
                onSuccess={async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ["agency-payroll"],
                    });
                }}
            />
        );
    }

    // Approved / Paid
    return (
        <Link href={`/payroll/${payroll.id}`}>
            <Button
                size="sm"
                variant="outline"
            >
                View
            </Button>
        </Link>
    );
}
