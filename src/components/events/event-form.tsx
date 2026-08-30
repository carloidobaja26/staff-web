"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getVenuesByTenant } from "@/lib/api/venues";
import { getAgenciesByTenant } from "@/lib/api/agencies";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    createEvent,
    updateEvent,
    type Event,
} from "@/lib/api/events";

import { CURRENT_TENANT_ID } from "@/constants/tenant";

const eventSchema = z.object({
    eventNumber: z
        .string()
        .min(1, "Event number is required"),


    name: z
        .string()
        .min(1, "Event name is required"),

    agencyId: z
        .string()
        .min(1, "Agency is required"),

    clientId: z
        .string()
        .min(1, "Client is required"),

    venueId: z
        .string()
        .optional(),

    type: z
        .string()
        .min(1, "Event type is required"),

    startDateTime: z
        .string()
        .min(1, "Start date and time is required"),

    endDateTime: z
        .string()
        .min(1, "End date and time is required"),

    description: z
        .string()
        .optional(),

});

type EventFormValues =
    z.infer<typeof eventSchema>;

type EventFormProps = {
    event?: Event;

    clientId?: string;

    onSuccess: () => void;

    onCancel: () => void;

};

const eventTypes = [
    { value: "1", label: "Corporate" },
    { value: "2", label: "Concert" },
    { value: "3", label: "Festival" },
    { value: "4", label: "Wedding" },
    { value: "5", label: "Sports" },
    { value: "6", label: "Exhibition" },
    { value: "7", label: "Trade Show" },
    { value: "8", label: "Private" },
    { value: "9", label: "Other" },
];

function toDateTimeLocal(
    value?: string | null
) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const offset =
        date.getTimezoneOffset();

    const localDate = new Date(
        date.getTime() -
        offset * 60 * 1000
    );

    return localDate
        .toISOString()
        .slice(0, 16);

}

export function EventForm({
    event,
    clientId,
    onSuccess,
    onCancel,
}: EventFormProps) {
    const [submitError, setSubmitError] =
        useState<string | null>(null);

    /*
     * Temporary relationship data.
     *
     * Replace these with your actual
     * Agency / Client / Venue queries.
     */

    const [clients] = useState<
        { id: string; name: string }[]
    >([]);

    const {
        data: venues = [],
        isLoading: venuesLoading,
    } = useQuery({
        queryKey: ["venues", CURRENT_TENANT_ID],
        queryFn: () =>
            getVenuesByTenant(CURRENT_TENANT_ID),
    });

    const {
        data: agencies = [],
        isLoading: agenciesLoading,
    } = useQuery({
        queryKey: ["agencies", CURRENT_TENANT_ID],
        queryFn: () =>
            getAgenciesByTenant(CURRENT_TENANT_ID),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<EventFormValues>({
        resolver:
            zodResolver(eventSchema),

        defaultValues: {
            eventNumber:
                event?.eventNumber ?? "",

            name:
                event?.name ?? "",

            agencyId:
                event?.agencyId ?? "",

            /*
             * Important:
             *
             * When creating from the Client
             * Details page, use the clientId
             * supplied by the parent.
             */
            clientId:
                clientId ??
                event?.clientId ??
                "",

            venueId:
                event?.venueId ?? "",

            type: event
                ? String(event.type)
                : "9",

            startDateTime:
                toDateTimeLocal(
                    event?.startDateTime
                ),

            endDateTime:
                toDateTimeLocal(
                    event?.endDateTime
                ),

            description:
                event?.description ?? "",
        },
    });

    const selectedType =
        watch("type");

    const selectedAgency =
        watch("agencyId");

    const selectedClient =
        watch("clientId");

    const selectedVenue =
        watch("venueId");

    /*
     * If clientId is provided by the parent
     * and we're creating a new event,
     * the client is already known.
     */
    const isClientLocked =
        !event && !!clientId;

    const onSubmit = async (
        values: EventFormValues
    ) => {
        setSubmitError(null);

        if (
            new Date(
                values.endDateTime
            ) <=
            new Date(
                values.startDateTime
            )
        ) {
            setSubmitError(
                "End date and time must be after the start date and time."
            );

            return;
        }

        /*
         * Client coming from Client Details
         * takes priority over the form value.
         */
        const selectedClientId =
            clientId ??
            values.clientId;

        try {
            if (event) {
                await updateEvent(event.id, {
                    agencyId: values.agencyId,
                    clientId: clientId ?? values.clientId,
                    venueId: values.venueId || null,
                    eventNumber: values.eventNumber,
                    name: values.name,
                    description: values.description || undefined,
                    type: Number(values.type),
                    startDateTime: new Date(
                        values.startDateTime
                    ).toISOString(),

                    endDateTime: new Date(
                        values.endDateTime
                    ).toISOString(),
                    status: event.status,
                    isActive: event.isActive,
                });
            } else {
                await createEvent({
                    tenantId: CURRENT_TENANT_ID,
                    agencyId: values.agencyId,
                    clientId: clientId ?? values.clientId,
                    venueId: values.venueId || null,
                    eventNumber: values.eventNumber,
                    name: values.name,
                    description: values.description || undefined,
                    type: Number(values.type),
                    startDateTime: new Date(
                        values.startDateTime
                    ).toISOString(),

                    endDateTime: new Date(
                        values.endDateTime
                    ).toISOString(),
                });
            }

            onSuccess();
        } catch (error) {
            console.error(
                "Failed to save event:",
                error
            );

            setSubmitError(
                event
                    ? "Failed to update event. Please try again."
                    : "Failed to create event. Please try again."
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(
                onSubmit
            )}
            className="space-y-5"
        >
            {submitError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {submitError}
                </div>
            )}

            {/* Event Number + Name */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="eventNumber">
                        Event Number
                    </Label>

                    <Input
                        id="eventNumber"
                        placeholder="EVT-001"
                        {...register(
                            "eventNumber"
                        )}
                    />

                    {errors.eventNumber && (
                        <p className="text-sm text-destructive">
                            {
                                errors
                                    .eventNumber
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">
                        Event Name
                    </Label>

                    <Input
                        id="name"
                        placeholder="Company Annual Party"
                        {...register(
                            "name"
                        )}
                    />

                    {errors.name && (
                        <p className="text-sm text-destructive">
                            {
                                errors.name
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Agency + Client */}
            <div
                className={
                    isClientLocked
                        ? "grid gap-4 sm:grid-cols-1"
                        : "grid gap-4 sm:grid-cols-2"
                }
            >
                {/* Agency */}
                <div className="space-y-2">
                    <Label>Agency</Label>

                    <Select
                        value={selectedAgency || ""}
                        onValueChange={(value) =>
                            setValue(
                                "agencyId",
                                value,
                                {
                                    shouldValidate: true,
                                }
                            )
                        }
                        disabled={agenciesLoading}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    agenciesLoading
                                        ? "Loading agencies..."
                                        : "Select agency"
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {agencies
                                .filter((agency) => agency.isActive)
                                .map((agency) => (
                                    <SelectItem
                                        key={agency.id}
                                        value={agency.id}
                                    >
                                        {agency.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {errors.agencyId && (
                        <p className="text-sm text-destructive">
                            {errors.agencyId.message}
                        </p>
                    )}
                </div>


                {/* Client */}
                <div className="space-y-2">
                    <Label>Client</Label>

                    <Input
                        value={clientId ?? event?.clientId ?? ""}
                        disabled
                    />
                </div>
            </div>

            {/* Venue */}
            <div className="space-y-2">
                <Label>Venue</Label>

                <Select
                    value={selectedVenue || "none"}
                    onValueChange={(value) =>
                        setValue(
                            "venueId",
                            value === "none" ? "" : value,
                            {
                                shouldValidate: true,
                            }
                        )
                    }
                    disabled={venuesLoading}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={
                                venuesLoading
                                    ? "Loading venues..."
                                    : "Select venue (optional)"
                            }
                        />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="none">
                            No venue
                        </SelectItem>

                        {venues
                            .filter((venue) => venue.isActive)
                            .map((venue) => (
                                <SelectItem
                                    key={venue.id}
                                    value={venue.id}
                                >
                                    {venue.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>


            {/* Event Type */}
            <div className="space-y-2">
                <Label>
                    Event Type
                </Label>

                <Select
                    value={
                        selectedType ||
                        "9"
                    }
                    onValueChange={(
                        value
                    ) =>
                        setValue(
                            "type",
                            value,
                            {
                                shouldValidate:
                                    true,
                            }
                        )
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                    </SelectTrigger>

                    <SelectContent>
                        {eventTypes.map(
                            (type) => (
                                <SelectItem
                                    key={
                                        type.value
                                    }
                                    value={
                                        type.value
                                    }
                                >
                                    {
                                        type.label
                                    }
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>

                {errors.type && (
                    <p className="text-sm text-destructive">
                        {
                            errors.type
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Date / Time */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="startDateTime">
                        Start Date & Time
                    </Label>

                    <Input
                        id="startDateTime"
                        type="datetime-local"
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
                        End Date & Time
                    </Label>

                    <Input
                        id="endDateTime"
                        type="datetime-local"
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

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Textarea
                    id="description"
                    placeholder="Additional information about this event..."
                    rows={4}
                    {...register(
                        "description"
                    )}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={
                        isSubmitting
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        isSubmitting
                    }
                >
                    {isSubmitting
                        ? event
                            ? "Saving..."
                            : "Creating..."
                        : event
                            ? "Save Changes"
                            : "Create Event"}
                </Button>
            </div>
        </form>
    );

}
