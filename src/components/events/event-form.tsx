"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    getVenuesByTenant,
} from "@/lib/api/venues";

import {
    getAgency,
    getAgencyClientsPaginated,
} from "@/lib/api/agencies";

import {
    createEvent,
    updateEvent,
    type Event,
} from "@/lib/api/events";

import { CURRENT_TENANT_ID } from "@/constants/tenant";
import { useAgencyStore } from "@/stores/agency-store";

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
     * Global agency
     *
     * The selected agency is now controlled
     * by Zustand.
     */
    const agencyId = useAgencyStore(
        (state) => state.agencyId
    );

    /*
     * If there is no selected agency,
     * the form cannot be used.
     */
    if (!agencyId) {
        return (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-center">
                <p className="text-sm font-medium text-destructive">
                    No agency selected.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    Please select an agency before creating or editing an event.
                </p>

                <div className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    /*
     * Client pagination / search
     */
    const [clientSearch, setClientSearch] =
        useState("");

    const [
        clientPageNumber,
        setClientPageNumber,
    ] = useState(1);

    const clientPageSize = 10;

    /*
     * Agency
     */
    const {
        data: agency,
        isLoading: agencyLoading,
    } = useQuery({
        queryKey: [
            "agency",
            agencyId,
        ],

        queryFn: () =>
            getAgency(agencyId),

        enabled: !!agencyId,
    });

    /*
     * Venues
     */
    const {
        data: venues = [],
        isLoading: venuesLoading,
    } = useQuery({
        queryKey: [
            "venues",
            CURRENT_TENANT_ID,
        ],

        queryFn: () =>
            getVenuesByTenant(
                CURRENT_TENANT_ID
            ),
    });

    /*
     * Clients
     *
     * Clients are scoped to the selected
     * agency and loaded using pagination
     * and search.
     */
    const {
        data: clientsData,
        isLoading: clientsLoading,
    } = useQuery({
        queryKey: [
            "agency-event-clients",
            agencyId,
            clientPageNumber,
            clientPageSize,
            clientSearch,
        ],

        queryFn: () =>
            getAgencyClientsPaginated(
                agencyId,
                {
                    pageNumber:
                        clientPageNumber,

                    pageSize:
                        clientPageSize,

                    search:
                        clientSearch.trim() ||
                        undefined,
                }
            ),

        enabled: !!agencyId,
    });

    const clients =
        clientsData?.items ?? [];

    const clientTotalNumber =
        clientsData?.totalNumber ?? 0;

    const clientTotalPages =
        Math.ceil(
            clientTotalNumber /
            clientPageSize
        );

    /*
     * Form
     */
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
                agencyId,

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

    const selectedClient =
        watch("clientId");

    const selectedVenue =
        watch("venueId");

    /*
     * If the form is opened from the
     * Client Details page, keep the
     * client locked.
     */
    const isClientLocked =
        !event && !!clientId;

    /*
     * Submit
     */
    const onSubmit = async (
        values: EventFormValues
    ) => {
        setSubmitError(null);

        /*
         * Make sure the global agency still
         * exists before submitting.
         */
        if (!agencyId) {
            setSubmitError(
                "Please select an agency before saving the event."
            );

            return;
        }

        /*
         * Validate date range.
         */
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
                await updateEvent(
                    event.id,
                    {
                        agencyId:
                            agencyId,

                        clientId:
                            selectedClientId,

                        venueId:
                            values.venueId ||
                            null,

                        eventNumber:
                            values.eventNumber,

                        name:
                            values.name,

                        description:
                            values.description ||
                            undefined,

                        type:
                            Number(
                                values.type
                            ),

                        startDateTime:
                            new Date(
                                values.startDateTime
                            ).toISOString(),

                        endDateTime:
                            new Date(
                                values.endDateTime
                            ).toISOString(),

                        status:
                            event.status,

                        isActive:
                            event.isActive,
                    }
                );
            } else {
                await createEvent({
                    tenantId:
                        CURRENT_TENANT_ID,

                    agencyId:
                        agencyId,

                    clientId:
                        selectedClientId,

                    venueId:
                        values.venueId ||
                        null,

                    eventNumber:
                        values.eventNumber,

                    name:
                        values.name,

                    description:
                        values.description ||
                        undefined,

                    type:
                        Number(
                            values.type
                        ),

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
                                errors
                                    .name
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Agency */}
            <div className="space-y-2">
                <Label>
                    Agency
                </Label>

                <Input
                    value={
                        agencyLoading
                            ? "Loading agency..."
                            : agency?.name ??
                            "Unknown agency"
                    }
                    readOnly
                    disabled
                />

                {errors.agencyId && (
                    <p className="text-sm text-destructive">
                        {
                            errors
                                .agencyId
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Client */}
            {clientId ? (
                <div className="space-y-2">
                    <Label>Client</Label>

                    <Input
                        value={
                            clients.find(
                                (client) => client.id === clientId
                            )?.name ?? "Loading client..."
                        }
                        readOnly
                        disabled
                    />

                    {errors.clientId && (
                        <p className="text-sm text-destructive">
                            {errors.clientId.message}
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <Label>Client</Label>

                    <Select
                        value={selectedClient}
                        onValueChange={(value) => {
                            setValue("clientId", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    clientsLoading
                                        ? "Loading clients..."
                                        : "Select client"
                                }
                            />
                        </SelectTrigger>
                        {/* Explicitly set position to popper and add offset */}
                        <SelectContent
                            position="popper"
                            sideOffset={4}
                            className="p-0 w-[var(--radix-select-trigger-width)]"
                        >
                            <div
                                className="border-b p-2"
                                onPointerDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                            >
                                <Input
                                    placeholder="Search clients..."
                                    value={clientSearch}
                                    onChange={(e) => {
                                        setClientSearch(e.target.value);
                                        setClientPageNumber(1);
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>

                            <div className="max-h-48 overflow-y-auto p-1">
                                {clientsLoading ? (
                                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                        Loading clients...
                                    </div>
                                ) : clients.length === 0 ? (
                                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                        No clients found.
                                    </div>
                                ) : (
                                    clients.map((client) => (
                                        <SelectItem
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.name}
                                        </SelectItem>
                                    ))
                                )}
                            </div>

                            {!clientsLoading && clientTotalPages > 1 && (
                                <div
                                    className="flex items-center justify-between gap-2 border-t p-2"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={clientPageNumber <= 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setClientPageNumber(
                                                (page) => page - 1
                                            );
                                        }}
                                    >
                                        Previous
                                    </Button>

                                    <span className="text-xs text-muted-foreground">
                                        {clientPageNumber} / {clientTotalPages}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            clientPageNumber >=
                                            clientTotalPages
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setClientPageNumber(
                                                (page) => page + 1
                                            );
                                        }}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Venue */}
            <div className="space-y-2">
                <Label>
                    Venue
                </Label>

                <Select
                    value={
                        selectedVenue ||
                        "none"
                    }
                    onValueChange={(
                        value
                    ) =>
                        setValue(
                            "venueId",
                            value ===
                                "none"
                                ? ""
                                : value,
                            {
                                shouldValidate:
                                    true,
                            }
                        )
                    }
                    disabled={
                        venuesLoading
                    }
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
                            .filter(
                                (
                                    venue
                                ) =>
                                    venue.isActive
                            )
                            .map(
                                (
                                    venue
                                ) => (
                                    <SelectItem
                                        key={
                                            venue.id
                                        }
                                        value={
                                            venue.id
                                        }
                                    >
                                        {
                                            venue.name
                                        }
                                    </SelectItem>
                                )
                            )}
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
                            (
                                type
                            ) => (
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
                            errors
                                .type
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