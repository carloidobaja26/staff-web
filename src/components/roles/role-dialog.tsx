"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { RoleForm } from "./role-form";
import type { Role } from "@/lib/api/roles";

type RoleDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role | null;
};

export function RoleDialog({
    open,
    onOpenChange,
    role,
}: RoleDialogProps) {
    const isEditing = !!role;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Edit Role"
                            : "Create Role"}
                    </DialogTitle>
                </DialogHeader>

                <RoleForm
                    role={role}
                    onSuccess={() =>
                        onOpenChange(false)
                    }
                    onCancel={() =>
                        onOpenChange(false)
                    }
                />
            </DialogContent>
        </Dialog>
    );
}