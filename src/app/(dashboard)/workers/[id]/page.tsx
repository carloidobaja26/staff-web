"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    CalendarDays,
    Eye,
    Hash,
    Mail,
    Pencil,
    Phone,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getWorker } from "@/lib/api/workers";
import {
    getWorkerAttendancePaginated,
    Attendance,
    AttendanceStatus,
} from "@/lib/api/attendance";

import { WorkerDialog } from "@/components/workers/worker-dialog";
import { formatDateTime } from "@/components/shifts/helpers/booking-helpers";
import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { GeneratePayrollButton } from "@/components/payroll/generate-payroll-button";

export default function WorkerDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const workerId = params.id as string;

    const [editOpen, setEditOpen] = useState(false);

    const [attendancePageNumber, setAttendancePageNumber] = useState(1);
    const [attendancePageSize, setAttendancePageSize] = useState(10);
    const [attendanceSearch, setAttendanceSearch] = useState("");
    const [debouncedAttendanceSearch, setDebouncedAttendanceSearch] =
        useState("");

    const queryClient = useQueryClient();

    /*
     * Worker
     */
    const {
        data: worker,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["worker", workerId],
        queryFn: () => getWorker(workerId),
        enabled: !!workerId,
    });

    /*
     * Attendance search debounce
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedAttendanceSearch(attendanceSearch);
            setAttendancePageNumber(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [attendanceSearch]);

    /*
     * Attendance
     */
    const {
        data: attendanceData,
        isLoading: attendanceLoading,
        isError: attendanceError,
    } = useQuery({
        queryKey: [
            "worker-attendance",
            workerId,
            attendancePageNumber,
            attendancePageSize,
            debouncedAttendanceSearch,
        ],
        queryFn: () =>
            getWorkerAttendancePaginated(workerId, {
                pageNumber: attendancePageNumber,
                pageSize: attendancePageSize,
                search: debouncedAttendanceSearch,
            }),
        enabled: !!workerId,
    });

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8">
                <p className="text-sm text-muted-foreground">
                    Loading worker...
                </p>
            </div>
        );
    }

    if (isError || !worker) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href="/workers">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Workers
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load worker
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The worker could not be loaded."}
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

    const fullName = `${worker.firstName} ${worker.lastName}`;

    const attendance = attendanceData?.items ?? [];
    const attendanceTotal = attendanceData?.totalNumber ?? 0;

    const attendanceTotalPages =
        attendancePageSize > 0
            ? Math.ceil(
                  attendanceTotal / attendancePageSize
              )
            : 0;

    return (
        <div className="space-y-6">
            {/* Page Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                >
                    <Link href="/workers">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Workers
                    </Link>
                </Button>

                <Button
                    type="button"
                    onClick={() => setEditOpen(true)}
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Worker
                </Button>
            </div>

            {/* Worker Header */}
            <div className="rounded-xl border bg-card p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {fullName}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Worker Number: {worker.workerNumber}
                        </p>
                    </div>

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
                </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-xl border bg-card">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Basic information about this worker.
                    </p>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <DetailItem
                        icon={Hash}
                        label="Worker Number"
                        value={worker.workerNumber}
                    />

                    <DetailItem
                        icon={Mail}
                        label="Email"
                        value={worker.email}
                    />

                    <DetailItem
                        icon={Phone}
                        label="Phone Number"
                        value={worker.phoneNumber}
                    />

                    <DetailItem
                        icon={CalendarDays}
                        label="Birth Date"
                        value={
                            worker.birthDate
                                ? new Date(
                                      worker.birthDate
                                  ).toLocaleDateString()
                                : null
                        }
                    />
                </div>
            </div>

            {/* Attendance */}
            <div className="rounded-xl border bg-card">
                <div className="border-b px-6 py-4">
                    <div>
                        <h2 className="font-semibold">
                            Attendance
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Attendance records for this worker.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="border-b px-6 py-4">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={attendanceSearch}
                            onChange={(event) =>
                                setAttendanceSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search attendance..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-6 py-3 text-left font-medium">
                                    Shift Name
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Shift Role Name
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Check In
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Check Out
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Status
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Remarks
                                </th>

                                <th className="px-6 py-3 text-left font-medium">
                                    Payroll
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendanceLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : attendanceError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-10 text-center text-destructive"
                                    >
                                        Failed to load attendance.
                                    </td>
                                </tr>
                            ) : attendance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendance.map(
                                    (item: Attendance) => (
                                        <AttendanceRow
                                            key={item.id}
                                            attendance={item}
                                            onViewPayroll={(payrollId) =>
                                                router.push(
                                                    `/payroll/${payrollId}`
                                                )
                                            }
                                            onPayrollGenerated={() => {
                                                queryClient.invalidateQueries(
                                                    {
                                                        queryKey: [
                                                            "worker-attendance",
                                                            workerId,
                                                        ],
                                                    }
                                                );
                                            }}
                                        />
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {attendanceTotal === 0
                            ? "No records"
                            : `Showing ${
                                  (attendancePageNumber - 1) *
                                      attendancePageSize +
                                  1
                              }–${Math.min(
                                  attendancePageNumber *
                                      attendancePageSize,
                                  attendanceTotal
                              )} of ${attendanceTotal}`}
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={attendancePageSize}
                            onChange={(event) => {
                                setAttendancePageSize(
                                    Number(event.target.value)
                                );
                                setAttendancePageNumber(1);
                            }}
                            className="h-9 rounded-md border bg-background px-2 text-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                attendancePageNumber <= 1 ||
                                attendanceLoading
                            }
                            onClick={() =>
                                setAttendancePageNumber(
                                    (page) => page - 1
                                )
                            }
                        >
                            Previous
                        </Button>

                        <span className="min-w-[80px] text-center text-sm">
                            Page {attendancePageNumber}
                            {attendanceTotalPages > 0 &&
                                ` of ${attendanceTotalPages}`}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={
                                attendancePageNumber >=
                                    attendanceTotalPages ||
                                attendanceTotalPages === 0 ||
                                attendanceLoading
                            }
                            onClick={() =>
                                setAttendancePageNumber(
                                    (page) => page + 1
                                )
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Worker Dialog */}
            <WorkerDialog
                worker={worker}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "worker",
                            workerId,
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["workers"],
                    });
                }}
            />
        </div>
    );
}

type AttendanceRowProps = {
    attendance: Attendance;
    onViewPayroll: (payrollId: string) => void;
    onPayrollGenerated: () => void;
};

function AttendanceRow({
    attendance,
    onViewPayroll,
    onPayrollGenerated,
}: AttendanceRowProps) {
    return (
        <tr className="border-b last:border-0">
            <td className="px-6 py-4 font-medium">
                {attendance.shiftName}
            </td>

            <td className="px-6 py-4 font-medium">
                {attendance.shiftRoleName}
            </td>

            <td className="px-6 py-4">
                {formatDateTime(
                    attendance.checkInTime
                )}
            </td>

            <td className="px-6 py-4">
                {formatDateTime(
                    attendance.checkOutTime
                )}
            </td>

            <td className="px-6 py-4">
                <AttendanceStatusBadge
                    status={attendance.status}
                />
            </td>

            <td className="max-w-[300px] truncate px-6 py-4 text-muted-foreground">
                {attendance.remarks || "—"}
            </td>

            <td className="px-6 py-4">
                {attendance.payrollId ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onViewPayroll(
                                attendance.payrollId!
                            )
                        }
                    >
                        <Eye className="mr-2 size-4" />
                        View Payroll
                    </Button>
                ) : attendance.status ===
                  AttendanceStatus.Absent ? (
                    <span className="text-sm text-muted-foreground">
                        Not Eligible
                    </span>
                ) : (
                    <GeneratePayrollButton
                        attendanceId={attendance.id}
                        onSuccess={onPayrollGenerated}
                    />
                )}
            </td>
        </tr>
    );
}

type DetailItemProps = {
    icon: React.ElementType;
    label: string;
    value?: string | null;
};

function DetailItem({
    icon: Icon,
    label,
    value,
}: DetailItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2">
                <Icon className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 break-words font-medium">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}