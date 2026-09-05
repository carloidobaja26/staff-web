"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Label,
} from "@/components/ui/label";

import {
    CURRENT_TENANT_ID,
} from "@/constants/tenant";

import {
    createWorker,
    updateWorker,
    type Worker,
} from "@/lib/api/workers";

import {
    getApiErrorMessage,
} from "@/lib/helpers/api-error";


const workerSchema = z.object({

    firstName: z
        .string()
        .min(
            1,
            "First name is required."
        ),

    lastName: z
        .string()
        .min(
            1,
            "Last name is required."
        ),

    email: z
        .string()
        .email(
            "Enter a valid email address."
        ),

    phoneNumber: z
        .string()
        .optional(),

    birthDate: z
        .string()
        .optional(),

    workerNumber: z
        .string()
        .min(
            1,
            "Worker number is required."
        ),

    isActive: z.boolean(),
});


type WorkerFormValues =
    z.infer<typeof workerSchema>;


type AgencyWorkerFormProps = {

    agencyId: string;

    worker?: Worker;

    onSuccess: () => void;

    onCancel: () => void;
};


export function AgencyWorkerForm({
    agencyId,
    worker,
    onSuccess,
    onCancel,
}: AgencyWorkerFormProps) {

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
    } = useForm<WorkerFormValues>({
        resolver:
            zodResolver(workerSchema),

        defaultValues: {

            firstName:
                worker?.firstName ?? "",

            lastName:
                worker?.lastName ?? "",

            email:
                worker?.email ?? "",

            phoneNumber:
                worker?.phoneNumber ?? "",

            birthDate:
                worker?.birthDate
                    ?.split("T")[0] ?? "",

            workerNumber:
                worker?.workerNumber ?? "",

            isActive:
                worker?.isActive ?? true,
        },
    });


    useEffect(() => {

        setSubmitError(null);

        reset({

            firstName:
                worker?.firstName ?? "",

            lastName:
                worker?.lastName ?? "",

            email:
                worker?.email ?? "",

            phoneNumber:
                worker?.phoneNumber ?? "",

            birthDate:
                worker?.birthDate
                    ?.split("T")[0] ?? "",

            workerNumber:
                worker?.workerNumber ?? "",

            isActive:
                worker?.isActive ?? true,
        });

    }, [
        worker,
        reset,
    ]);


    async function onSubmit(
        values: WorkerFormValues
    ) {

        setSubmitError(null);

        try {

            if (worker) {

                await updateWorker(
                    worker.id,
                    {
                        firstName:
                            values.firstName,

                        lastName:
                            values.lastName,

                        email:
                            values.email,

                        phoneNumber:
                            values.phoneNumber ||
                            undefined,

                        birthDate:
                            values.birthDate ||
                            undefined,

                        workerNumber:
                            values.workerNumber,

                        isActive:
                            values.isActive,
                    }
                );

            } else {

                await createWorker({
                    tenantId:
                        CURRENT_TENANT_ID,

                    agencyId,

                    firstName:
                        values.firstName,

                    lastName:
                        values.lastName,

                    email:
                        values.email,

                    phoneNumber:
                        values.phoneNumber ||
                        undefined,

                    birthDate:
                        values.birthDate ||
                        undefined,

                    workerNumber:
                        values.workerNumber,
                });

            }

            setSubmitError(null);

            onSuccess();

        } catch (error: unknown) {

            setSubmitError(
                getApiErrorMessage(
                    error,
                    worker
                        ? "Failed to update worker."
                        : "Failed to create worker."
                )
            );

        }
    }


    return (

        <form
            onSubmit={
                handleSubmit(
                    onSubmit
                )
            }
            className="space-y-4"
        >

            <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                    <Label>
                        First Name *
                    </Label>

                    <Input
                        {...register(
                            "firstName"
                        )}
                        disabled={isSubmitting}
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

                    <Label>
                        Last Name *
                    </Label>

                    <Input
                        {...register(
                            "lastName"
                        )}
                        disabled={isSubmitting}
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


            <div className="space-y-2">

                <Label>
                    Email *
                </Label>

                <Input
                    type="email"
                    {...register(
                        "email"
                    )}
                    disabled={isSubmitting}
                />

                {errors.email && (

                    <p className="text-sm text-destructive">

                        {
                            errors.email.message
                        }

                    </p>

                )}

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                    <Label>
                        Phone Number
                    </Label>

                    <Input
                        {...register(
                            "phoneNumber"
                        )}
                        disabled={isSubmitting}
                    />

                </div>


                <div className="space-y-2">

                    <Label>
                        Birth Date
                    </Label>

                    <Input
                        type="date"
                        {...register(
                            "birthDate"
                        )}
                        disabled={isSubmitting}
                    />

                </div>

            </div>


            <div className="space-y-2">

                <Label>
                    Worker Number *
                </Label>

                <Input
                    {...register(
                        "workerNumber"
                    )}
                    disabled={isSubmitting}
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


            {worker && (

                <label className="flex items-center gap-2 text-sm">

                    <input
                        type="checkbox"
                        {...register(
                            "isActive"
                        )}
                        disabled={isSubmitting}
                    />

                    Active worker

                </label>

            )}


            {/* API Error */}

            {submitError && (

                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">

                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>

                </div>

            )}


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
                        ? "Saving..."
                        : worker
                            ? "Save Changes"
                            : "Add Worker"}
                </Button>

            </div>

        </form>

    );
}