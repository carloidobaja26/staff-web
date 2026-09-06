"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
    createRole,
    updateRole,
    type Role,
} from "@/lib/api/roles";

import { getApiErrorMessage } from "@/lib/helpers/api-error";

type RoleFormProps = {
    role?: Role | null;
    onSuccess?: () => void;
    onCancel?: () => void;
};

type RoleFormValues = {
    name: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
};

export function RoleForm({
    role,
    onSuccess,
    onCancel,
}: RoleFormProps) {
    const queryClient = useQueryClient();

    const isEditing = !!role;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RoleFormValues>({
        defaultValues: {
            name: "",
            description: "",
            isSystemRole: false,
            isActive: true,
        },
    });

    useEffect(() => {
        reset({
            name: role?.name ?? "",
            description: role?.description ?? "",
            isSystemRole: role?.isSystemRole ?? false,
            isActive: role?.isActive ?? true,
        });
    }, [role, reset]);

    const mutation = useMutation({
        mutationFn: async (values: RoleFormValues) => {
            if (isEditing && role) {
                return updateRole(role.id, {
                    name: values.name,
                    description: values.description,
                    isSystemRole: values.isSystemRole,
                    isActive: values.isActive,
                });
            }

            return createRole({
                tenantId: null,
                name: values.name,
                description: values.description,
                isSystemRole: values.isSystemRole,
            });
        },

        onSuccess: async (updatedRole) => {
            /*
             * When editing from /roles/{roleId}, update the
             * individual role cache immediately.
             */
            if (isEditing && role) {
                queryClient.setQueryData(
                    ["role", role.id],
                    updatedRole
                );
            }

            /*
             * Refresh the paginated roles list as well.
             */
            await queryClient.invalidateQueries({
                queryKey: ["roles"],
            });

            onSuccess?.();
        },

        onError: (error) => {
            setError(
                "root",
                {
                    message: getApiErrorMessage(
                        error,
                        `Failed to ${
                            isEditing
                                ? "update"
                                : "create"
                        } role.`
                    ),
                }
            );
        },
    });

    const onSubmit = (values: RoleFormValues) => {
        mutation.reset();
        mutation.mutate(values);
    };

    const isSystemRole = watch("isSystemRole");
    const isActive = watch("isActive");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label htmlFor="name">
                    Name
                </Label>

                <Input
                    id="name"
                    placeholder="e.g. Scheduler"
                    {...register("name", {
                        required:
                            "Role name is required.",
                    })}
                />

                {errors.name && (
                    <p className="text-sm text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Textarea
                    id="description"
                    placeholder="Describe what this role is used for."
                    {...register("description")}
                />

                {errors.description && (
                    <p className="text-sm text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                    <Label>
                        System Role
                    </Label>

                    <p className="text-sm text-muted-foreground">
                        System roles are managed by the
                        application.
                    </p>
                </div>

                <Switch
                    checked={isSystemRole}
                    onCheckedChange={(checked) =>
                        setValue(
                            "isSystemRole",
                            checked,
                            {
                                shouldDirty: true,
                            }
                        )
                    }
                    disabled={
                        isEditing &&
                        role?.isSystemRole
                    }
                />
            </div>

            {isEditing && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                        <Label>
                            Active
                        </Label>

                        <p className="text-sm text-muted-foreground">
                            Inactive roles cannot be
                            assigned.
                        </p>
                    </div>

                    <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                            setValue(
                                "isActive",
                                checked,
                                {
                                    shouldDirty: true,
                                }
                            )
                        }
                    />
                </div>
            )}

            {errors.root && (
                <p className="text-sm text-destructive">
                    {errors.root.message}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isEditing
                        ? "Update Role"
                        : "Create Role"}
                </Button>
            </div>
        </form>
    );
}