"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    RoleTable,
} from "@/components/roles/role-table";

import {
    RoleDialog,
} from "@/components/roles/role-dialog";

import {
    DeleteRoleDialog,
} from "@/components/roles/role-delete-dialog";

import type { Role } from "@/lib/api/roles";

export default function RolesPage() {
    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedRole, setSelectedRole] =
        useState<Role | null>(null);

    const handleCreate = () => {
        setSelectedRole(null);
        setDialogOpen(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setDialogOpen(true);
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Roles
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage user roles and access levels.
                    </p>
                </div>

                <Button onClick={handleCreate}>
                    <Plus className="mr-2 size-4" />
                    Add Role
                </Button>
            </div>

            {/* Table */}
            <RoleTable
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Create / Edit */}
            <RoleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                role={selectedRole}
            />

            {/* Delete */}
            <DeleteRoleDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                role={selectedRole}
            />
        </div>
    );
}