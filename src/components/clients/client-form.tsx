"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Client,
    createClient,
    updateClient,
} from "@/lib/api/clients";

import {
    CURRENT_TENANT_ID,
    CURRENT_AGENCY_ID,
} from "@/constants/tenant";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

const clientSchema = z.object({
    clientNumber: z.string().min(1, "Client number is required"),
    name: z.string().min(1, "Name is required"),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

type ClientFormProps = {
    agencyId?: string;
    client?: Client;
    onSuccess: () => void;
    onCancel: () => void;
};

export function ClientForm({
    agencyId,
    client,
    onSuccess,
    onCancel,
}: ClientFormProps) {
    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),

        defaultValues: {
            clientNumber: client?.clientNumber ?? "",
            name: client?.name ?? "",
            companyName: client?.companyName ?? "",
            contactPerson: client?.contactPerson ?? "",
            email: client?.email ?? "",
            phoneNumber: client?.phoneNumber ?? "",
            address: client?.address ?? "",
            notes: client?.notes ?? "",
        },
    });

    const onSubmit = async (values: ClientFormValues) => {
        setSubmitError(null);

        try {
            if (client) {
                await updateClient(client.id, {
                    tenantId: CURRENT_TENANT_ID,
                    agencyId: agencyId,
                    clientNumber: values.clientNumber,
                    name: values.name,
                    companyName:
                        values.companyName || undefined,
                    contactPerson:
                        values.contactPerson || undefined,
                    email: values.email || undefined,
                    phoneNumber:
                        values.phoneNumber || undefined,
                    address: values.address || undefined,
                    notes: values.notes || undefined,
                });
            } else {
                await createClient({
                    tenantId: CURRENT_TENANT_ID,
                    agencyId: agencyId,
                    clientNumber: values.clientNumber,
                    name: values.name,
                    companyName:
                        values.companyName || undefined,
                    contactPerson:
                        values.contactPerson || undefined,
                    email: values.email || undefined,
                    phoneNumber:
                        values.phoneNumber || undefined,
                    address: values.address || undefined,
                    notes: values.notes || undefined,
                });
            }

            setSubmitError(null);
            onSuccess();
        } catch (error: unknown) {
            console.error("Failed to save client:", error);

            setSubmitError(
                getApiErrorMessage(
                    error,
                    client
                        ? "Failed to update client."
                        : "Failed to create client."
                )
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="clientNumber">
                        Client Number
                    </Label>

                    <Input
                        id="clientNumber"
                        placeholder="CLI-001"
                        disabled={isSubmitting}
                        {...register("clientNumber")}
                    />

                    {errors.clientNumber && (
                        <p className="text-sm text-destructive">
                            {errors.clientNumber.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">
                        Name *
                    </Label>

                    <Input
                        id="name"
                        placeholder="Client name"
                        disabled={isSubmitting}
                        {...register("name")}
                    />

                    {errors.name && (
                        <p className="text-sm text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="companyName">
                    Company Name
                </Label>

                <Input
                    id="companyName"
                    placeholder="Company name"
                    disabled={isSubmitting}
                    {...register("companyName")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contactPerson">
                    Contact Person
                </Label>

                <Input
                    id="contactPerson"
                    placeholder="John Smith"
                    disabled={isSubmitting}
                    {...register("contactPerson")}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                        {...register("email")}
                    />

                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                        Phone Number
                    </Label>

                    <Input
                        id="phoneNumber"
                        placeholder="09171234567"
                        disabled={isSubmitting}
                        {...register("phoneNumber")}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">
                    Address
                </Label>

                <Input
                    id="address"
                    placeholder="Client address"
                    disabled={isSubmitting}
                    {...register("address")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">
                    Notes
                </Label>

                <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    rows={4}
                    disabled={isSubmitting}
                    {...register("notes")}
                />
            </div>

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
                        ? client
                            ? "Saving..."
                            : "Adding..."
                        : client
                            ? "Save Changes"
                            : "Add Client"}
                </Button>
            </div>
        </form>
    );
}