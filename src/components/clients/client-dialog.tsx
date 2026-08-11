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

import { ClientForm } from "./client-form";
import type { Client } from "@/lib/api/clients";

type ClientDialogProps = {
    client?: Client;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess: () => void;
};

export function ClientDialog({
    client,
    open,
    onOpenChange,
    onSuccess,
}: ClientDialogProps) {
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
                        Add Client
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {client
                            ? "Edit Client"
                            : "Add Client"}
                    </DialogTitle>
                </DialogHeader>

                <ClientForm
                    client={client}
                    onSuccess={handleSuccess}
                    onCancel={() => handleOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}