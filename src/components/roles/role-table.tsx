"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Shield,
    Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
    getRoles,
    type Role,
} from "@/lib/api/roles";

import { RoleActions } from "./role-action";
import Link from "next/link";
type RoleTableProps = {
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
};

export function RoleTable({
    onEdit,
    onDelete,
}: RoleTableProps) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPageNumber(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isFetching } =
        useQuery({
            queryKey: [
                "roles",
                pageNumber,
                pageSize,
                debouncedSearch,
            ],
            queryFn: () =>
                getRoles({
                    pageNumber,
                    pageSize,
                    search: debouncedSearch,
                }),
        });

    const roles = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;
    const totalPages = Math.ceil(
            totalNumber / pageSize
        );
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
                    placeholder="Search roles..."
                    className="pl-9"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="h-11 px-4 text-left font-medium">
                                Role
                            </th>

                            <th className="h-11 px-4 text-left font-medium">
                                Description
                            </th>

                            <th className="h-11 px-4 text-left font-medium">
                                Users
                            </th>

                            <th className="h-11 px-4 text-left font-medium">
                                Status
                            </th>

                            <th className="h-11 w-[80px] px-4 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Loading roles...
                                </td>
                            </tr>
                        ) : roles.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No roles found.
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                    href={`/roles/${role.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                            <Shield className="size-4 text-muted-foreground" />

                                            <span className="font-medium">
   
                                                {role.name}
                                            </span>

                                            {role.isSystemRole && (
                                                <Badge variant="secondary">
                                                    System
                                                </Badge>
                                            )}
                                            </Link>
                                        </div>
                                    </td>

                                    <td className="max-w-md px-4 py-3 text-muted-foreground">
                                        {role.description ||
                                            "—"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {role.userCount}
                                    </td>

                                    <td className="px-4 py-3">
                                        {role.isActive ? (
                                            <Badge>
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                Inactive
                                            </Badge>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <RoleActions
                                            role={role}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {totalNumber === 0
                        ? "No roles"
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
                        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={
                            pageNumber <= 1 ||
                            isFetching
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) => page - 1
                            )
                        }
                    >
                        Previous
                    </button>

                    <span className="text-sm">
                        {pageNumber} /{" "}
                        {totalPages || 1}
                    </span>

                    <button
                        type="button"
                        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={
                            pageNumber >=
                                totalPages ||
                            isFetching
                        }
                        onClick={() =>
                            setPageNumber(
                                (page) => page + 1
                            )
                        }
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}