"use client";

import { useMemo, useState } from "react";

import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Eye,
    LogIn,
    LogOut,
    UserX,
    Users,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
    getShiftRoles,
    type ShiftRole,
} from "@/lib/api/shift-roles";

import {
    getBookingsByShiftRoleConfirm,
    type Booking,
} from "@/lib/api/bookings";

import {
    checkInAttendance,
    checkOutAttendance,
    markAbsentAttendance,
    getAttendanceByBooking,
    type Attendance,
    AttendanceStatus,
} from "@/lib/api/attendance";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

import {
    canCheckIn,
    canCheckOut,
    canMarkAbsent,
    formatAttendanceDateTime,
} from "@/components/shifts/helpers/attendance-helpers";

import { CURRENT_USER_ID } from "@/constants/tenant";

import {
    AttendanceStatusBadge,
} from "@/components/shifts/helpers/shift-attendance";

import { GeneratePayrollButton } from "../payroll/generate-payroll-button";

type ShiftAttendanceProps = {
    shiftId: string;
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type AttendanceAction =
    | "checkin"
    | "checkout"
    | "absent"
    | null;

type SelectedWorker = {
    booking: Booking;
    attendance: Attendance | null;
    role: ShiftRole;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ShiftAttendance({
    shiftId,
}: ShiftAttendanceProps) {
    const queryClient = useQueryClient();
    const router = useRouter();

    /* ---------------------------------------------------------------------- */
    /* Action State                                                            */
    /* ---------------------------------------------------------------------- */

    const [action, setAction] =
        useState<AttendanceAction>(null);

    const [selectedWorker, setSelectedWorker] =
        useState<SelectedWorker | null>(null);

    const [remarks, setRemarks] = useState("");

    const [actionError, setActionError] =
        useState<string | null>(null);

    /* ---------------------------------------------------------------------- */
    /* Shift Roles                                                             */
    /* ---------------------------------------------------------------------- */

    const {
        data: roles = [],
        isLoading: isLoadingRoles,
        isError: isRolesError,
        error: rolesError,
    } = useQuery({
        queryKey: [
            "shift-roles",
            shiftId,
        ],

        queryFn: () =>
            getShiftRoles(shiftId),

        enabled: !!shiftId,
    });

    /* ---------------------------------------------------------------------- */
    /* Confirmed Bookings                                                      */
    /* ---------------------------------------------------------------------- */

    const bookingQueries = useQueries({
        queries: roles.map((role) => ({
            queryKey: [
                "shift-role-bookings-confirm",
                role.id,
            ],

            queryFn: () =>
                getBookingsByShiftRoleConfirm(
                    role.id
                ),

            enabled: !!role.id,
        })),
    });

    const isLoadingBookings =
        bookingQueries.some(
            (query) => query.isLoading
        );

    const bookingError =
        bookingQueries.find(
            (query) => query.isError
        )?.error;

    /* ---------------------------------------------------------------------- */
    /* Flatten Confirmed Bookings                                              */
    /* ---------------------------------------------------------------------- */

    const workers = useMemo(() => {
        const result: SelectedWorker[] = [];

        roles.forEach(
            (role, roleIndex) => {
                const bookings =
                    bookingQueries[
                        roleIndex
                    ]?.data ?? [];

                bookings.forEach(
                    (booking) => {
                        result.push({
                            booking,
                            attendance: null,
                            role,
                        });
                    }
                );
            }
        );

        return result;
    }, [
        roles,
        bookingQueries,
    ]);

    /* ---------------------------------------------------------------------- */
    /* Attendance Records                                                      */
    /* ---------------------------------------------------------------------- */

    const attendanceQueries = useQueries({
        queries: workers.map((worker) => ({
            queryKey: [
                "booking-attendance",
                worker.booking.id,
            ],

            queryFn: async () => {
                try {
                    return await getAttendanceByBooking(
                        worker.booking.id
                    );
                } catch (error) {
                    if (
                        isNotFoundError(error)
                    ) {
                        return null;
                    }

                    throw error;
                }
            },

            enabled:
                !!worker.booking.id,
        })),
    });

    const isLoadingAttendance =
        attendanceQueries.some(
            (query) => query.isLoading
        );

    const attendanceError =
        attendanceQueries.find(
            (query) => query.isError
        )?.error;

    /* ---------------------------------------------------------------------- */
    /* Combine Booking + Attendance                                           */
    /* ---------------------------------------------------------------------- */

    const attendanceWorkers =
        useMemo(() => {
            return workers.map(
                (worker, index) => {
                    const attendance =
                        attendanceQueries[
                            index
                        ]?.data ?? null;

                    return {
                        ...worker,
                        attendance,
                    };
                }
            );
        }, [
            workers,
            attendanceQueries,
        ]);

    /* ---------------------------------------------------------------------- */
    /* Refresh Attendance                                                     */
    /* ---------------------------------------------------------------------- */

    async function invalidateAttendance() {
        await queryClient.invalidateQueries({
            queryKey: [
                "booking-attendance",
            ],
        });

        await queryClient.invalidateQueries({
            queryKey: [
                "shift-attendance",
                shiftId,
            ],
        });

        await queryClient.invalidateQueries({
            queryKey: [
                "shift-role-confirmed-bookings",
            ],
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Check In                                                               */
    /* ---------------------------------------------------------------------- */

    const checkInMutation = useMutation({
        mutationFn: async () => {
            if (!selectedWorker) {
                throw new Error(
                    "No worker selected."
                );
            }

            return checkInAttendance({
                bookingId:
                    selectedWorker.booking.id,

                checkedInById:
                    CURRENT_USER_ID,

                remarks:
                    remarks.trim() ||
                    undefined,
            });
        },

        onSuccess: async () => {
            await invalidateAttendance();

            closeActionDialog();
        },

        onError: (error) => {
            setActionError(
                getApiErrorMessage(
                    error,
                    "Failed to check in worker."
                )
            );
        },
    });

    /* ---------------------------------------------------------------------- */
    /* Check Out                                                              */
    /* ---------------------------------------------------------------------- */

    const checkOutMutation = useMutation({
        mutationFn: async () => {
            if (!selectedWorker) {
                throw new Error(
                    "No worker selected."
                );
            }

            return checkOutAttendance({
                bookingId:
                    selectedWorker.booking.id,

                checkedOutById:
                    CURRENT_USER_ID,

                remarks:
                    remarks.trim() ||
                    undefined,
            });
        },

        onSuccess: async () => {
            await invalidateAttendance();

            closeActionDialog();
        },

        onError: (error) => {
            setActionError(
                getApiErrorMessage(
                    error,
                    "Failed to check out worker."
                )
            );
        },
    });

    /* ---------------------------------------------------------------------- */
    /* Mark Absent                                                            */
    /* ---------------------------------------------------------------------- */

    const absentMutation = useMutation({
        mutationFn: async () => {
            if (!selectedWorker) {
                throw new Error(
                    "No worker selected."
                );
            }

            return markAbsentAttendance({
                bookingId:
                    selectedWorker.booking.id,

                markedAbsentById:
                    CURRENT_USER_ID,

                remarks:
                    remarks.trim() ||
                    undefined,
            });
        },

        onSuccess: async () => {
            await invalidateAttendance();

            closeActionDialog();
        },

        onError: (error) => {
            setActionError(
                getApiErrorMessage(
                    error,
                    "Failed to mark worker absent."
                )
            );
        },
    });

    /* ---------------------------------------------------------------------- */
    /* Dialog                                                                  */
    /* ---------------------------------------------------------------------- */

    function openActionDialog(
        worker: SelectedWorker,
        selectedAction: AttendanceAction
    ) {
        setSelectedWorker(worker);

        setAction(selectedAction);

        setRemarks("");

        setActionError(null);
    }

    function closeActionDialog() {
        if (
            checkInMutation.isPending ||
            checkOutMutation.isPending ||
            absentMutation.isPending
        ) {
            return;
        }

        setAction(null);

        setSelectedWorker(null);

        setRemarks("");

        setActionError(null);
    }

    function handleConfirmAction() {
        setActionError(null);

        switch (action) {
            case "checkin":
                checkInMutation.mutate();
                break;

            case "checkout":
                checkOutMutation.mutate();
                break;

            case "absent":
                absentMutation.mutate();
                break;

            default:
                break;
        }
    }

    const isSubmitting =
        checkInMutation.isPending ||
        checkOutMutation.isPending ||
        absentMutation.isPending;

    const isLoading =
        isLoadingRoles ||
        isLoadingBookings ||
        isLoadingAttendance;

    /* ---------------------------------------------------------------------- */
    /* Errors                                                                  */
    /* ---------------------------------------------------------------------- */

    if (isRolesError) {
        return (
            <AttendanceContainer>
                <ErrorMessage
                    title="Failed to load shift roles."
                    message={getApiErrorMessage(
                        rolesError,
                        "Failed to load shift roles."
                    )}
                />
            </AttendanceContainer>
        );
    }

    if (bookingError) {
        return (
            <AttendanceContainer>
                <ErrorMessage
                    title="Failed to load confirmed workers."
                    message={getApiErrorMessage(
                        bookingError,
                        "Failed to load confirmed workers."
                    )}
                />
            </AttendanceContainer>
        );
    }

    if (attendanceError) {
        return (
            <AttendanceContainer>
                <ErrorMessage
                    title="Failed to load attendance."
                    message={getApiErrorMessage(
                        attendanceError,
                        "Failed to load attendance."
                    )}
                />
            </AttendanceContainer>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Render                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <>
            <AttendanceContainer>

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>
                        <h2 className="font-semibold">
                            Attendance
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Track attendance for confirmed
                            workers assigned to this shift.
                        </p>
                    </div>

                    {!isLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">

                            <Users className="size-4" />

                            <span>
                                {attendanceWorkers.length}{" "}
                                {attendanceWorkers.length === 1
                                    ? "worker"
                                    : "workers"}
                            </span>

                        </div>
                    )}

                </div>

                {/* Content */}

                <div className="p-6">

                    {isLoading && (
                        <div className="rounded-lg border p-8 text-center">

                            <p className="text-sm text-muted-foreground">
                                Loading attendance...
                            </p>

                        </div>
                    )}

                    {!isLoading &&
                        attendanceWorkers.length === 0 && (
                            <div className="rounded-lg border border-dashed p-8 text-center">

                                <Users className="mx-auto size-8 text-muted-foreground" />

                                <h3 className="mt-3 text-sm font-medium">
                                    No confirmed workers
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Workers must be confirmed
                                    before attendance can be
                                    recorded.
                                </p>

                            </div>
                        )}

                    {!isLoading &&
                        attendanceWorkers.length > 0 && (
                            <div className="divide-y rounded-lg border">

                                {attendanceWorkers.map(
                                    (worker) => (
                                        <AttendanceRow
                                            key={
                                                worker.booking.id
                                            }
                                            worker={worker}
                                            onCheckIn={() =>
                                                openActionDialog(
                                                    worker,
                                                    "checkin"
                                                )
                                            }
                                            onCheckOut={() =>
                                                openActionDialog(
                                                    worker,
                                                    "checkout"
                                                )
                                            }
                                            onMarkAbsent={() =>
                                                openActionDialog(
                                                    worker,
                                                    "absent"
                                                )
                                            }
                                            onViewPayroll={(
                                                payrollId
                                            ) =>
                                                router.push(
                                                    `/payroll/${payrollId}`
                                                )
                                            }
                                            onPayrollGenerated={
                                                async () => {
                                                    await queryClient.invalidateQueries(
                                                        {
                                                            queryKey:
                                                                [
                                                                    "booking-attendance",
                                                                ],
                                                        }
                                                    );
                                                }
                                            }
                                        />
                                    )
                                )}

                            </div>
                        )}

                </div>

            </AttendanceContainer>

            {/* ---------------------------------------------------------------- */}
            {/* Attendance Action Dialog                                         */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={!!action}
                onOpenChange={(open) => {
                    if (!open) {
                        closeActionDialog();
                    }
                }}
            >
                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            {getActionTitle(action)}
                        </DialogTitle>

                    </DialogHeader>

                    {selectedWorker && (
                        <div className="space-y-5">

                            {/* Worker */}

                            <div className="rounded-lg border bg-muted/30 p-4">

                                <p className="font-medium">
                                    {
                                        selectedWorker.booking
                                            .workerName
                                    }
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                        selectedWorker.role
                                            .name
                                    }
                                </p>

                            </div>

                            {/* Remarks */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="attendance-remarks"
                                    className="text-sm font-medium"
                                >
                                    Remarks

                                    <span className="ml-1 font-normal text-muted-foreground">
                                        (optional)
                                    </span>

                                </label>

                                <Textarea
                                    id="attendance-remarks"
                                    value={remarks}
                                    onChange={(event) => {
                                        setRemarks(
                                            event.target.value
                                        );

                                        if (actionError) {
                                            setActionError(
                                                null
                                            );
                                        }
                                    }}
                                    placeholder="Add a remark..."
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>

                            {/* Error */}

                            {actionError && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">

                                    <p className="text-sm text-destructive">
                                        {actionError}
                                    </p>

                                </div>
                            )}

                            {/* Footer */}

                            <DialogFooter>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        closeActionDialog
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant={
                                        action === "absent"
                                            ? "destructive"
                                            : "default"
                                    }
                                    onClick={
                                        handleConfirmAction
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : getActionButtonLabel(
                                            action
                                        )}
                                </Button>

                            </DialogFooter>

                        </div>
                    )}

                </DialogContent>
            </Dialog>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Attendance Container                                                       */
/* -------------------------------------------------------------------------- */

function AttendanceContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card">
            {children}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Attendance Row                                                             */
/* -------------------------------------------------------------------------- */

type AttendanceRowProps = {
    worker: SelectedWorker;
    onCheckIn: () => void;
    onCheckOut: () => void;
    onMarkAbsent: () => void;
    onViewPayroll: (payrollId: string) => void;
    onPayrollGenerated: () => Promise<void>;
};

function AttendanceRow({
    worker,
    onCheckIn,
    onCheckOut,
    onMarkAbsent,
    onViewPayroll,
    onPayrollGenerated,
}: AttendanceRowProps) {
    const {
        booking,
        attendance,
        role,
    } = worker;

    return (
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Worker Information */}

            <div className="flex min-w-0 items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Users className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                        <p className="truncate font-medium">
                            {booking.workerName}
                        </p>

                        {attendance && (
                            <AttendanceStatusBadge
                                status={attendance.status}
                            />
                        )}

                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {role.name}
                    </p>

                    {attendance?.checkInTime && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">

                            <LogIn className="size-3" />

                            Check in:{" "}

                            {formatAttendanceDateTime(
                                attendance.checkInTime
                            )}

                        </p>
                    )}

                    {attendance?.checkOutTime && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

                            <LogOut className="size-3" />

                            Check out:{" "}

                            {formatAttendanceDateTime(
                                attendance.checkOutTime
                            )}

                        </p>
                    )}

                    {attendance?.remarks && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {attendance.remarks}
                        </p>
                    )}

                </div>

            </div>

            {/* Actions */}

            <div className="flex shrink-0 flex-wrap items-center gap-2">

                {canCheckIn(attendance) && (
                    <Button
                        size="sm"
                        onClick={onCheckIn}
                    >
                        <LogIn className="mr-2 size-4" />
                        Check In
                    </Button>
                )}

                {canCheckOut(attendance) && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onCheckOut}
                    >
                        <LogOut className="mr-2 size-4" />
                        Check Out
                    </Button>
                )}

                {canMarkAbsent(attendance) && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onMarkAbsent}
                    >
                        <UserX className="mr-2 size-4" />
                        Mark Absent
                    </Button>
                )}

                {/* Payroll */}

                {attendance?.payrollId ? (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            onViewPayroll(
                                attendance.payrollId!
                            )
                        }
                    >
                        <Eye className="mr-2 size-4" />
                        View Payroll
                    </Button>
                ) : attendance?.status ===
                    AttendanceStatus.Absent ? (
                    <span className="text-sm text-muted-foreground">
                        Not Eligible
                    </span>
                ) : attendance &&
                    attendance.status !==
                    AttendanceStatus.Pending ? (
                    <GeneratePayrollButton
                        attendanceId={attendance.id}
                        onSuccess={
                            onPayrollGenerated
                        }
                    />
                ) : null}

            </div>

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function ErrorMessage({
    title,
    message,
}: {
    title: string;
    message: string;
}) {
    return (
        <div className="p-6">

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                <p className="text-sm font-medium text-destructive">
                    {title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {message}
                </p>

            </div>

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Action Helpers                                                             */
/* -------------------------------------------------------------------------- */

function getActionTitle(
    action: AttendanceAction
): string {
    switch (action) {
        case "checkin":
            return "Check In Worker";

        case "checkout":
            return "Check Out Worker";

        case "absent":
            return "Mark Worker Absent";

        default:
            return "Attendance";
    }
}

function getActionButtonLabel(
    action: AttendanceAction
): string {
    switch (action) {
        case "checkin":
            return "Check In";

        case "checkout":
            return "Check Out";

        case "absent":
            return "Mark Absent";

        default:
            return "Save";
    }
}

/* -------------------------------------------------------------------------- */
/* HTTP Helpers                                                               */
/* -------------------------------------------------------------------------- */

function isNotFoundError(
    error: unknown
): boolean {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const response = (
            error as {
                response?: {
                    status?: number;
                };
            }
        ).response;

        return response?.status === 404;
    }

    return false;
}
