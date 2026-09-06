"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
    deleteUser,
    type User,
} from "@/lib/api/users";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

type DeleteUserDialogProps = {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onSuccess,
}: DeleteUserDialogProps) {
    const [isDeleting, setIsDeleting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setError(null);
        }
    }, [open]);

    async function handleDelete() {
        if (!user) {
            return;
        }

        setError(null);
        setIsDeleting(true);

        try {
            await deleteUser(user.id);

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(
                "Failed to delete user:",
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to delete user."
                )
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!isDeleting) {
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete User
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {user?.firstName}{" "}
                            {user?.lastName}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isDeleting}
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}

                        {isDeleting
                            ? "Deleting..."
                            : "Delete User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}