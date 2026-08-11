"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ClientDialog } from "./client-dialog";
import type { Client } from "@/lib/api/clients";

type ClientActionsProps = {
    client: Client;
    onSuccess: () => void;
};

export function ClientActions({
    client,
    onSuccess,
}: ClientActionsProps) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                    >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">
                            Open actions
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                    {/* View */}
                    <DropdownMenuItem asChild>
                        <Link href={`/clients/${client.id}`}>
                            <Eye className="mr-2 size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>

                    {/* Edit */}
                    <DropdownMenuItem
                        onSelect={() => {
                            setEditOpen(true);
                        }}
                    >
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Delete */}
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <ClientDialog
                client={client}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onSuccess}
            />
        </>
    );
}