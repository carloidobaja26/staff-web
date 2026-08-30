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

import type { Worker } from "@/lib/api/workers";
import { WorkerForm } from "./worker-form";

type WorkerDialogProps = {
    worker?: Worker;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess: () => void;
};

export function WorkerDialog({
    worker,
    open,
    onOpenChange,
    onSuccess,
}: WorkerDialogProps) {
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
                        Add Worker
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {worker
                            ? "Edit Worker"
                            : "Add Worker"}
                    </DialogTitle>
                </DialogHeader>

                <WorkerForm
                    worker={worker}
                    onSuccess={handleSuccess}
                    onCancel={() =>
                        handleOpenChange(false)
                    }
                />
            </DialogContent>
        </Dialog>
    );
}

