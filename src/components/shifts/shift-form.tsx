"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    createShift,
    updateShift,
    type Shift,
    ShiftStatus,
} from "@/lib/api/shifts";

import {
    CURRENT_TENANT_ID,
} from "@/constants/tenant";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

const shiftSchema = z
    .object({
        name: z
            .string()
            .min(1, "Shift name is required"),

        description: z
            .string()
            .optional(),

        startDateTime: z
            .string()
            .min(
                1,
                "Start date and time is required"
            ),

        endDateTime: z
            .string()
            .min(
                1,
                "End date and time is required"
            ),

        status: z
            .nativeEnum(ShiftStatus),

        isActive: z.boolean(),
    })
    .refine(
        (data) =>
            new Date(
                data.endDateTime
            ) >
            new Date(
                data.startDateTime
            ),
        {
            message:
                "End date and time must be after the start date and time.",
            path: ["endDateTime"],
        }
    );

type ShiftFormValues =
    z.infer<typeof shiftSchema>;

type ShiftFormProps = {
    shift?: Shift;
    eventId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

function formatDateTimeLocal(
    value?: string | null
): string {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function ShiftForm({
    shift,
    eventId,
    onSuccess,
    onCancel,
}: ShiftFormProps) {
    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
        reset,
    } = useForm<ShiftFormValues>({
        resolver:
            zodResolver(
                shiftSchema
            ),

        defaultValues: {
            name:
                shift?.name ?? "",

            description:
                shift?.description ?? "",

            startDateTime:
                formatDateTimeLocal(
                    shift?.startDateTime
                ),

            endDateTime:
                formatDateTimeLocal(
                    shift?.endDateTime
                ),

            status:
                shift?.status ??
                ShiftStatus.Open,

            isActive:
                shift?.isActive ??
                true,
        },
    });

    useEffect(() => {
        setSubmitError(null);

        reset({
            name:
                shift?.name ?? "",

            description:
                shift?.description ?? "",

            startDateTime:
                formatDateTimeLocal(
                    shift?.startDateTime
                ),

            endDateTime:
                formatDateTimeLocal(
                    shift?.endDateTime
                ),

            status:
                shift?.status ??
                ShiftStatus.Open,

            isActive:
                shift?.isActive ??
                true,
        });
    }, [
        shift,
        reset,
    ]);

    const onSubmit = async (
        values: ShiftFormValues
    ) => {
        setSubmitError(null);

        if (!eventId) {
            setSubmitError(
                "Unable to create shift because the event could not be identified."
            );

            return;
        }

        try {
            if (shift) {
                await updateShift(
                    shift.id,
                    {
                        name:
                            values.name,

                        description:
                            values.description ||
                            undefined,

                        startDateTime:
                            new Date(
                                values.startDateTime
                            ).toISOString(),

                        endDateTime:
                            new Date(
                                values.endDateTime
                            ).toISOString(),

                        status:
                            values.status,

                        isActive:
                            values.isActive,
                    }
                );
            } else {
                await createShift({
                    tenantId:
                        CURRENT_TENANT_ID,

                    /*
                     * eventId comes directly from
                     * the Event page.
                     *
                     * It is never entered by the user.
                     */
                    eventId:
                        eventId,

                    name:
                        values.name,

                    description:
                        values.description ||
                        undefined,

                    startDateTime:
                        new Date(
                            values.startDateTime
                        ).toISOString(),

                    endDateTime:
                        new Date(
                            values.endDateTime
                        ).toISOString(),
                });
            }

            setSubmitError(null);
            onSuccess();
        } catch (error: unknown) {
            console.error(
                "Failed to save shift:",
                error
            );

            setSubmitError(
                getApiErrorMessage(
                    error,
                    shift
                        ? "Failed to update shift."
                        : "Failed to create shift."
                )
            );
        }
    };

    return (
        <form
            onSubmit={
                handleSubmit(
                    onSubmit
                )
            }
            className="space-y-5"
        >
            {/* Error */}

            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>
                </div>
            )}

            {/* Shift Name */}

            <div className="space-y-2">
                <Label htmlFor="name">
                    Shift Name *
                </Label>

                <Input
                    id="name"
                    placeholder="Morning Shift"
                    disabled={isSubmitting}
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-sm text-destructive">
                        {
                            errors
                                .name
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Description */}

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Textarea
                    id="description"
                    placeholder="Shift description..."
                    rows={3}
                    disabled={isSubmitting}
                    {...register(
                        "description"
                    )}
                />

                {errors.description && (
                    <p className="text-sm text-destructive">
                        {
                            errors
                                .description
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Date / Time */}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="startDateTime">
                        Start Date & Time *
                    </Label>

                    <Input
                        id="startDateTime"
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...register(
                            "startDateTime"
                        )}
                    />

                    {errors.startDateTime && (
                        <p className="text-sm text-destructive">
                            {
                                errors
                                    .startDateTime
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDateTime">
                        End Date & Time *
                    </Label>

                    <Input
                        id="endDateTime"
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...register(
                            "endDateTime"
                        )}
                    />

                    {errors.endDateTime && (
                        <p className="text-sm text-destructive">
                            {
                                errors
                                    .endDateTime
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Edit-only settings */}

            {shift && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Status */}

                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Status
                        </Label>

                        <select
                            id="status"
                            {...register(
                                "status",
                                {
                                    valueAsNumber:
                                        true,
                                }
                            )}
                            disabled={
                                isSubmitting
                            }
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option
                                value={
                                    ShiftStatus.Open
                                }
                            >
                                Open
                            </option>

                            <option
                                value={
                                    ShiftStatus.Filled
                                }
                            >
                                Filled
                            </option>

                            <option
                                value={
                                    ShiftStatus.InProgress
                                }
                            >
                                In Progress
                            </option>

                            <option
                                value={
                                    ShiftStatus.Completed
                                }
                            >
                                Completed
                            </option>

                            <option
                                value={
                                    ShiftStatus.Cancelled
                                }
                            >
                                Cancelled
                            </option>
                        </select>

                        {errors.status && (
                            <p className="text-sm text-destructive">
                                {
                                    errors
                                        .status
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Active */}

                    <div className="space-y-2">
                        <Label htmlFor="isActive">
                            Active
                        </Label>

                        <select
                            id="isActive"
                            {...register(
                                "isActive",
                                {
                                    setValueAs:
                                        (
                                            value
                                        ) =>
                                            value ===
                                            "true",
                                }
                            )}
                            disabled={
                                isSubmitting
                            }
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="true">
                                Active
                            </option>

                            <option value="false">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>
            )}

            {/* Actions */}

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        onCancel
                    }
                    disabled={
                        isSubmitting
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !eventId
                    }
                >
                    {isSubmitting
                        ? shift
                            ? "Saving..."
                            : "Creating..."
                        : shift
                            ? "Save Changes"
                            : "Add Shift"}
                </Button>
            </div>
        </form>
    );
}