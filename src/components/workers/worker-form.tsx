"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    createWorker,
    updateWorker,
    type Worker,
} from "@/lib/api/workers";

import {
    CURRENT_AGENCY_ID,
    CURRENT_TENANT_ID,
} from "@/constants/tenant";


const workerSchema = z.object({
    workerNumber: z
        .string()
        .min(1, "Worker number is required"),

    firstName: z
        .string()
        .min(1, "First name is required"),

    lastName: z
        .string()
        .min(1, "Last name is required"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    phoneNumber: z.string().optional(),

    birthDate: z.string().optional(),
});


type WorkerFormValues = z.infer<
    typeof workerSchema
>;


type WorkerFormProps = {
    worker?: Worker;
    onSuccess: () => void;
    onCancel: () => void;
};


export function WorkerForm({
    worker,
    onSuccess,
    onCancel,
}: WorkerFormProps) {
    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<WorkerFormValues>({
        resolver: zodResolver(workerSchema),

        defaultValues: {
            workerNumber: worker?.workerNumber ?? "",
            firstName: worker?.firstName ?? "",
            lastName: worker?.lastName ?? "",
            email: worker?.email ?? "",
            phoneNumber: worker?.phoneNumber ?? "",
            birthDate: worker?.birthDate ?? "",
        },
    });


    const onSubmit = async (
        values: WorkerFormValues
    ) => {
        setSubmitError(null);

        try {
            const request = {
                tenantId: CURRENT_TENANT_ID,
                agencyId: CURRENT_AGENCY_ID,

                workerNumber: values.workerNumber,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,

                phoneNumber:
                    values.phoneNumber || undefined,

                birthDate:
                    values.birthDate || undefined,
            };

            if (worker) {
                await updateWorker(
                    worker.id,
                    {
                        ...request,
                        isActive: worker.isActive,
                    }
                );
            } else {
                await createWorker(request);
            }

            onSuccess();
        } catch (error) {
            console.error(
                "Failed to save worker:",
                error
            );

            setSubmitError(
                worker
                    ? "Failed to update worker. Please try again."
                    : "Failed to create worker. Please try again."
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {submitError}
                </div>
            )}

            {/* Worker Number */}
            <div className="space-y-2">
                <Label htmlFor="workerNumber">
                    Worker Number *
                </Label>

                <Input
                    id="workerNumber"
                    placeholder="WRK-001"
                    {...register("workerNumber")}
                />

                {errors.workerNumber && (
                    <p className="text-sm text-destructive">
                        {
                            errors.workerNumber
                                .message
                        }
                    </p>
                )}
            </div>


            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">
                        First Name *
                    </Label>

                    <Input
                        id="firstName"
                        placeholder="John"
                        {...register(
                            "firstName"
                        )}
                    />

                    {errors.firstName && (
                        <p className="text-sm text-destructive">
                            {
                                errors.firstName
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">
                        Last Name *
                    </Label>

                    <Input
                        id="lastName"
                        placeholder="Smith"
                        {...register(
                            "lastName"
                        )}
                    />

                    {errors.lastName && (
                        <p className="text-sm text-destructive">
                            {
                                errors.lastName
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>


            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">
                    Email *
                </Label>

                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                />

                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>


            {/* Phone + Birth Date */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                        Phone Number
                    </Label>

                    <Input
                        id="phoneNumber"
                        placeholder="09171234567"
                        {...register(
                            "phoneNumber"
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="birthDate">
                        Birth Date
                    </Label>

                    <Input
                        id="birthDate"
                        type="date"
                        {...register(
                            "birthDate"
                        )}
                    />
                </div>
            </div>


            {/* Actions */}
            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? worker
                            ? "Saving..."
                            : "Adding..."
                        : worker
                            ? "Save Changes"
                            : "Add Worker"}
                </Button>
            </div>
        </form>
    );
}
