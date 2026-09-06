"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Role } from "@/lib/api/roles";

type RoleActionsProps = {
    role: Role;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
};

export function RoleActions({
    role,
    onEdit,
    onDelete,
}: RoleActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">
                        Role actions
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => onEdit(role)}
                >
                    <Pencil className="mr-2 size-4" />
                    Edit
                </DropdownMenuItem>

                {!role.isSystemRole && (
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                            onDelete(role)
                        }
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}