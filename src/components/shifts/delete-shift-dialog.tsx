"use client";

import { useState } from "react";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Loader2,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    deleteShift,
    type Shift,
} from "@/lib/api/shifts";


type DeleteShiftDialogProps = {
    shift: Shift;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};


export function DeleteShiftDialog({
    shift,
    open,
    onOpenChange,
}: DeleteShiftDialogProps) {
    const queryClient =
        useQueryClient();

    const [error, setError] =
        useState<string | null>(null);


    const deleteMutation =
        useMutation({
            mutationFn: () =>
                deleteShift(shift.id),

            onSuccess: async () => {
                setError(null);

                /*
                 * Close dialog
                 */
                onOpenChange(false);

                /*
                 * Refresh shift list
                 */
                await queryClient.invalidateQueries({
                    queryKey: ["shifts"],
                });

                /*
                 * Refresh shift detail
                 */
                await queryClient.invalidateQueries({
                    queryKey: [
                        "shift",
                        shift.id,
                    ],
                });
            },

            onError: () => {
                setError(
                    "Failed to delete shift. Please try again."
                );
            },
        });


    const handleDelete = () => {
        setError(null);

        deleteMutation.mutate();
    };


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>

                <DialogHeader>

                    <DialogTitle>
                        Delete Shift
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {shift.name}
                        </span>
                        ?
                    </DialogDescription>

                </DialogHeader>


                <p className="text-sm text-muted-foreground">
                    This action cannot be undone.
                </p>


                {/* Error */}

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}


                <DialogFooter>

                    {/* Cancel */}

                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            deleteMutation.isPending
                        }
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Cancel
                    </Button>


                    {/* Delete */}

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={
                            deleteMutation.isPending
                        }
                        onClick={handleDelete}
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />

                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 size-4" />

                                Delete Shift
                            </>
                        )}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
