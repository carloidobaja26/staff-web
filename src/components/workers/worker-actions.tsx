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

import type { Worker } from "@/lib/api/workers";

import { WorkerDialog } from "./worker-dialog";
import { DeleteWorkerDialog } from "./delete-worker-dialog";

type WorkerActionsProps = {
    worker: Worker;
    onSuccess: () => void;
};

export function WorkerActions({
    worker,
    onSuccess,
}: WorkerActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

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
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/workers/${worker.id}`}
                        >
                            <Eye className="mr-2 size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() => {
                            setEditOpen(true);
                        }}
                    >
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => {
                            setDeleteOpen(true);
                        }}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <WorkerDialog
                worker={worker}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onSuccess}
            />

            <DeleteWorkerDialog
                worker={worker}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
