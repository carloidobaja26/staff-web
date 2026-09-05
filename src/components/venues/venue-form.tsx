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
    createVenue,
    updateVenue,
    type Venue,
} from "@/lib/api/venues";

import { CURRENT_TENANT_ID } from "@/constants/tenant";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

const venueSchema = z.object({
    name: z.string().min(1, "Venue name is required"),

    address: z.string().optional(),

    city: z.string().optional(),

    province: z.string().optional(),

    postalCode: z.string().optional(),

    contactPerson: z.string().optional(),

    contactNumber: z.string().optional(),

    latitude: z
        .string()
        .optional(),

    longitude: z
        .string()
        .optional(),

    notes: z.string().optional(),

    isActive: z.boolean(),
});

type VenueFormValues =
    z.infer<typeof venueSchema>;

type VenueFormProps = {
    venue?: Venue;
    onSuccess: () => void;
    onCancel: () => void;
};

export function VenueForm({
    venue,
    onSuccess,
    onCancel,
}: VenueFormProps) {
    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<VenueFormValues>({
        resolver: zodResolver(venueSchema),

        defaultValues: {
            name: venue?.name ?? "",

            address: venue?.address ?? "",

            city: venue?.city ?? "",

            province: venue?.province ?? "",

            postalCode: venue?.postalCode ?? "",

            contactPerson:
                venue?.contactPerson ?? "",

            contactNumber:
                venue?.contactNumber ?? "",

            latitude:
                venue?.latitude != null
                    ? String(venue.latitude)
                    : "",

            longitude:
                venue?.longitude != null
                    ? String(venue.longitude)
                    : "",

            notes: venue?.notes ?? "",

            isActive:
                venue?.isActive ?? true,
        },
    });

    const onSubmit = async (
        values: VenueFormValues
    ) => {
        setSubmitError(null);

        try {
            const latitude =
                values.latitude?.trim()
                    ? Number(values.latitude)
                    : null;

            const longitude =
                values.longitude?.trim()
                    ? Number(values.longitude)
                    : null;

            if (
                values.latitude?.trim() &&
                Number.isNaN(latitude)
            ) {
                throw new Error(
                    "Latitude must be a valid number."
                );
            }

            if (
                values.longitude?.trim() &&
                Number.isNaN(longitude)
            ) {
                throw new Error(
                    "Longitude must be a valid number."
                );
            }

            if (venue) {
                await updateVenue(
                    venue.id,
                    {
                        name: values.name,

                        address:
                            values.address || undefined,

                        city:
                            values.city || undefined,

                        province:
                            values.province || undefined,

                        postalCode:
                            values.postalCode || undefined,

                        contactPerson:
                            values.contactPerson || undefined,

                        contactNumber:
                            values.contactNumber || undefined,

                        latitude,

                        longitude,

                        notes:
                            values.notes || undefined,

                        isActive:
                            values.isActive,
                    }
                );
            } else {
                await createVenue({
                    tenantId:
                        CURRENT_TENANT_ID,

                    name: values.name,

                    address:
                        values.address || undefined,

                    city:
                        values.city || undefined,

                    province:
                        values.province || undefined,

                    postalCode:
                        values.postalCode || undefined,

                    contactPerson:
                        values.contactPerson || undefined,

                    contactNumber:
                        values.contactNumber || undefined,

                    latitude,

                    longitude,

                    notes:
                        values.notes || undefined,
                });
            }

            setSubmitError(null);
            onSuccess();
        } catch (error) {
            console.error(
                "Failed to save venue:",
                error
            );

            setSubmitError(
                getApiErrorMessage(
                    error,
                    venue
                        ? "Failed to update venue."
                        : "Failed to create venue."
                )
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* Submit Error */}
            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                    <p className="text-sm text-destructive">
                        {submitError}
                    </p>
                </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold">
                        Basic Information
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter the basic details of the venue.
                    </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Venue Name *
                    </Label>

                    <Input
                        id="name"
                        placeholder="Grand Ballroom"
                        disabled={isSubmitting}
                        {...register("name")}
                    />

                    {errors.name && (
                        <p className="text-sm text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address">
                        Address
                    </Label>

                    <Input
                        id="address"
                        placeholder="123 Main Street"
                        disabled={isSubmitting}
                        {...register("address")}
                    />
                </div>

                {/* City / Province */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="city">
                            City
                        </Label>

                        <Input
                            id="city"
                            placeholder="Makati"
                            disabled={isSubmitting}
                            {...register("city")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="province">
                            Province
                        </Label>

                        <Input
                            id="province"
                            placeholder="Metro Manila"
                            disabled={isSubmitting}
                            {...register("province")}
                        />
                    </div>
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                    <Label htmlFor="postalCode">
                        Postal Code
                    </Label>

                    <Input
                        id="postalCode"
                        placeholder="1200"
                        disabled={isSubmitting}
                        {...register("postalCode")}
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t pt-5">
                <div>
                    <h3 className="text-sm font-semibold">
                        Contact Information
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Contact details for this venue.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Contact Person */}
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

                    {/* Contact Number */}
                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">
                            Contact Number
                        </Label>

                        <Input
                            id="contactNumber"
                            placeholder="09171234567"
                            disabled={isSubmitting}
                            {...register("contactNumber")}
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4 border-t pt-5">
                <div>
                    <h3 className="text-sm font-semibold">
                        Location
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Optional geographic coordinates for the venue.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Latitude */}
                    <div className="space-y-2">
                        <Label htmlFor="latitude">
                            Latitude
                        </Label>

                        <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="14.5547"
                            disabled={isSubmitting}
                            {...register("latitude")}
                        />

                        {errors.latitude && (
                            <p className="text-sm text-destructive">
                                {errors.latitude.message}
                            </p>
                        )}
                    </div>

                    {/* Longitude */}
                    <div className="space-y-2">
                        <Label htmlFor="longitude">
                            Longitude
                        </Label>

                        <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="121.0244"
                            disabled={isSubmitting}
                            {...register("longitude")}
                        />

                        {errors.longitude && (
                            <p className="text-sm text-destructive">
                                {errors.longitude.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 border-t pt-5">
                <Label htmlFor="notes">
                    Notes
                </Label>

                <Textarea
                    id="notes"
                    placeholder="Additional notes about this venue..."
                    rows={4}
                    disabled={isSubmitting}
                    {...register("notes")}
                />
            </div>

            {/* Status */}
            {venue && (
                <div className="flex items-center justify-between border-t pt-5">
                    <div>
                        <Label>
                            Status
                        </Label>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Set whether this venue is currently active.
                        </p>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            className="size-4 rounded border-input"
                            disabled={isSubmitting}
                            {...register("isActive")}
                        />

                        <span className="text-sm">
                            Active
                        </span>
                    </label>
                </div>
            )}

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
                        ? venue
                            ? "Saving..."
                            : "Adding..."
                        : venue
                            ? "Save Changes"
                            : "Add Venue"}
                </Button>
            </div>
        </form>
    );
}