"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Pencil,
    Shield,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getRole } from "@/lib/api/roles";

import { RoleDialog } from "@/components/roles/role-dialog";
import { RoleUsersTable } from "@/components/roles/role-user-table";

export default function RoleDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const roleId = params.id as string;

    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const {
        data: role,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["role", roleId],
        queryFn: () => getRole(roleId),
        enabled: !!roleId,
    });

    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        if (role) {
            setUserCount(role.userCount ?? 0);
        }
    }, [role]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back
                    </Button>
                </div>

                <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                    Loading role...
                </div>
            </div>
        );
    }

    if (isError || !role) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                </Button>

                <div className="rounded-lg border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Role could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
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
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {role.name}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            View role details and configuration.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        setEditDialogOpen(true)
                    }
                >
                    <Pencil className="mr-2 size-4" />
                    Edit Role
                </Button>
            </div>

            {/* Role Information */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Role Information
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Name
                            </p>

                            <p className="font-medium">
                                {role.name}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Description
                            </p>

                            <p className="font-medium">
                                {role.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Role Type
                            </p>

                            <div>
                                {role.isSystemRole ? (
                                    <Badge variant="secondary">
                                        <Shield className="mr-1 size-3" />
                                        System Role
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">
                                        Custom Role
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>

                            <div>
                                {role.isActive ? (
                                    <Badge>
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Inactive
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Count */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Assigned Users
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40">
                            <Users className="size-5 text-muted-foreground" />
                        </div>

                        <div>
                            <p className="text-2xl font-semibold">
                                {userCount}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                users assigned to this role
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>

                    <CardDescription>
                        Manage which users are assigned to this role.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <RoleUsersTable
                        roleId={roleId}
                        onUserCountChange={(delta) => {
                            setUserCount((count) =>
                                Math.max(
                                    0,
                                    count + delta
                                )
                            );
                        }}
                    />
                </CardContent>
            </Card>

            {/* Edit Role */}
            <RoleDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                role={role}
            />
        </div>
    );
}