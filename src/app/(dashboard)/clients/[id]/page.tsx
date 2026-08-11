"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ClientDialog } from "@/components/clients/client-dialog";
import { getClient } from "@/lib/api/clients";

export default function ClientDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [editOpen, setEditOpen] = useState(false);

    const clientId = params.id;

    const {
        data: client,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["client", clientId],
        queryFn: () => getClient(clientId),
        enabled: !!clientId,
    });

    // Loading
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />

                <div className="h-40 animate-pulse rounded-lg bg-muted" />
            </div>
        );
    }

    // Error / not found
    if (isError || !client) {
        return (
            <div className="space-y-4">
                <Link href="/clients">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Clients
                    </Button>
                </Link>

                <div className="rounded-lg border p-8 text-center">
                    <h2 className="text-lg font-semibold">
                        Client not found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        The client you're looking for doesn't exist or could
                        not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    // Edit success
    const handleEditSuccess = async () => {
        setEditOpen(false);

        // Refresh this client's detail data
        await queryClient.invalidateQueries({
            queryKey: ["client", clientId],
        });

        // Refresh the clients table as well
        await queryClient.invalidateQueries({
            queryKey: ["clients"],
        });
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">

                    {/* Back */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="size-4" />
                        <span className="sr-only">
                            Back
                        </span>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            {client.name}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            {client.clientNumber}
                        </p>
                    </div>
                </div>

                {/* Edit */}
                <Button
                    onClick={() => setEditOpen(true)}
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Client
                </Button>
            </div>

            {/* Status */}
            <div>
                <span
                    className={
                        client.isActive
                            ? "inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    }
                >
                    {client.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Client Information */}
            <div className="grid gap-6 md:grid-cols-2">

                {/* Client Information */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold">
                        Client Information
                    </h2>

                    <div className="mt-6 space-y-4">

                        <DetailRow
                            label="Client Name"
                            value={client.name}
                        />

                        <DetailRow
                            label="Company Name"
                            value={client.companyName}
                        />

                        <DetailRow
                            label="Client Number"
                            value={client.clientNumber}
                        />

                        <DetailRow
                            label="Contact Person"
                            value={client.contactPerson}
                        />

                    </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold">
                        Contact Information
                    </h2>

                    <div className="mt-6 space-y-4">

                        <DetailRow
                            label="Email"
                            value={client.email}
                        />

                        <DetailRow
                            label="Phone Number"
                            value={client.phoneNumber}
                        />

                        <DetailRow
                            label="Address"
                            value={client.address}
                        />

                    </div>
                </div>
            </div>

            {/* Notes */}
            {client.notes && (
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold">
                        Notes
                    </h2>

                    <p className="mt-4 text-sm text-muted-foreground">
                        {client.notes}
                    </p>
                </div>
            )}

            {/* Edit Client Dialog */}
            <ClientDialog
                client={client}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={handleEditSuccess}
            />

        </div>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-sm">
                {value || "—"}
            </p>
        </div>
    );
}