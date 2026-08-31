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

import { ShiftForm } from "./shift-form";

import type {
    Shift,
} from "@/lib/api/shifts";


type ShiftDialogProps = {
    shift?: Shift;

    eventId?: string;

    open?: boolean;

    onOpenChange?: (
        open: boolean
    ) => void;

    onSuccess: () => void;
};


export function ShiftDialog({
    shift,
    eventId,
    open,
    onOpenChange,
    onSuccess,
}: ShiftDialogProps) {
    const [
        internalOpen,
        setInternalOpen,
    ] = useState(false);


    const isControlled =
        open !== undefined;


    const dialogOpen = isControlled
        ? open
        : internalOpen;


    const handleOpenChange = (
        value: boolean
    ) => {
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
                        Add Shift
                    </Button>
                </DialogTrigger>
            )}


            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">

                <DialogHeader>
                    <DialogTitle>
                        {shift
                            ? "Edit Shift"
                            : "Add Shift"}
                    </DialogTitle>
                </DialogHeader>


                <ShiftForm
                    shift={shift}
                    eventId={eventId}
                    onSuccess={handleSuccess}
                    onCancel={() =>
                        handleOpenChange(false)
                    }
                />

            </DialogContent>

        </Dialog>
    );
}
