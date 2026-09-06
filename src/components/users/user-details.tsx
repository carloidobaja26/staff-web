"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    CalendarDays,
    Edit,
    Mail,
    Phone,
    User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { UserDialog } from "@/components/users/user-dialog";
import { getUser } from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

export function UserDetails() {
    const params = useParams();
    const queryClient = useQueryClient();

    const userId = params.id as string;

    const [editOpen, setEditOpen] = useState(false);

    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
                    <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-muted" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="h-64 animate-pulse rounded-xl bg-muted lg:col-span-2" />
                    <div className="h-64 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="space-y-6">
                <Link href="/users">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="size-4" />
                        Back to Users
                    </Button>
                </Link>

                <Card>
                    <CardContent className="py-10">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold">
                                Unable to load user
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {getApiErrorMessage(
                                    error,
                                    "Failed to load user details."
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const fullName =
        `${user.firstName} ${user.lastName}`.trim();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <Link href="/users">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mt-1"
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {fullName}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            User details and activity
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant={
                            user.isActive
                                ? "default"
                                : "secondary"
                        }
                    >
                        {user.isActive
                            ? "Active"
                            : "Inactive"}
                    </Badge>

                    <Button
                        variant="outline"
                        onClick={() => setEditOpen(true)}
                    >
                        <Edit className="size-4" />
                        Edit User
                    </Button>
                </div>
            </div>

            {/* User Information */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            User Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <UserIcon className="size-4 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Full Name
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <Mail className="size-4 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm font-medium">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <Phone className="size-4 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Phone Number
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {user.phoneNumber ||
                                            "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <CalendarDays className="size-4 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        User ID
                                    </p>

                                    <p className="mt-1 break-all font-mono text-xs">
                                        {user.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Account Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Status
                                </p>

                                <div className="mt-2">
                                    <Badge
                                        variant={
                                            user.isActive
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Tenant ID
                                </p>

                                <p className="mt-1 break-all font-mono text-xs">
                                    {user.tenantId}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        User Timeline
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                        Activity and important events related
                        to this user.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                            <CalendarDays className="mx-auto size-8 text-muted-foreground" />

                            <h3 className="mt-3 text-sm font-medium">
                                No timeline activity yet
                            </h3>

                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                User activity, bookings,
                                agency actions, and other
                                events will appear here once
                                timeline tracking is available.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <UserDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                user={user}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: ["user", userId],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["users"],
                    });
                }}
            />
        </div>
    );
}
