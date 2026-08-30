"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { deleteClient, type Client } from "@/lib/api/clients";

type DeleteClientDialogProps = {
    client: Client;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteClientDialog({
    client,
    open,
    onOpenChange,
}: DeleteClientDialogProps) {
    const queryClient = useQueryClient();

    const [error, setError] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: () => deleteClient(client.id),

        onSuccess: async () => {
            setError(null);

            // Close dialog
            onOpenChange(false);

            // Refresh clients table
            await queryClient.invalidateQueries({
                queryKey: ["clients"],
            });

            // Remove / refresh client detail cache
            await queryClient.invalidateQueries({
                queryKey: ["client", client.id],
            });
        },

        onError: () => {
            setError(
                "Failed to delete client. Please try again."
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
                        Delete Client
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {client.name}
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
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
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
                                Delete Client
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}