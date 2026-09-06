"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    deleteRole,
    type Role,
} from "@/lib/api/roles";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

type DeleteRoleDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
};

export function DeleteRoleDialog({
    open,
    onOpenChange,
    role,
}: DeleteRoleDialogProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (!role) {
                throw new Error("Role is required.");
            }

            return deleteRole(role.id);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["roles"],
            });

            onOpenChange(false);
        },
    });

    const errorMessage = mutation.error
        ? getApiErrorMessage(
              mutation.error,
              "Failed to delete role."
          )
        : null;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Role
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium">
                            {role?.name}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {errorMessage && (
                    <p className="text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() =>
                            mutation.mutate()
                        }
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}