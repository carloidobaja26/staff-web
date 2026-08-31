"use client";

import { useEffect, useState } from "react";

import {
    createShiftRole,
    updateShiftRole,
    type ShiftRole,
} from "@/lib/api/shift-roles";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    CURRENT_TENANT_ID,
    CURRENT_AGENCY_ID,
} from "@/constants/tenant";

type ShiftRoleDialogProps = {
    shiftId: string;
    role?: ShiftRole | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};


export function ShiftRoleDialog({
    shiftId,
    role,
    open,
    onOpenChange,
    onSuccess,
}: ShiftRoleDialogProps) {

    const isEditing = !!role;


    const [name, setName] = useState("");
    const [requestedWorkers, setRequestedWorkers] =
        useState("1");

    const [rate, setRate] =
        useState("");

    const [rateType, setRateType] =
        useState("1");

    const [notes, setNotes] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        if (!open) {
            return;
        }

        setName(role?.name ?? "");

        setRequestedWorkers(
            String(role?.requestedWorkers ?? 1)
        );

        setRate(
            role?.rate != null
                ? String(role.rate)
                : ""
        );

        setRateType(
            String(role?.rateType ?? 1)
        );

        setNotes(
            role?.notes ?? ""
        );

        setError(null);

    }, [open, role]);


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        setError(null);


        if (!name.trim()) {
            setError("Role name is required.");
            return;
        }


        const workers =
            Number(requestedWorkers);

        const roleRate =
            Number(rate);


        if (
            !Number.isInteger(workers) ||
            workers < 1
        ) {
            setError(
                "Requested workers must be at least 1."
            );

            return;
        }


        if (
            Number.isNaN(roleRate) ||
            roleRate < 0
        ) {
            setError(
                "Rate must be a valid amount."
            );

            return;
        }


        try {

            setIsSubmitting(true);


            if (isEditing) {

                await updateShiftRole(
                    role.id,
                    {
                        name: name.trim(),
                        requestedWorkers: workers,
                        rate: roleRate,
                        rateType: Number(rateType),
                        notes: notes.trim() || null,
                    }
                );

            } else {

                await createShiftRole({
                    tenantId: CURRENT_TENANT_ID,
                    shiftId,
                    name: name.trim(),
                    requestedWorkers: workers,
                    rate: roleRate,
                    rateType: Number(rateType),
                    notes: notes.trim() || null,
                });

            }


            onSuccess();
            onOpenChange(false);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save shift role."
            );

        } finally {

            setIsSubmitting(false);

        }

    }


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>
                        {isEditing
                            ? "Edit Shift Role"
                            : "Add Shift Role"}
                    </DialogTitle>

                </DialogHeader>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div className="space-y-2">

                        <Label htmlFor="role-name">
                            Role Name
                        </Label>

                        <Input
                            id="role-name"
                            placeholder="e.g. Waiter"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            disabled={isSubmitting}
                        />

                    </div>


                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="space-y-2">

                            <Label htmlFor="requested-workers">
                                Requested Workers
                            </Label>

                            <Input
                                id="requested-workers"
                                type="number"
                                min="1"
                                value={
                                    requestedWorkers
                                }
                                onChange={(event) =>
                                    setRequestedWorkers(
                                        event.target.value
                                    )
                                }
                                disabled={isSubmitting}
                            />

                        </div>


                        <div className="space-y-2">

                            <Label htmlFor="rate">
                                Rate
                            </Label>

                            <Input
                                id="rate"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={rate}
                                onChange={(event) =>
                                    setRate(
                                        event.target.value
                                    )
                                }
                                disabled={isSubmitting}
                            />

                        </div>

                    </div>


                    <div className="space-y-2">

                        <Label>
                            Rate Type
                        </Label>

                        <Select
                            value={rateType}
                            onValueChange={
                                setRateType
                            }
                            disabled={isSubmitting}
                        >

                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="1">
                                    Hourly
                                </SelectItem>

                                <SelectItem value="2">
                                    Daily
                                </SelectItem>
                                <SelectItem value="3">
                                    Fixed
                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </div>


                    <div className="space-y-2">

                        <Label htmlFor="notes">
                            Notes
                        </Label>

                        <Textarea
                            id="notes"
                            placeholder="Optional notes..."
                            value={notes}
                            onChange={(event) =>
                                setNotes(
                                    event.target.value
                                )
                            }
                            disabled={isSubmitting}
                        />

                    </div>


                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}


                    <div className="flex justify-end gap-2">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add Role"}
                        </Button>

                    </div>

                </form>

            </DialogContent>

        </Dialog>
    );
}