"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserDialog } from "./user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";

import {
    deleteUser,
    getUsersPaginated,
    type User,
} from "@/lib/api/users";

import { getApiErrorMessage } from "@/lib/helpers/api-error";
import Link from "next/link";
import { Badge } from "../ui/badge";

export function UserTable() {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState<User | null>(null);

    const [deletingUser, setDeletingUser] =
        useState<User | null>(null);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "users",
            pageNumber,
            pageSize,
            search,
        ],

        queryFn: () =>
            getUsersPaginated({
                pageNumber,
                pageSize,
                search:
                    search.trim() ||
                    undefined,
            }),
    });

    const users =
        data?.items ?? [];

    const totalNumber =
        data?.totalNumber ?? 0;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalNumber /
                    pageSize
            )
        );

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) *
                    pageSize +
                1;

    const endItem =
        Math.min(
            pageNumber * pageSize,
            totalNumber
        );

    const deleteMutation =
        useMutation({
            mutationFn: (userId: string) =>
                deleteUser(userId),

            onSuccess: async () => {
                setDeletingUser(null);

                await queryClient.invalidateQueries({
                    queryKey: ["users"],
                });
            },
        });

    function handleSearchChange(
        value: string
    ) {
        setSearch(value);
        setPageNumber(1);
    }

    function handleAddUser() {
        setEditingUser(null);
        setDialogOpen(true);
    }

    function handleEditUser(user: User) {
        setEditingUser(user);
        setDialogOpen(true);
    }

    function handleDeleteUser(user: User) {
        deleteMutation.reset();
        setDeletingUser(user);
    }

    function handleUserSaved() {
        queryClient.invalidateQueries({
            queryKey: ["users"],
        });
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search users..."
                        className="pl-9"
                    />
                </div>

                <Button
                    onClick={handleAddUser}
                >
                    <Plus className="mr-2 size-4" />
                    Add User
                </Button>
            </div>

            {/* Error */}
            {isError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">
                        {getApiErrorMessage(
                            error,
                            "Failed to load users."
                        )}
                    </p>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="rounded-lg border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading users...
                    </p>
                </div>
            )}

            {/* Empty */}
            {!isLoading &&
                !isError &&
                users.length === 0 && (
                    <div className="rounded-lg border border-dashed p-10 text-center">
                        <Users className="mx-auto size-8 text-muted-foreground" />

                        <h3 className="mt-3 text-sm font-medium">
                            No users found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {search
                                ? "No users match your search."
                                : "There are no users yet."}
                        </p>

                        {!search && (
                            <Button
                                className="mt-4"
                                onClick={
                                    handleAddUser
                                }
                            >
                                <Plus className="mr-2 size-4" />
                                Add User
                            </Button>
                        )}
                    </div>
                )}

            {/* Table */}
            {!isLoading &&
                !isError &&
                users.length > 0 && (
                    <div className="overflow-hidden rounded-lg border">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            User
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Email
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Phone
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Roles
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Status
                                        </th>

                                        <th className="w-[60px] px-4 py-3" />
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(
                                        (user) => (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                                className="border-b last:border-0 transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <Link
                                                            href={`/users/${user.id}`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {user.firstName} {user.lastName}
                                                        </Link>

                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {
                                                                user.id
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-muted-foreground">
                                                        {user.email ||
                                                            "—"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-muted-foreground">
                                                        {user.phoneNumber ||
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.id} variant="secondary">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            ${
                                                                user.isActive
                                                                    ? "bg-green-500/10 text-green-600"
                                                                    : "bg-muted text-muted-foreground"
                                                            }
                                                        `}
                                                    >
                                                        {user.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleEditUser(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 size-4" />
                                                                Edit
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 size-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing{" "}
                                    <span className="font-medium text-foreground">
                                        {startItem}–
                                        {endItem}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium text-foreground">
                                        {
                                            totalNumber
                                        }
                                    </span>{" "}
                                    users
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Rows per page
                                    </span>

                                    <Select
                                        value={String(
                                            pageSize
                                        )}
                                        onValueChange={(
                                            value
                                        ) => {
                                            setPageSize(
                                                Number(
                                                    value
                                                )
                                            );
                                            setPageNumber(
                                                1
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="10">
                                                10
                                            </SelectItem>

                                            <SelectItem value="20">
                                                20
                                            </SelectItem>

                                            <SelectItem value="50">
                                                50
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        pageNumber ===
                                            1 ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPageNumber(
                                            (page) =>
                                                page -
                                                1
                                        )
                                    }
                                >
                                    <ChevronLeft className="mr-1 size-4" />
                                    Previous
                                </Button>

                                {Array.from(
                                    {
                                        length: totalPages,
                                    },
                                    (_, index) =>
                                        index + 1
                                ).map(
                                    (page) => (
                                        <Button
                                            key={
                                                page
                                            }
                                            size="sm"
                                            variant={
                                                pageNumber ===
                                                page
                                                    ? "default"
                                                    : "outline"
                                            }
                                            disabled={
                                                isFetching
                                            }
                                            onClick={() =>
                                                setPageNumber(
                                                    page
                                                )
                                            }
                                        >
                                            {
                                                page
                                            }
                                        </Button>
                                    )
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        pageNumber >=
                                            totalPages ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPageNumber(
                                            (page) =>
                                                page +
                                                1
                                        )
                                    }
                                >
                                    Next
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Create / Edit */}
            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={editingUser}
                onSuccess={
                    handleUserSaved
                }
            />

            {/* Delete */}
            <DeleteUserDialog
                user={deletingUser}
                open={!!deletingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingUser(
                            null
                        );
                    }
                }}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: ["users"],
                    });
                }}
            />
        </div>
    );
}