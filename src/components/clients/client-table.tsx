"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/lib/api/clients";
import { useState } from "react";
import { ClientDialog } from "./client-dialog";
import { ClientActions } from "./client-actions";

export function ClientTable() {
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 10;
    const queryClient = useQueryClient();
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["clients", pageNumber, pageSize],
        queryFn: () => getClients(pageNumber, pageSize),
    });
    const clients = data?.items ?? [];
    const totalNumber = data?.totalNumber ?? 0;

    const totalPages = Math.ceil(totalNumber / pageSize);

    const startItem =
        totalNumber === 0
            ? 0
            : (pageNumber - 1) * pageSize + 1;

    const endItem = Math.min(
        pageNumber * pageSize,
        totalNumber
    );
    if (isLoading) {
        return (
            <div className="rounded-xl border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Loading clients...
                </p>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="rounded-xl border p-8 text-center">
                <p className="text-sm font-medium">
                    Failed to load clients
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong."}
                </p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
  {/* Search + Add Client */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {/* Search */}
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder="Search clients..."
        className="pl-9"
      />
    </div>

    {/* Add Client */}
    <ClientDialog
      onSuccess={() => {
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        });
      }}
    />
  </div>
            <div className="rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Client Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Company Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Contact Person
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Phone
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Client Number
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Notes
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <td className="px-4 py-4">
                                        <p className="font-medium">
                                            {client.name}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.companyName}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.contactPerson}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.email}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.phoneNumber}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.clientNumber}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">
                                        {client.notes}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${client.isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {client.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <ClientActions
                                        client={client}
                                        onSuccess={() => {
                                            queryClient.invalidateQueries({
                                            queryKey: ["clients"],
                                            });
                                        }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        {startItem}–{endItem} of {totalNumber} clients
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pageNumber === 1}
                            onClick={() =>
                                setPageNumber((page) => page - 1)
                            }
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-muted-foreground">
                            Page {pageNumber} of {totalPages || 1}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pageNumber >= totalPages}
                            onClick={() =>
                                setPageNumber((page) => page + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}