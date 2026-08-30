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

import { VenueDialog } from "./venue-dialog";
import type { Venue } from "@/lib/api/venues";
import { DeleteVenueDialog } from "./delete-venue-dialog";


type VenueActionsProps = {
    venue: Venue;
    onSuccess: () => void;
};


export function VenueActions({
    venue,
    onSuccess,
}: VenueActionsProps) {
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
                            href={`/venues/${venue.id}`}
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


            {/* Edit Venue Dialog */}
            <VenueDialog
                venue={venue}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onSuccess}
            />


            {/* Delete Venue Dialog */}
            <DeleteVenueDialog
                venue={venue}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}

