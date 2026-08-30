"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";

import { EventForm } from "./event-form";
import type { Event } from "@/lib/api/events";

type EventDialogProps = {
event?: Event;
clientId?: string;
open?: boolean;
onOpenChange?: (open: boolean) => void;
onSuccess: () => void;
};

export function EventDialog({
event,
clientId,
open,
onOpenChange,
onSuccess,
}: EventDialogProps) {
const [internalOpen, setInternalOpen] = useState(false);

const isControlled = open !== undefined;

const dialogOpen = isControlled
    ? open
    : internalOpen;

const handleOpenChange = (value: boolean) => {
    if (isControlled) {
        onOpenChange?.(value);
    } else {
        setInternalOpen(value);
    }
};

const handleSuccess = () => {
    handleOpenChange(false);
    onSuccess();
};

return (
    <Dialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
    >
        {!isControlled && (
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    Add Event
                </Button>
            </DialogTrigger>
        )}

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>
                    {event
                        ? "Edit Event"
                        : "Add Event"}
                </DialogTitle>
            </DialogHeader>

            <EventForm
                event={event}
                clientId={clientId}
                onSuccess={handleSuccess}
                onCancel={() =>
                    handleOpenChange(false)
                }
            />
        </DialogContent>
    </Dialog>
);

}
