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

import { EventDialog } from "./event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";

import type { Event } from "@/lib/api/events";
import { useAgencyStore } from "@/stores/agency-store";

type EventActionsProps = {
    event: Event;
    onSuccess: () => void;
};
export function EventActions({
    event,
    onSuccess,
}: EventActionsProps) {
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
                            Open event actions
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                    {/* View */}
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/events/${event.id}`}
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

            {/* Edit Event Dialog */}
            <EventDialog
                event={event}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onSuccess}
            />

            {/* Delete Event Dialog */}
            <DeleteEventDialog
                event={event}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );

}
