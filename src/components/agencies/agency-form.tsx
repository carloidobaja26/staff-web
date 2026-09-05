"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {
    createAgency,
    updateAgency,
    type Agency,
} from "@/lib/api/agencies";

import {
    CURRENT_TENANT_ID,
} from "@/constants/tenant";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

type AgencyFormValues = {
    name: string;
    description: string;
    email: string;
    phoneNumber: string;
    address: string;
    managerUserId: string;
    isActive: boolean;
};

type AgencyFormProps = {
    agency?: Agency;
    onSuccess: () => void;
    onCancel: () => void;
};

export function AgencyForm({
    agency,
    onSuccess,
    onCancel,
}: AgencyFormProps) {

    const isEditing = !!agency;

    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<AgencyFormValues>({
        defaultValues: {
            name: "",
            description: "",
            email: "",
            phoneNumber: "",
            address: "",
            managerUserId: "",
            isActive: true,
        },
    });


    /* ---------------------------------------------------------------------- */
    /* Populate form when editing                                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        setSubmitError(null);

        if (!agency) {
            reset({
                name: "",
                description: "",
                email: "",
                phoneNumber: "",
                address: "",
                managerUserId: "",
                isActive: true,
            });

            return;
        }

        reset({
            name: agency.name ?? "",
            description: agency.description ?? "",
            email: agency.email ?? "",
            phoneNumber: agency.phoneNumber ?? "",
            address: agency.address ?? "",
            managerUserId:
                agency.managerUserId ?? "",
            isActive: agency.isActive,
        });

    }, [agency, reset]);


    /* ---------------------------------------------------------------------- */
    /* Create                                                                 */
    /* ---------------------------------------------------------------------- */

    const createMutation = useMutation({

        mutationFn: (
            values: AgencyFormValues
        ) =>
            createAgency({
                tenantId: CURRENT_TENANT_ID,
                name: values.name,
                description:
                    values.description ||
                    undefined,
                email:
                    values.email ||
                    undefined,
                phoneNumber:
                    values.phoneNumber ||
                    undefined,
                address:
                    values.address ||
                    undefined,
                managerUserId:
                    values.managerUserId ||
                    undefined,
            }),

        onSuccess: () => {
            setSubmitError(null);
            onSuccess();
        },

        onError: (error: unknown) => {
            setSubmitError(
                getApiErrorMessage(
                    error,
                    "Failed to create agency."
                )
            );
        },
    });


    /* ---------------------------------------------------------------------- */
    /* Update                                                                 */
    /* ---------------------------------------------------------------------- */

    const updateMutation = useMutation({

        mutationFn: (
            values: AgencyFormValues
        ) => {

            if (!agency) {
                throw new Error(
                    "Agency is required for update."
                );
            }

            return updateAgency(
                agency.id,
                {
                    name: values.name,
                    description:
                        values.description ||
                        undefined,
                    email:
                        values.email ||
                        undefined,
                    phoneNumber:
                        values.phoneNumber ||
                        undefined,
                    address:
                        values.address ||
                        undefined,
                    managerUserId:
                        values.managerUserId ||
                        undefined,
                    isActive:
                        values.isActive,
                }
            );
        },

        onSuccess: () => {
            setSubmitError(null);
            onSuccess();
        },

        onError: (error: unknown) => {
            setSubmitError(
                getApiErrorMessage(
                    error,
                    "Failed to update agency."
                )
            );
        },
    });


    /* ---------------------------------------------------------------------- */
    /* Submit                                                                 */
    /* ---------------------------------------------------------------------- */

    const onSubmit = (
        values: AgencyFormValues
    ) => {

        setSubmitError(null);

        if (isEditing) {
            updateMutation.mutate(values);
            return;
        }

        createMutation.mutate(values);
    };


    const isPending =
        createMutation.isPending ||
        updateMutation.isPending;


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

            {/* Name */}

            <div className="space-y-2">

                <label
                    htmlFor="name"
                    className="text-sm font-medium"
                >
                    Name
                </label>

                <Input
                    id="name"
                    {...register("name", {
                        required:
                            "Agency name is required.",
                    })}
                    placeholder="Agency name"
                    disabled={isPending}
                />

                {errors.name && (
                    <p className="text-sm text-destructive">
                        {errors.name.message}
                    </p>
                )}

            </div>


            {/* Description */}

            <div className="space-y-2">

                <label
                    htmlFor="description"
                    className="text-sm font-medium"
                >
                    Description
                </label>

                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Agency description"
                    disabled={isPending}
                />

            </div>


            {/* Email */}

            <div className="space-y-2">

                <label
                    htmlFor="email"
                    className="text-sm font-medium"
                >
                    Email
                </label>

                <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="agency@example.com"
                    disabled={isPending}
                />

            </div>


            {/* Phone */}

            <div className="space-y-2">

                <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium"
                >
                    Phone
                </label>

                <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="Phone number"
                    disabled={isPending}
                />

            </div>


            {/* Address */}

            <div className="space-y-2">

                <label
                    htmlFor="address"
                    className="text-sm font-medium"
                >
                    Address
                </label>

                <Input
                    id="address"
                    {...register("address")}
                    placeholder="Agency address"
                    disabled={isPending}
                />

            </div>


            {/* Active */}

            {isEditing && (

                <div className="flex items-center gap-2">

                    <input
                        id="isActive"
                        type="checkbox"
                        {...register("isActive")}
                        disabled={isPending}
                    />

                    <label
                        htmlFor="isActive"
                        className="text-sm font-medium"
                    >
                        Active
                    </label>

                </div>

            )}


            {/* API Error */}

            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>
                </div>
            )}


            {/* Actions */}

            <div className="flex justify-end gap-2 pt-2">

                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isPending}
                >
                    {isPending
                        ? isEditing
                            ? "Saving..."
                            : "Creating..."
                        : isEditing
                            ? "Save Changes"
                            : "Create Agency"}
                </Button>

            </div>

        </form>
    );
}