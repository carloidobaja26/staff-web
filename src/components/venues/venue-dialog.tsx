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

import { VenueForm } from "./venue-form";
import type { Venue } from "@/lib/api/venues";

type VenueDialogProps = {
    venue?: Venue;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess: () => void;
};

export function VenueDialog({
    venue,
    open,
    onOpenChange,
    onSuccess,
}: VenueDialogProps) {
    const [internalOpen, setInternalOpen] =
        useState(false);

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
                        Add Venue
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {venue
                            ? "Edit Venue"
                            : "Add Venue"}
                    </DialogTitle>
                </DialogHeader>

                <VenueForm
                    venue={venue}
                    onSuccess={handleSuccess}
                    onCancel={() =>
                        handleOpenChange(false)
                    }
                />
            </DialogContent>
        </Dialog>
    );
}

