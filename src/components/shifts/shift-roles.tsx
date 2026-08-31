"use client";

import { useState } from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    getShiftRoles,
    deleteShiftRole,
    type ShiftRole,
} from "@/lib/api/shift-roles";

import { ShiftRoleDialog } from "./shift-role-dialog";


type ShiftRolesProps = {
    shiftId: string;
};


export function ShiftRoles({
    shiftId,
}: ShiftRolesProps) {

    const queryClient =
        useQueryClient();


    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedRole, setSelectedRole] =
        useState<ShiftRole | null>(null);


    const {
        data: roles = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "shift-roles",
            shiftId,
        ],

        queryFn: () =>
            getShiftRoles(shiftId),

        enabled: !!shiftId,
    });


    function handleAdd() {

        setSelectedRole(null);
        setDialogOpen(true);

    }


    function handleEdit(
        role: ShiftRole
    ) {

        setSelectedRole(role);
        setDialogOpen(true);

    }


    async function handleDelete(
        role: ShiftRole
    ) {

        const confirmed =
            window.confirm(
                `Delete "${role.name}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteShiftRole(
                role.id
            );


            queryClient.invalidateQueries({
                queryKey: [
                    "shift-roles",
                    shiftId,
                ],
            });

        } catch (error) {

            window.alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete shift role."
            );

        }

    }


    function handleSuccess() {

        queryClient.invalidateQueries({
            queryKey: [
                "shift-roles",
                shiftId,
            ],
        });

    }


    return (
        <>
            <div className="rounded-xl border bg-card">

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>

                        <h2 className="font-semibold">
                            Shift Roles
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Roles and staffing requirements
                            for this shift.
                        </p>

                    </div>


                    <Button
                        size="sm"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 size-4" />
                        Add Role
                    </Button>

                </div>


                {/* Content */}

                <div className="p-6">

                    {isLoading && (
                        <p className="text-sm text-muted-foreground">
                            Loading shift roles...
                        </p>
                    )}


                    {isError && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">

                            <p className="text-sm font-medium text-destructive">
                                Failed to load shift roles.
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {error instanceof Error
                                    ? error.message
                                    : "Something went wrong."}
                            </p>

                        </div>
                    )}


                    {!isLoading &&
                        !isError &&
                        roles.length === 0 && (

                            <div className="rounded-lg border border-dashed p-8 text-center">

                                <Users className="mx-auto size-8 text-muted-foreground" />

                                <h3 className="mt-3 text-sm font-medium">
                                    No shift roles
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add the roles needed
                                    for this shift.
                                </p>

                                <Button
                                    size="sm"
                                    className="mt-4"
                                    onClick={handleAdd}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add Role
                                </Button>

                            </div>

                        )}


                    {!isLoading &&
                        !isError &&
                        roles.length > 0 && (

                            <div className="divide-y">

                                {roles.map(
                                    (role) => (

                                        <ShiftRoleRow
                                            key={role.id}
                                            role={role}
                                            onEdit={() =>
                                                handleEdit(
                                                    role
                                                )
                                            }
                                            onDelete={() =>
                                                handleDelete(
                                                    role
                                                )
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                </div>

            </div>


            <ShiftRoleDialog
                shiftId={shiftId}
                role={selectedRole}
                open={dialogOpen}
                onOpenChange={
                    setDialogOpen
                }
                onSuccess={
                    handleSuccess
                }
            />
        </>
    );
}


type ShiftRoleRowProps = {
    role: ShiftRole;
    onEdit: () => void;
    onDelete: () => void;
};


function ShiftRoleRow({
    role,
    onEdit,
    onDelete,
}: ShiftRoleRowProps) {

    return (
        <div className="flex items-center justify-between gap-4 py-4">

            <div className="min-w-0">

                <div className="flex items-center gap-2">

                    <p className="font-medium">
                        {role.name}
                    </p>

                    {!role.isActive && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            Inactive
                        </span>
                    )}

                </div>


                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">

                    <span>
                        {role.requestedWorkers}{" "}
                        {role.requestedWorkers === 1
                            ? "worker"
                            : "workers"}
                    </span>


                    <span>
                        {formatRate(
                            role.rate
                        )}{" "}
                        /{" "}
                        {getRateTypeLabel(
                            role.rateType
                        )}
                    </span>

                </div>


                {role.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {role.notes}
                    </p>
                )}

            </div>


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
                        onClick={onEdit}
                    >
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>


                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={onDelete}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

        </div>
    );
}


function formatRate(
    rate: number
) {

    return new Intl.NumberFormat(
        undefined,
        {
            style: "currency",
            currency: "PHP",
        }
    ).format(rate);

}


function getRateTypeLabel(
    rateType: number
) {

    switch (rateType) {

        case 1:
            return "hour";

        case 2:
            return "day";

        case 3:
            return "fixed";

        default:
            return "rate";

    }

}