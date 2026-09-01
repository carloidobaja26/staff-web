"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Mail,
    MapPin,
    Pencil,
    Phone,
    UserRound,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    getAgency,
} from "@/lib/api/agencies";

import { AgencyForm } from "./agency-form";
import { AgencyWorkers } from "./agency-workers";
import { AgencyClients } from "./agency-clients";
import { AgencyEvents } from "./agency-events";


export function AgencyDetails() {

    const params = useParams();
    const router = useRouter();

    const queryClient = useQueryClient();

    const agencyId =
        typeof params.id === "string"
            ? params.id
            : "";

    const [editOpen, setEditOpen] =
        useState(false);


    const {
        data: agency,
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "agency",
            agencyId,
        ],

        queryFn: () =>
            getAgency(agencyId),

        enabled: !!agencyId,

    });


    /* ---------------------------------------------------------------------- */
    /* Loading                                                                */
    /* ---------------------------------------------------------------------- */

    if (isLoading) {

        return (
            <div className="space-y-6">

                <div className="flex items-center gap-3">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            router.back()
                        }
                    >
                        <ArrowLeft className="size-4" />
                    </Button>

                    <div>

                        <div className="h-6 w-40 animate-pulse rounded bg-muted" />

                        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />

                    </div>

                </div>


                <div className="rounded-xl border p-6">

                    <div className="space-y-4">

                        <div className="h-5 w-32 animate-pulse rounded bg-muted" />

                        <div className="grid gap-4 sm:grid-cols-2">

                            <div className="h-16 animate-pulse rounded bg-muted" />

                            <div className="h-16 animate-pulse rounded bg-muted" />

                            <div className="h-16 animate-pulse rounded bg-muted" />

                            <div className="h-16 animate-pulse rounded bg-muted" />

                        </div>

                    </div>

                </div>

            </div>
        );

    }


    /* ---------------------------------------------------------------------- */
    /* Error                                                                  */
    /* ---------------------------------------------------------------------- */

    if (isError || !agency) {

        return (
            <div className="space-y-6">

                <Button
                    variant="ghost"
                    onClick={() =>
                        router.back()
                    }
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Agencies
                </Button>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">

                    <p className="font-medium text-destructive">
                        Failed to load agency.
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        The agency could not be found
                        or could not be loaded.
                    </p>

                </div>

            </div>
        );

    }


    /* ---------------------------------------------------------------------- */
    /* Refresh Agency                                                         */
    /* ---------------------------------------------------------------------- */

    function refreshAgency() {

        queryClient.invalidateQueries({
            queryKey: [
                "agency",
                agencyId,
            ],
        });

    }


    return (
        <div className="space-y-6">

            {/* ---------------------------------------------------------------- */}
            {/* Header                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-3">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            router.back()
                        }
                    >
                        <ArrowLeft className="size-4" />
                    </Button>


                    <div className="flex items-start gap-3">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">

                            <Building2 className="size-5 text-muted-foreground" />

                        </div>


                        <div>

                            <h1 className="text-xl font-semibold">
                                {agency.name}
                            </h1>

                            {agency.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {agency.description}
                                </p>
                            )}

                        </div>

                    </div>

                </div>


                <Button
                    variant="outline"
                    onClick={() =>
                        setEditOpen(true)
                    }
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Agency
                </Button>

            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Status                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div>

                <span
                    className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        ${
                            agency.isActive
                                ? "bg-green-500/10 text-green-600"
                                : "bg-muted text-muted-foreground"
                        }
                    `}
                >
                    {agency.isActive
                        ? "Active"
                        : "Inactive"}
                </span>

            </div>


            {/* ---------------------------------------------------------------- */}
            {/* Agency Information                                               */}
            {/* ---------------------------------------------------------------- */}

            <section className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">

                    <h2 className="font-semibold">
                        Agency Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Contact and general information
                        about this agency.
                    </p>

                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <InfoItem
                        icon={
                            <Mail className="size-4" />
                        }
                        label="Email"
                        value={
                            agency.email ||
                            "—"
                        }
                    />


                    <InfoItem
                        icon={
                            <Phone className="size-4" />
                        }
                        label="Phone"
                        value={
                            agency.phoneNumber ||
                            "—"
                        }
                    />


                    <InfoItem
                        icon={
                            <MapPin className="size-4" />
                        }
                        label="Address"
                        value={
                            agency.address ||
                            "—"
                        }
                    />


                    <InfoItem
                        icon={
                            <UserRound className="size-4" />
                        }
                        label="Manager"
                        value={
                            agency.managerUserId ||
                            "—"
                        }
                    />

                </div>

            </section>


            {/* ---------------------------------------------------------------- */}
            {/* Workers                                                          */}
            {/* ---------------------------------------------------------------- */}

            <section className="rounded-xl border bg-card">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div className="flex items-center gap-2">

                        <Users className="size-4 text-muted-foreground" />

                        <div>

                            <h2 className="font-semibold">
                                Workers
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Workers belonging to this agency.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="p-6">

                    <AgencyWorkers
                        agencyId={agency.id}
                    />

                </div>

            </section>


            {/* ---------------------------------------------------------------- */}
            {/* Clients                                                          */}
            {/* ---------------------------------------------------------------- */}

            <section className="rounded-xl border bg-card">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div className="flex items-center gap-2">

                        <Building2 className="size-4 text-muted-foreground" />

                        <div>

                            <h2 className="font-semibold">
                                Clients
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Clients belonging to this agency.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="p-6">

                    <AgencyClients
                        agencyId={agency.id}
                    />

                </div>

            </section>


            {/* ---------------------------------------------------------------- */}
            {/* Events                                                           */}
            {/* ---------------------------------------------------------------- */}

            <section className="rounded-xl border bg-card">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div className="flex items-center gap-2">

                        <CalendarDays className="size-4 text-muted-foreground" />

                        <div>

                            <h2 className="font-semibold">
                                Events
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Events managed by this agency.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="p-6">

                    <AgencyEvents
                        agencyId={agency.id}
                    />

                </div>

            </section>


            {/* ---------------------------------------------------------------- */}
            {/* Edit Agency Dialog                                               */}
            {/* ---------------------------------------------------------------- */}

            <Dialog
                open={editOpen}
                onOpenChange={setEditOpen}
            >

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Edit Agency
                        </DialogTitle>

                    </DialogHeader>


                    <AgencyForm
                        agency={agency}
                        onSuccess={() => {

                            setEditOpen(false);

                            refreshAgency();

                        }}
                        onCancel={() =>
                            setEditOpen(false)
                        }
                    />

                </DialogContent>

            </Dialog>

        </div>
    );
}


/* -------------------------------------------------------------------------- */
/* Info Item                                                                  */
/* -------------------------------------------------------------------------- */

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {

    return (
        <div className="flex items-start gap-3">

            <div className="mt-0.5 text-muted-foreground">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium">
                    {value}
                </p>

            </div>

        </div>
    );
}