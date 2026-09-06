"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    UserForm,
} from "./user-form";

import type { User } from "@/lib/api/users";

type UserDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: () => void;
};

export function UserDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: UserDialogProps) {
    const isEditing = !!user;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Edit User"
                            : "Add User"}
                    </DialogTitle>
                </DialogHeader>

                <UserForm
                    user={user}
                    onSuccess={() => {
                        onSuccess();
                        onOpenChange(false);
                    }}
                    onCancel={() =>
                        onOpenChange(false)
                    }
                />
            </DialogContent>
        </Dialog>
    );
}