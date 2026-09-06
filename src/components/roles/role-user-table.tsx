"use client";

import { useEffect, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
    getUsersPaginated,
    type User,
} from "@/lib/api/users";

import {
    assignRoles,
    removeRole,
} from "@/lib/api/roles";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

type RoleUsersTableProps = {
    roleId: string;
    onUserCountChange?: (delta: number) => void;
};

export function RoleUsersTable({
    roleId,
    onUserCountChange,
}: RoleUsersTableProps) {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [mutationError, setMutationError] =
        useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPageNumber(1);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const {
        data,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: [
            "role-users",
            roleId,
            pageNumber,
            pageSize,
            debouncedSearch,
        ],

        queryFn: () =>
            getUsersPaginated({
                pageNumber,
                pageSize,
                search:
                    debouncedSearch.trim() ||
                    undefined,
            }),
    });

    const users = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;

    const totalPages = Math.ceil(
        totalNumber / pageSize
    );

    const isUserAssigned = (user: User) => {
        return user.roles.some(
            (role) => role.id === roleId
        );
    };

    const mutation = useMutation({
        mutationFn: async ({
            user,
            assigned,
        }: {
            user: User;
            assigned: boolean;
        }) => {
            const currentlyAssigned =
                isUserAssigned(user);

            // Nothing to do if the state hasn't actually changed.
            if (assigned === currentlyAssigned) {
                return {
                    changed: false,
                    assigned,
                };
            }

            if (assigned) {
                const existingRoleIds =
                    user.roles.map(
                        (role) => role.id
                    );

                await assignRoles(user.id, {
                    roleIds: [
                        ...existingRoleIds,
                        roleId,
                    ],
                });

                return {
                    changed: true,
                    assigned: true,
                };
            }

            await removeRole(
                user.id,
                roleId
            );

            return {
                changed: true,
                assigned: false,
            };
        },

        onSuccess: async (result) => {
            setMutationError(null);

            if (result.changed) {
                onUserCountChange?.(
                    result.assigned ? 1 : -1
                );
            }

            await queryClient.invalidateQueries({
                queryKey: [
                    "role-users",
                    roleId,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            // Keep the role details cache in sync too.
            await queryClient.invalidateQueries({
                queryKey: ["role", roleId],
            });
        },

        onError: (error) => {
            setMutationError(
                getApiErrorMessage(
                    error,
                    "Failed to update user role."
                )
            );
        },
    });

    const handleAssignmentChange = (
        user: User,
        checked: boolean
    ) => {
        setMutationError(null);

        mutation.mutate({
            user,
            assigned: checked,
        });
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search users..."
                    className="pl-9"
                />
            </div>

            {mutationError && (
                <p className="text-sm text-destructive">
                    {mutationError}
                </p>
            )}

            {/* Table */}
            <div className="rounded-md border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="w-20 px-4 py-3 text-center font-medium">
                                    Assigned
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    User
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Email
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Roles
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="h-32 text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="size-4 animate-spin" />
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const assigned =
                                        isUserAssigned(
                                            user
                                        );

                                    const isUpdating =
                                        mutation.isPending &&
                                        mutation.variables
                                            ?.user.id ===
                                            user.id;

                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center">
                                                    {isUpdating ? (
                                                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                                    ) : (
                                                        <Checkbox
                                                            checked={
                                                                assigned
                                                            }
                                                            disabled={
                                                                mutation.isPending
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
                                                                handleAssignmentChange(
                                                                    user,
                                                                    checked ===
                                                                        true
                                                                )
                                                            }
                                                            aria-label={
                                                                assigned
                                                                    ? `Remove ${user.firstName} ${user.lastName} from role`
                                                                    : `Assign ${user.firstName} ${user.lastName} to role`
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {
                                                        user.firstName
                                                    }{" "}
                                                    {
                                                        user.lastName
                                                    }
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-muted-foreground">
                                                {user.email}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length >
                                                    0 ? (
                                                        user.roles.map(
                                                            (
                                                                role
                                                            ) => (
                                                                <Badge
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    variant={
                                                                        role.id ===
                                                                        roleId
                                                                            ? "default"
                                                                            : "secondary"
                                                                    }
                                                                >
                                                                    {
                                                                        role.name
                                                                    }
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            No roles
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
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
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {totalNumber === 0
                        ? "No users"
                        : `Showing ${
                              (pageNumber - 1) *
                                  pageSize +
                              1
                          }–${Math.min(
                              pageNumber * pageSize,
                              totalNumber
                          )} of ${totalNumber}`}
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        onChange={(event) => {
                            setPageSize(
                                Number(
                                    event.target.value
                                )
                            );
                            setPageNumber(1);
                        }}
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                    >
                        <option value={10}>
                            10
                        </option>
                        <option value={20}>
                            20
                        </option>
                        <option value={50}>
                            50
                        </option>
                    </select>

                    <button
                        type="button"
                        disabled={
                            pageNumber <= 1 ||
                            isFetching ||
                            mutation.isPending
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) =>
                                    page - 1
                            )
                        }
                        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm">
                        Page {pageNumber} of{" "}
                        {Math.max(
                            totalPages,
                            1
                        )}
                    </span>

                    <button
                        type="button"
                        disabled={
                            pageNumber >=
                                totalPages ||
                            isFetching ||
                            mutation.isPending
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) =>
                                    page + 1
                            )
                        }
                        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}