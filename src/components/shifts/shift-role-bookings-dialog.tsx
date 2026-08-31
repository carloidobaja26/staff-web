"use client";

import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    MoreHorizontal,
    Plus,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    getBookingsByShiftRole,
    createBooking,
    deleteBooking,
    type Booking,
} from "@/lib/api/bookings";

import {
    getWorkersByAgency,
} from "@/lib/api/workers";

import type { ShiftRole } from "@/lib/api/shift-roles";

import {
    getApiErrorMessage,
} from "@/lib/helpers/api-error";

import {
    formatDateTime,
    BookingStatusBadge,
} from "@/components/shifts/helpers/booking-helpers";

import {
    formatRate,
    getRateTypeLabel,
} from "@/components/shifts/helpers/shift-role-helpers";

import {
    CURRENT_AGENCY_ID,
} from "@/constants/tenant";

type ShiftRoleBookingsDialogProps = {
    role: ShiftRole | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ShiftRoleBookingsDialog({
    role,
    open,
    onOpenChange,
}: ShiftRoleBookingsDialogProps) {

    const queryClient =
        useQueryClient();


    const [assignOpen, setAssignOpen] =
        useState(false);


    const [bookingToDelete, setBookingToDelete] =
        useState<Booking | null>(null);


    const [deleteOpen, setDeleteOpen] =
        useState(false);


    const [isDeleting, setIsDeleting] =
        useState(false);


    const {
        data: bookings = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "shift-role-bookings",
            role?.id,
        ],

        queryFn: () =>
            getBookingsByShiftRole(
                role!.id
            ),

        enabled:
            open &&
            !!role?.id,
    });


    const assignedCount =
        bookings.length;


    const requestedCount =
        role?.requestedWorkers ?? 0;


    function handleAssignSuccess() {

        queryClient.invalidateQueries({
            queryKey: [
                "shift-role-bookings",
                role?.id,
            ],
        });

    }


    function handleDelete(
        booking: Booking
    ) {

        setBookingToDelete(
            booking
        );

        setDeleteOpen(true);

    }


    async function confirmDelete() {

        if (!bookingToDelete) {
            return;
        }


        try {

            setIsDeleting(true);


            await deleteBooking(
                bookingToDelete.id
            );


            await queryClient.invalidateQueries({
                queryKey: [
                    "shift-role-bookings",
                    role?.id,
                ],
            });


            setDeleteOpen(false);

            setBookingToDelete(null);

        } catch (error) {

            console.error(
                "Failed to delete booking:",
                error
            );

        } finally {

            setIsDeleting(false);

        }

    }


    return (
        <>
            <Dialog
                open={open}
                onOpenChange={
                    onOpenChange
                }
            >

                <DialogContent
                    className="sm:max-w-2xl"
                >

                    <DialogHeader>

                        <DialogTitle>
                            {role?.name ?? "Shift Role"}
                        </DialogTitle>

                    </DialogHeader>


                    {role && (
                        <div className="space-y-6">

                            {/* Summary */}

                            <div className="rounded-lg border bg-muted/30 p-4">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Workers Assigned
                                        </p>

                                        <p className="mt-1 text-2xl font-semibold">

                                            {assignedCount}

                                            <span className="text-base font-normal text-muted-foreground">
                                                {" "}
                                                /{" "}
                                                {requestedCount}
                                            </span>

                                        </p>

                                    </div>


                                    <div className="text-sm text-muted-foreground">

                                        <p>
                                            Requested:{" "}
                                            {requestedCount}
                                        </p>

                                        <p>
                                            Rate:{" "}
                                            {formatRate(
                                                role.rate
                                            )}{" "}
                                            /{" "}
                                            {getRateTypeLabel(
                                                role.rateType
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Assigned Workers */}

                            <div>

                                <div className="mb-3 flex items-center justify-between">

                                    <div>

                                        <h3 className="font-medium">
                                            Assigned Workers
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Workers currently
                                            assigned to this role.
                                        </p>

                                    </div>


                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setAssignOpen(
                                                true
                                            )
                                        }
                                        disabled={
                                            assignedCount >=
                                            requestedCount
                                        }
                                    >
                                        <UserPlus className="mr-2 size-4" />
                                        Assign Worker
                                    </Button>

                                </div>


                                {isLoading && (
                                    <div className="rounded-lg border p-6 text-center">

                                        <p className="text-sm text-muted-foreground">
                                            Loading workers...
                                        </p>

                                    </div>
                                )}


                                {isError && (
                                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                                        <p className="text-sm font-medium text-destructive">
                                            Failed to load bookings.
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {getApiErrorMessage(
                                                error,
                                                "Something went wrong."
                                            )}
                                        </p>

                                    </div>
                                )}


                                {!isLoading &&
                                    !isError &&
                                    bookings.length === 0 && (

                                        <div className="rounded-lg border border-dashed p-8 text-center">

                                            <Users className="mx-auto size-8 text-muted-foreground" />

                                            <h4 className="mt-3 text-sm font-medium">
                                                No workers assigned
                                            </h4>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Assign workers to
                                                this shift role.
                                            </p>

                                            <Button
                                                size="sm"
                                                className="mt-4"
                                                onClick={() =>
                                                    setAssignOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                <Plus className="mr-2 size-4" />
                                                Assign Worker
                                            </Button>

                                        </div>

                                    )}


                                {!isLoading &&
                                    !isError &&
                                    bookings.length > 0 && (

                                        <div className="divide-y rounded-lg border">

                                            {bookings.map(
                                                (
                                                    booking
                                                ) => (

                                                    <BookingRow
                                                        key={
                                                            booking.id
                                                        }
                                                        booking={
                                                            booking
                                                        }
                                                        onDelete={() =>
                                                            handleDelete(
                                                                booking
                                                            )
                                                        }
                                                    />

                                                )
                                            )}

                                        </div>

                                    )}

                            </div>

                        </div>
                    )}

                </DialogContent>

            </Dialog>


            {/* Assign Worker Dialog */}

            {role && (
                <AssignWorkerDialog
                    role={role}
                    bookings={bookings}
                    open={assignOpen}
                    onOpenChange={
                        setAssignOpen
                    }
                    onSuccess={
                        handleAssignSuccess
                    }
                />
            )}


            {/* Delete Booking Confirmation */}

            <AlertDialog
                open={deleteOpen}
                onOpenChange={(open) => {

                    if (isDeleting) {
                        return;
                    }


                    setDeleteOpen(open);


                    if (!open) {
                        setBookingToDelete(
                            null
                        );
                    }

                }}
            >

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            Remove worker?
                        </AlertDialogTitle>

                        <AlertDialogDescription>

                            Are you sure you want to remove{" "}

                            <span className="font-medium text-foreground">
                                {bookingToDelete?.workerName}
                            </span>

                            {" "}from this shift role?

                        </AlertDialogDescription>

                    </AlertDialogHeader>


                    <AlertDialogFooter>

                        <AlertDialogCancel
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>


                        <AlertDialogAction
                            onClick={
                                confirmDelete
                            }
                            disabled={
                                isDeleting
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting
                                ? "Removing..."
                                : "Remove Worker"}
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </>
    );

}

/* -------------------------------------------------------------------------- */
/* Booking Row                                                                */
/* -------------------------------------------------------------------------- */

type BookingRowProps = {
    booking: Booking;
    onDelete: () => void;
};

function BookingRow({
    booking,
    onDelete,
}: BookingRowProps) {

    return (
        <div className="flex items-center justify-between gap-4 p-4">

            <div className="flex min-w-0 items-center gap-3">

                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">

                    <Users className="size-4 text-muted-foreground" />

                </div>


                <div className="min-w-0">

                    <p className="truncate font-medium">
                        {booking.workerName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Assigned by{" "}
                        <span className="font-medium text-foreground">
                            {booking.assignedName || "Unknown"}
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(
                            booking.assignedAt
                        )}
                    </p>

                </div>

            </div>


            <div className="flex items-center gap-2">

                <BookingStatusBadge
                    status={
                        booking.status
                    }
                />


                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <MoreHorizontal className="size-4" />

                            <span className="sr-only">
                                Booking actions
                            </span>
                        </Button>

                    </DropdownMenuTrigger>


                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={onDelete}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Remove Worker
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

            </div>

        </div>
    );

}

/* -------------------------------------------------------------------------- */
/* Assign Worker Dialog                                                       */
/* -------------------------------------------------------------------------- */

type AssignWorkerDialogProps = {
    role: ShiftRole;
    bookings: Booking[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

function AssignWorkerDialog({
    role,
    bookings,
    open,
    onOpenChange,
    onSuccess,
}: AssignWorkerDialogProps) {

    const [workerId, setWorkerId] =
        useState("");


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    const [error, setError] =
        useState<string | null>(null);


    const {
        data: workers = [],
        isLoading: isLoadingWorkers,
        isError: isWorkersError,
        error: workersError,
    } = useQuery({
        queryKey: [
            "agency-workers",
            CURRENT_AGENCY_ID,
        ],

        queryFn: () =>
            getWorkersByAgency(
                CURRENT_AGENCY_ID
            ),

        enabled: open,
    });


    const assignedWorkerIds =
        new Set(
            bookings.map(
                (booking) =>
                    booking.workerId
            )
        );


    const availableWorkers =
        workers.filter(
            (worker) =>
                !assignedWorkerIds.has(
                    worker.id
                )
        );


    async function handleAssign() {

        if (!workerId) {

            setError(
                "Please select a worker."
            );

            return;
        }


        try {

            setIsSubmitting(true);

            setError(null);


            /*
             * Replace these with the values
             * from your authenticated user /
             * tenant context.
             */

            await createBooking({
                tenantId: "",
                shiftRoleId: role.id,
                workerId,
                assignedById: "",
            });


            onSuccess();

            onOpenChange(false);

            setWorkerId("");

        } catch (error) {

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to assign worker."
                )
            );

        } finally {

            setIsSubmitting(false);

        }

    }


    function handleOpenChange(
        nextOpen: boolean
    ) {

        if (!nextOpen) {

            setWorkerId("");

            setError(null);

        }

        onOpenChange(nextOpen);

    }


    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>
                        Assign Worker
                    </DialogTitle>

                </DialogHeader>


                <div className="space-y-5">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Assign a worker to
                        </p>

                        <p className="font-medium">
                            {role.name}
                        </p>

                    </div>


                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Worker
                        </label>


                        {isWorkersError ? (

                            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">

                                <p className="text-sm text-destructive">
                                    {getApiErrorMessage(
                                        workersError,
                                        "Failed to load workers."
                                    )}
                                </p>

                            </div>

                        ) : (

                            <Select
                                value={workerId}
                                onValueChange={(value) => {

                                    setWorkerId(
                                        value
                                    );

                                    if (error) {
                                        setError(null);
                                    }

                                }}
                                disabled={
                                    isSubmitting ||
                                    isLoadingWorkers ||
                                    availableWorkers.length === 0
                                }
                            >

                                <SelectTrigger>

                                    <SelectValue
                                        placeholder={
                                            isLoadingWorkers
                                                ? "Loading workers..."
                                                : "Select a worker"
                                        }
                                    />

                                </SelectTrigger>


                                <SelectContent>

                                    {availableWorkers.length === 0 ? (

                                        <SelectItem
                                            value="none"
                                            disabled
                                        >
                                            No workers available
                                        </SelectItem>

                                    ) : (

                                        availableWorkers.map(
                                            (worker) => (

                                                <SelectItem
                                                    key={
                                                        worker.id
                                                    }
                                                    value={
                                                        worker.id
                                                    }
                                                >
                                                    {worker.firstName}{" "}
                                                    {worker.lastName}
                                                </SelectItem>

                                            )
                                        )

                                    )}

                                </SelectContent>

                            </Select>

                        )}

                    </div>


                    {error && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">

                            <p className="text-sm text-destructive">
                                {error}
                            </p>

                        </div>
                    )}


                    <div className="flex justify-end gap-2">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                handleOpenChange(
                                    false
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            Cancel
                        </Button>


                        <Button
                            onClick={
                                handleAssign
                            }
                            disabled={
                                isSubmitting ||
                                isLoadingWorkers ||
                                isWorkersError ||
                                !workerId
                            }
                        >
                            {isSubmitting
                                ? "Assigning..."
                                : "Assign Worker"}
                        </Button>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    );

}
