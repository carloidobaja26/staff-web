"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    CalendarDays,
    Hash,
    Mail,
    Pencil,
    Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getWorker } from "@/lib/api/workers";
import { WorkerDialog } from "@/components/workers/worker-dialog";


export default function WorkerDetailsPage() {
    const params = useParams();

    const workerId = params.id as string;

    const [editOpen, setEditOpen] = useState(false);

    const queryClient = useQueryClient();

    const {
        data: worker,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["worker", workerId],
        queryFn: () => getWorker(workerId),
        enabled: !!workerId,
    });


    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card p-8">
                <p className="text-sm text-muted-foreground">
                    Loading worker...
                </p>
            </div>
        );
    }


    if (isError || !worker) {
        return (
            <div className="space-y-4">

                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href="/workers">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Workers
                        </Link>
                    </Button>
                </div>


                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <h2 className="text-base font-semibold text-destructive">
                        Failed to load worker
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The worker could not be loaded."}
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


    const fullName =
        `${worker.firstName} ${worker.lastName}`;


    return (
        <div className="space-y-6">

            {/* Page Actions */}
            <div className="flex items-center justify-between">

                <Button
                    variant="outline"
                    size="sm"
                    asChild
                >
                    <Link href="/workers">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Workers
                    </Link>
                </Button>


                <Button
                    type="button"
                    onClick={() => setEditOpen(true)}
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Worker
                </Button>

            </div>


            {/* Worker Header */}
            <div className="rounded-xl border bg-card p-6">

                <div className="flex flex-wrap items-center gap-3">

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {fullName}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Worker Number: {worker.workerNumber}
                        </p>
                    </div>


                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            worker.isActive
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        {worker.isActive
                            ? "Active"
                            : "Inactive"}
                    </span>

                </div>

            </div>


            {/* Personal Information */}
            <div className="rounded-xl border bg-card">

                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Basic information about this worker.
                    </p>
                </div>


                <div className="grid gap-6 p-6 sm:grid-cols-2">

                    <DetailItem
                        icon={Hash}
                        label="Worker Number"
                        value={worker.workerNumber}
                    />

                    <DetailItem
                        icon={Mail}
                        label="Email"
                        value={worker.email}
                    />

                    <DetailItem
                        icon={Phone}
                        label="Phone Number"
                        value={worker.phoneNumber}
                    />

                    <DetailItem
                        icon={CalendarDays}
                        label="Birth Date"
                        value={
                            worker.birthDate
                                ? new Date(
                                      worker.birthDate
                                  ).toLocaleDateString()
                                : null
                        }
                    />

                </div>

            </div>


            {/* Edit Worker Dialog */}
            <WorkerDialog
                worker={worker}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "worker",
                            workerId,
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["workers"],
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
