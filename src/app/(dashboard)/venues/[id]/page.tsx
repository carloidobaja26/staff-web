"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    MapPin,
    User,
    Phone,
    Navigation,
    FileText,
    Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getVenue,
} from "@/lib/api/venues";

import { VenueDialog } from "@/components/venues/venue-dialog";


export default function VenueDetailsPage() {
    const params = useParams();

    const venueId = params.id as string;

    const [editOpen, setEditOpen] =
        useState(false);

    const queryClient =
        useQueryClient();


    const {
        data: venue,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "venue",
            venueId,
        ],

        queryFn: () =>
            getVenue(venueId),

        enabled: !!venueId,
    });


    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8">
                <p className="text-sm text-muted-foreground">
                    Loading venue...
                </p>
            </div>
        );
    }


    if (isError || !venue) {
        return (
            <div className="space-y-4">

                <Button
                    variant="outline"
                    size="sm"
                    asChild
                >
                    <Link href="/venues">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Venues
                    </Link>
                </Button>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load venue
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The venue could not be loaded."}
                    </p>


                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => refetch()}
                    >
                        Try Again
                    </Button>

                </div>

            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Back */}
            <Button
                variant="outline"
                size="sm"
                asChild
            >
                <Link href="/venues">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Venues
                </Link>
            </Button>


            {/* Header */}
            <div className="rounded-xl border bg-card p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    {/* Venue Information */}
                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                            <div>

                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {venue.name}
                                </h1>

                                {venue.city && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {venue.city}
                                        {venue.province
                                            ? `, ${venue.province}`
                                            : ""}
                                    </p>
                                )}

                            </div>


                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                    venue.isActive
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {venue.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>

                        </div>

                    </div>


                    {/* Edit Button */}
                    <div className="flex shrink-0">

                        <Button
                            type="button"
                            onClick={() =>
                                setEditOpen(true)
                            }
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit Venue
                        </Button>

                    </div>

                </div>

            </div>


            {/* Location Information */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Location Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Address and geographic information for this venue.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <DetailItem
                        icon={MapPin}
                        label="Address"
                        value={venue.address}
                    />

                    <DetailItem
                        icon={MapPin}
                        label="City"
                        value={venue.city}
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Province"
                        value={venue.province}
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Postal Code"
                        value={venue.postalCode}
                    />

                    <DetailItem
                        icon={Navigation}
                        label="Latitude"
                        value={
                            venue.latitude != null
                                ? String(venue.latitude)
                                : null
                        }
                    />

                    <DetailItem
                        icon={Navigation}
                        label="Longitude"
                        value={
                            venue.longitude != null
                                ? String(venue.longitude)
                                : null
                        }
                    />

                </div>

            </div>


            {/* Contact Information */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Contact Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Contact details for this venue.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <DetailItem
                        icon={User}
                        label="Contact Person"
                        value={venue.contactPerson}
                    />

                    <DetailItem
                        icon={Phone}
                        label="Contact Number"
                        value={venue.contactNumber}
                    />

                </div>

            </div>


            {/* Notes */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Notes
                    </h2>

                </div>


                <div className="p-6">

                    <div className="flex items-start gap-3">

                        <div className="rounded-md bg-muted p-2">
                            <FileText className="size-4 text-muted-foreground" />
                        </div>

                        <p className="whitespace-pre-wrap text-sm">
                            {venue.notes || "No notes available."}
                        </p>

                    </div>

                </div>

            </div>


            {/* Edit Venue Dialog */}
            <VenueDialog
                venue={venue}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={() => {

                    queryClient.invalidateQueries({
                        queryKey: [
                            "venue",
                            venueId,
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["venues"],
                    });

                }}
            />

        </div>
    );
}


type DetailItemProps = {
    icon: React.ElementType;
    label: string;
    value?: string | null;
};


function DetailItem({
    icon: Icon,
    label,
    value,
}: DetailItemProps) {
    return (
        <div className="flex items-start gap-3">

            <div className="rounded-md bg-muted p-2">
                <Icon className="size-4 text-muted-foreground" />
            </div>


            <div className="min-w-0">

                <p className="text-sm text-muted-foreground">
                    {label}
                </p>


                <p className="mt-1 break-words font-medium">
                    {value || "—"}
                </p>

            </div>

        </div>
    );
}

