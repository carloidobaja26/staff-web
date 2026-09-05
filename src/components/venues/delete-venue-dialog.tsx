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
    deleteVenue,
    type Venue,
} from "@/lib/api/venues";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

type DeleteVenueDialogProps = {
    venue: Venue;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteVenueDialog({
    venue,
    open,
    onOpenChange,
}: DeleteVenueDialogProps) {
    const queryClient = useQueryClient();

    const [error, setError] =
        useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: () =>
            deleteVenue(venue.id),

        onSuccess: async () => {
            setError(null);

            onOpenChange(false);

            await queryClient.invalidateQueries({
                queryKey: ["venues"],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    "venue",
                    venue.id,
                ],
            });
        },

        onError: (error) => {
            console.error(
                "Failed to delete venue:",
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to delete venue."
                )
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
                        Delete Venue
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {venue.name}
                        </span>
                        ?
                    </DialogDescription>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    This action cannot be undone.
                </p>

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <DialogFooter>
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
                                Delete Venue
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
