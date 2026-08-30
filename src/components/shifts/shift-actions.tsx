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

import type { Shift } from "@/lib/api/shifts";

import { ShiftDialog } from "./shift-dialog";
import { DeleteShiftDialog } from "./delete-shift-dialog";


type ShiftActionsProps = {
    shift: Shift;
    onSuccess: () => void;
};


export function ShiftActions({
    shift,
    onSuccess,
}: ShiftActionsProps) {
    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);


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
                        <Link
                            href={`/shifts/${shift.id}`}
                        >
                            <Eye className="mr-2 size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>


                    {/* Edit */}

                    <DropdownMenuItem
                        onSelect={() =>
                            setEditOpen(true)
                        }
                    >
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>


                    <DropdownMenuSeparator />


                    {/* Delete */}

                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() =>
                            setDeleteOpen(true)
                        }
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>


            {/* Edit Dialog */}

            <ShiftDialog
                shift={shift}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onSuccess}
            />


            {/* Delete Dialog */}

            <DeleteShiftDialog
                shift={shift}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
