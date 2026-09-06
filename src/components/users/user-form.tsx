"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    createUser,
    updateUser,
    type User,
} from "@/lib/api/users";

import { CURRENT_TENANT_ID } from "@/constants/tenant";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

type UserFormProps = {
    user?: User | null;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function UserForm({
    user,
    onSuccess,
    onCancel,
}: UserFormProps) {
    const isEditing = !!user;

    const [firstName, setFirstName] =
        useState(user?.firstName ?? "");

    const [lastName, setLastName] =
        useState(user?.lastName ?? "");

    const [email, setEmail] =
        useState(user?.email ?? "");

    const [phoneNumber, setPhoneNumber] =
        useState(user?.phoneNumber ?? "");

    const [isActive, setIsActive] =
        useState(user?.isActive ?? true);

    const [error, setError] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    useEffect(() => {
        setFirstName(user?.firstName ?? "");
        setLastName(user?.lastName ?? "");
        setEmail(user?.email ?? "");
        setPhoneNumber(user?.phoneNumber ?? "");
        setIsActive(user?.isActive ?? true);
        setError(null);
    }, [user]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        if (!firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditing && user) {
                await updateUser(user.id, {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phoneNumber:
                        phoneNumber.trim() || null,
                    isActive,
                });
            } else {
                await createUser({
                    tenantId: CURRENT_TENANT_ID,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phoneNumber:
                        phoneNumber.trim() || null,
                });
            }

            onSuccess?.();
        } catch (error) {
            console.error(
                `Failed to ${
                    isEditing
                        ? "update"
                        : "create"
                } user:`,
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    `Failed to ${
                        isEditing
                            ? "update"
                            : "create"
                    } user.`
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">
                        First name
                    </Label>

                    <Input
                        id="firstName"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(
                                event.target.value
                            )
                        }
                        disabled={isSubmitting}
                        placeholder="John"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">
                        Last name
                    </Label>

                    <Input
                        id="lastName"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(
                                event.target.value
                            )
                        }
                        disabled={isSubmitting}
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">
                    Email
                </Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                    disabled={isSubmitting}
                    placeholder="john@example.com"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                    Phone number
                </Label>

                <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(event) =>
                        setPhoneNumber(
                            event.target.value
                        )
                    }
                    disabled={isSubmitting}
                    placeholder="+63 912 345 6789"
                />
            </div>

            {isEditing && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="text-sm font-medium">
                            Account status
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Allow this user to access the system.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant={
                            isActive
                                ? "default"
                                : "outline"
                        }
                        onClick={() =>
                            setIsActive(
                                (value) => !value
                            )
                        }
                        disabled={isSubmitting}
                    >
                        {isActive
                            ? "Active"
                            : "Inactive"}
                    </Button>
                </div>
            )}

            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-2 border-t pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? isEditing
                            ? "Saving..."
                            : "Creating..."
                        : isEditing
                          ? "Save Changes"
                          : "Create User"}
                </Button>
            </div>
        </form>
    );
}